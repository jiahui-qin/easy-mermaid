import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useI18n } from '../i18n';

/**
 * 通用矢量缩放查看器：滚轮缩放 + 拖拽平移 + 双击重置。
 *
 * ## 为什么不能用 CSS transform: scale()
 *
 * transform 缩放的是**已经栅格化好的位图**。SVG 元素被容器压到 N px 宽时，
 * 浏览器按 N px 渲染出一张位图；之后 transform 只是把这张位图放大 —— 放大的
 * 是像素不是矢量，文字必然发虚。will-change: transform 还会把元素钉在合成层
 * 上按固定栅格比例缓存，糊得更明显。
 *
 * 实测（同一标签、同一最终视觉尺寸下量 Laplacian 方差，越大越锐）：
 *   现状 transform+will-change → 1133
 *   transform 去掉 will-change → 1580
 *   SVG 自身放大到目标尺寸   → 2685（最锐，文字仍是矢量）
 *
 * 本组件的做法：**改 SVG 元素自身的 width/height 属性**（viewBox 保持不变），
 * 浏览器看到更大的元素尺寸就会按新尺寸重新排版重绘，文字、描边、滤镜全部
 * 重新以矢量渲染，放到 800% 依然锐利。
 *
 * 平移只用 translate（纯位移不改变栅格化分辨率，不会引入模糊）。
 *
 * ## 缩放语义
 *
 * zoom = 1 表示「铺满容器」（contain，与 svg 默认 preserveAspectRatio=meet
 * 一致）；zoom = 2 表示在铺满基础上再放大 2 倍。
 */

export interface ZoomViewerHandle {
  zoomIn: () => void;
  zoomOut: () => void;
  reset: () => void;
  getScale: () => number;
}

interface Props {
  svg: string | null;
  /** 未发生拖拽的单击（延迟触发，双击优先） */
  onSingleClick?: () => void;
  /** 缩放比例变化回调（相对铺满的倍率） */
  onScaleChange?: (zoom: number) => void;
  showBadge?: boolean;
  badgeTitle?: string;
  minZoom?: number;
  maxZoom?: number;
  /** 内容为空时的占位文案 */
  emptyText?: string;
  /** 光标显示为抓手（可拖拽平移） */
  grabCursor?: boolean;
}

const MIN_ZOOM = 0.1;
const MAX_ZOOM = 8;
/**
 * SVG 元素最大边长（px）。浏览器纹理有尺寸上限，超过后可能整块渲染成空白，
 * 所以超大倍率要按此反推上限。
 */
const MAX_EDGE = 12000;
/** 鼠标位移超过这个像素才算拖拽，否则视为点击 */
const DRAG_THRESHOLD = 4;
/** 单击延迟：给双击（重置）让路 */
const CLICK_DELAY = 220;

function clamp(v: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, v));
}

/** 从 svg 字符串解析自然尺寸：优先 viewBox，其次 width/height 属性 */
function parseNatural(svg: string | null): { w: number; h: number } | null {
  if (!svg) return null;
  const m = /viewBox\s*=\s*"([\d.\-\s,e]+)"/i.exec(svg);
  if (m) {
    const parts = m[1].trim().split(/[\s,]+/).map(Number);
    if (parts.length === 4 && parts[2] > 0 && parts[3] > 0) {
      return { w: parts[2], h: parts[3] };
    }
  }
  const w = /<svg[^>]*\swidth\s*=\s*"(\d+(?:\.\d+)?)"/i.exec(svg)?.[1];
  const h = /<svg[^>]*\sheight\s*=\s*"(\d+(?:\.\d+)?)"/i.exec(svg)?.[1];
  if (w && h) return { w: parseFloat(w), h: parseFloat(h) };
  return null;
}

const ZoomViewer = forwardRef<ZoomViewerHandle, Props>(function ZoomViewer(props, ref) {
  const {
    svg,
    onSingleClick,
    onScaleChange,
    showBadge = true,
    badgeTitle,
    minZoom = MIN_ZOOM,
    maxZoom = MAX_ZOOM,
    emptyText,
    grabCursor = false,
  } = props;

  const { t } = useI18n();
  // 文案兜底：未传 prop 时用 i18n 默认值
  const badgeTitleText = badgeTitle ?? t('viewer.badgeTitle');
  const emptyTextText = emptyText ?? t('viewer.empty');

  const wrapRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState({ w: 0, h: 0 });
  /** z：相对铺满的倍率；panX/panY：相对居中位置的平移偏移（px） */
  const [view, setView] = useState({ z: 1, panX: 0, panY: 0 });
  const [dragging, setDragging] = useState(false);

  /** 拖拽监听的清理函数（挂在 window 上） */
  const dragCleanupRef = useRef<(() => void) | null>(null);
  /** 最近一次指针序列是否发生过拖拽（供随后的 click 读取） */
  const lastMovedRef = useRef(false);
  const clickTimerRef = useRef<number | null>(null);

  const natural = useMemo(() => parseNatural(svg), [svg]);

  // 容器尺寸（用于计算 contain 铺满比例）
  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const read = () => {
      const r = el.getBoundingClientRect();
      setBox((b) =>
        Math.abs(b.w - r.width) < 0.5 && Math.abs(b.h - r.height) < 0.5
          ? b
          : { w: r.width, h: r.height }
      );
    };
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const ready = !!natural && box.w > 0 && box.h > 0;
  // 铺满比例：svg 自然尺寸 contain 进容器
  const fit = ready ? Math.min(box.w / natural!.w, box.h / natural!.h) : 1;
  // 倍率上限同时受 MAX_EDGE 约束（浏览器纹理尺寸上限）
  const zLimit = ready
    ? Math.min(maxZoom, MAX_EDGE / Math.max(natural!.w * fit, natural!.h * fit, 1))
    : maxZoom;

  const dispW = ready ? natural!.w * fit * view.z : 0;
  const dispH = ready ? natural!.h * fit * view.z : 0;
  // 元素左上角位置：居中 + 用户平移偏移
  const tx = (box.w - dispW) / 2 + view.panX;
  const ty = (box.h - dispH) / 2 + view.panY;

  // 供 wheel 回调与 imperative handle 读取的最新几何量
  const latest = useRef({
    fit: 1,
    box: { w: 0, h: 0 },
    natural: null as { w: number; h: number } | null,
    z: 1,
    zLimit: maxZoom,
  });
  useLayoutEffect(() => {
    latest.current = { fit, box, natural, z: view.z, zLimit };
  });

  /**
   * 以 (ax, ay)（容器坐标系）为锚点缩放，锚点下的内容点保持不动。
   *
   * 设 z0 → z1，元素尺寸 dispW = nw*fit*z，左上角在 tx。
   * viewBox 用户坐标 X 在屏幕上位于 tx + X*fit*z，
   * 故锚点下的内容点 X0 = (ax - tx0)/(fit*z0)，
   * 缩放后要它仍在 ax 处：tx1 = ax - X0*fit*z1 = ax - (ax-tx0)*z1/z0（fit 约掉）。
   */
  const zoomAt = useCallback(
    (factor: number, ax: number, ay: number) => {
      setView((prev) => {
        const g = latest.current;
        if (!g.natural) return prev;
        const z1 = clamp(prev.z * factor, minZoom, g.zLimit);
        if (z1 === prev.z) return prev;
        const dispW0 = g.natural.w * g.fit * prev.z;
        const dispH0 = g.natural.h * g.fit * prev.z;
        const tx0 = (g.box.w - dispW0) / 2 + prev.panX;
        const ty0 = (g.box.h - dispH0) / 2 + prev.panY;
        const cx = (ax - tx0) / prev.z;
        const cy = (ay - ty0) / prev.z;
        const dispW1 = g.natural.w * g.fit * z1;
        const dispH1 = g.natural.h * g.fit * z1;
        return {
          z: z1,
          panX: ax - cx * z1 - (g.box.w - dispW1) / 2,
          panY: ay - cy * z1 - (g.box.h - dispH1) / 2,
        };
      });
    },
    [minZoom]
  );

  // 滚轮缩放。必须原生 addEventListener + passive:false —— React 的 onWheel
  // 是被动监听，preventDefault 无效，会连带滚动外层页面
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const r = el.getBoundingClientRect();
      zoomAt(Math.exp(-e.deltaY * 0.0015), e.clientX - r.left, e.clientY - r.top);
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [zoomAt]);

  // 组件卸载时摘掉 window 上的拖拽监听
  useEffect(() => () => dragCleanupRef.current?.(), []);

  // 换图后回到铺满状态
  useEffect(() => {
    setView({ z: 1, panX: 0, panY: 0 });
  }, [svg]);

  useEffect(() => {
    onScaleChange?.(view.z);
  }, [view.z, onScaleChange]);

  // 把 SVG 元素尺寸改成目标像素尺寸（viewBox 不变）→ 浏览器按大尺寸重新渲染
  useLayoutEffect(() => {
    const svgEl = innerRef.current?.querySelector('svg');
    if (!svgEl) return;
    if (!dispW || !dispH) {
      svgEl.style.setProperty('display', 'none', 'important');
      return;
    }
    svgEl.style.setProperty('display', 'block', 'important');
    svgEl.setAttribute('width', String(dispW));
    svgEl.setAttribute('height', String(dispH));
    svgEl.style.setProperty('width', `${dispW}px`, 'important');
    svgEl.style.setProperty('height', `${dispH}px`, 'important');
    svgEl.style.setProperty('max-width', 'none', 'important');
  }, [dispW, dispH, svg]);

  const reset = useCallback(() => setView({ z: 1, panX: 0, panY: 0 }), []);

  const zoomBy = useCallback(
    (factor: number) => {
      const g = latest.current;
      zoomAt(factor, g.box.w / 2, g.box.h / 2);
    },
    [zoomAt]
  );

  useImperativeHandle(
    ref,
    () => ({
      zoomIn: () => zoomBy(1.25),
      zoomOut: () => zoomBy(1 / 1.25),
      reset,
      getScale: () => latest.current.z,
    }),
    [zoomBy, reset]
  );

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    dragCleanupRef.current?.();
    let moved = false;
    let lastX = e.clientX;
    let lastY = e.clientY;
    const onMove = (ev: PointerEvent) => {
      const dx = ev.clientX - lastX;
      const dy = ev.clientY - lastY;
      lastX = ev.clientX;
      lastY = ev.clientY;
      if (!moved && Math.hypot(ev.clientX - e.clientX, ev.clientY - e.clientY) > DRAG_THRESHOLD) {
        moved = true;
        setDragging(true);
      }
      if (moved) {
        setView((v) => ({ ...v, panX: v.panX + dx, panY: v.panY + dy }));
      }
    };
    const onUp = () => {
      // 供随后的 click 读取：拖过就不算点击
      lastMovedRef.current = moved;
      setDragging(false);
      dragCleanupRef.current?.();
    };
    dragCleanupRef.current = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
      dragCleanupRef.current = null;
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
  };

  // 单击（未拖拽）：延迟触发，双击时取消
  const onClick = () => {
    if (!onSingleClick) return;
    if (lastMovedRef.current) return;
    if (clickTimerRef.current !== null) return;
    clickTimerRef.current = window.setTimeout(() => {
      clickTimerRef.current = null;
      onSingleClick();
    }, CLICK_DELAY);
  };

  const onDoubleClick = () => {
    if (clickTimerRef.current !== null) {
      clearTimeout(clickTimerRef.current);
      clickTimerRef.current = null;
    }
    reset();
  };

  return (
    <div
      className={`zoom-viewer${grabCursor ? ' grab' : ''}`}
      ref={wrapRef}
      onPointerDown={onPointerDown}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
    >
      {svg ? (
        <div
          ref={innerRef}
          className={`zoom-viewer-inner${dragging ? ' dragging' : ''}`}
          style={{
            width: dispW || undefined,
            height: dispH || undefined,
            transform: `translate(${tx}px, ${ty}px)`,
          }}
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      ) : (
        <div className="hint zoom-viewer-hint">{emptyTextText}</div>
      )}
      {showBadge && ready && (
        <div
          className="zoom-badge"
          onClick={(e) => {
            e.stopPropagation();
            reset();
          }}
          title={badgeTitleText}
        >
          {Math.round(view.z * 100)}%
        </div>
      )}
    </div>
  );
});

export default ZoomViewer;
