import { useEffect, useRef } from 'react';
import { EditorState, StateField, StateEffect } from '@codemirror/state';
import {
  EditorView,
  keymap,
  lineNumbers,
  highlightActiveLine,
  highlightActiveLineGutter,
  Decoration,
  type DecorationSet,
} from '@codemirror/view';
import {
  defaultKeymap,
  history,
  historyKeymap,
  indentWithTab,
} from '@codemirror/commands';
import { StreamLanguage, syntaxHighlighting, defaultHighlightStyle } from '@codemirror/language';
import { useI18n } from '../i18n';

// errorLine 高亮：外部传入错误行号，用 StateEffect 触发 StateField 更新装饰
const setErrorLineEffect = StateEffect.define<number | null>();
const errorLineField = StateField.define<DecorationSet>({
  create: () => Decoration.none,
  update(value, tr) {
    for (const e of tr.effects) {
      if (e.is(setErrorLineEffect)) {
        if (e.value == null) return Decoration.none;
        const line = tr.state.doc.line(Math.min(Math.max(1, e.value), tr.state.doc.lines));
        return Decoration.set([
          Decoration.line({ class: 'cm-error-line' }).range(line.from),
        ]);
      }
    }
    return value;
  },
  provide: (f) => EditorView.decorations.from(f),
});
const mermaidLang = StreamLanguage.define({
  token(stream) {
    if (stream.match(/%%/)) {
      stream.skipToEnd();
      return 'comment';
    }
    if (stream.match(/"(?:[^"\\]|\\.)*"/)) return 'string';
    if (stream.match(/\b(graph|flowchart|subgraph|end|class|classDef|style|linkStyle|direction|click|sequenceDiagram|stateDiagram|erDiagram|gantt|pie|journey|mindmap|timeline|sankey-beta|block-beta|packet-beta|architecture-beta|kanban|gitGraph)\b/)) return 'keyword';
    if (stream.match(/-->|--x|--o|-\.->|==>|---|~~~|->|--/)) return 'operator';
    if (stream.match(/\[[^\]\n]*\]/)) return 'typeName';
    if (stream.match(/\|[^\|\n]*\|/)) return 'labelName';
    if (stream.match(/\{[^\}\n]*\}/)) return 'atom';
    if (stream.match(/\([^\)\n]*\)/)) return 'atom';
    if (stream.match(/[A-Za-z_][A-Za-z0-9_:]*/)) return 'variableName';
    if (stream.match(/\d+/)) return 'number';
    stream.next();
    return null;
  },
  languageData: { commentTokens: { line: '%%' } },
});

interface Props {
  value: string;
  errorLine?: number;
  onChange: (code: string) => void;
}

export default function Editor({ value, errorLine, onChange }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const { t } = useI18n();
  // EditorView 只在挂载时创建一次，语言切换后要同步更新无障碍标签
  const tRef = useRef(t);
  tRef.current = t;

  useEffect(() => {
    if (!hostRef.current) return;
    const state = EditorState.create({
      doc: value,
      extensions: [
        history(),
        lineNumbers(),
        highlightActiveLine(),
        highlightActiveLineGutter(),
        mermaidLang,
        syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
        errorLineField,
        keymap.of([...defaultKeymap, ...historyKeymap, indentWithTab]),
        EditorView.updateListener.of((u) => {
          if (u.docChanged) {
            onChange(u.state.doc.toString());
          }
        }),
        EditorView.lineWrapping,
        EditorView.contentAttributes.of({
          'aria-label': tRef.current('editor.placeholder'),
        }),
      ],
    });
    const view = new EditorView({ state, parent: hostRef.current });
    viewRef.current = view;
    return () => {
      view.destroy();
      viewRef.current = null;
    };
  }, []);

  // 外部 value 变化时同步（分享链接 / preset 重置）
  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;
    const cur = view.state.doc.toString();
    if (cur !== value) {
      view.dispatch({
        changes: { from: 0, to: cur.length, insert: value },
      });
    }
  }, [value]);

  // 错误行高亮
  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;
    view.dispatch({ effects: setErrorLineEffect.of(errorLine ?? null) });
  }, [errorLine]);

  return <div ref={hostRef} className="cm-host" />;
}
