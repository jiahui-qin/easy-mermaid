import type { UiConfig } from '../types';
import type { TranslationKey } from '../i18n/types';

export interface FieldDef {
  key: keyof UiConfig;
  /** 字段名文案路径（i18n 字典 fields.<key>.label） */
  labelKey: TranslationKey;
  kind: 'select' | 'number' | 'color' | 'text' | 'toggle';
  options?: Array<{ value: string; labelKey: TranslationKey }>;
  min?: number;
  max?: number;
  step?: number;
  /** 提示文案路径（i18n 字典 fields.<key>.hint），空串表示不显示 */
  hintKey?: TranslationKey;
}

export const configFields: FieldDef[] = [
  {
    key: 'mermaidTheme',
    labelKey: 'fields.mermaidTheme.label',
    kind: 'select',
    options: [
      { value: 'base', labelKey: 'options.base' },
      { value: 'default', labelKey: 'options.default' },
    ],
    hintKey: 'fields.mermaidTheme.hint',
  },
  {
    key: 'renderer',
    labelKey: 'fields.renderer.label',
    kind: 'select',
    options: [
      { value: 'elk', labelKey: 'options.elk' },
      { value: 'dagre', labelKey: 'options.dagre' },
    ],
    hintKey: 'fields.renderer.hint',
  },
  {
    key: 'look',
    labelKey: 'fields.look.label',
    kind: 'select',
    options: [
      { value: 'classic', labelKey: 'options.classic' },
      { value: 'handDrawn', labelKey: 'options.handDrawn' },
    ],
    hintKey: 'fields.look.hint',
  },
  {
    key: 'curve',
    labelKey: 'fields.curve.label',
    kind: 'select',
    options: [
      { value: 'linear', labelKey: 'options.linear' },
      { value: 'basis', labelKey: 'options.basis' },
      { value: 'cardinal', labelKey: 'options.cardinal' },
      { value: 'monotoneX', labelKey: 'options.monotoneX' },
    ],
    hintKey: 'fields.curve.hint',
  },
  {
    key: 'direction',
    labelKey: 'fields.direction.label',
    kind: 'select',
    options: [
      { value: 'TB', labelKey: 'options.tb' },
      { value: 'LR', labelKey: 'options.lr' },
      { value: 'BT', labelKey: 'options.bt' },
      { value: 'RL', labelKey: 'options.rl' },
    ],
    hintKey: 'fields.direction.hint',
  },
  {
    key: 'nodeSpacing',
    labelKey: 'fields.nodeSpacing.label',
    kind: 'number',
    min: 10,
    max: 200,
    step: 5,
    hintKey: 'fields.nodeSpacing.hint',
  },
  {
    key: 'rankSpacing',
    labelKey: 'fields.rankSpacing.label',
    kind: 'number',
    min: 10,
    max: 300,
    step: 5,
    hintKey: 'fields.rankSpacing.hint',
  },
  {
    key: 'padding',
    labelKey: 'fields.padding.label',
    kind: 'number',
    min: 0,
    max: 60,
    step: 2,
    hintKey: 'fields.padding.hint',
  },
  {
    key: 'radius',
    labelKey: 'fields.radius.label',
    kind: 'number',
    min: 0,
    max: 20,
    step: 1,
    hintKey: 'fields.radius.hint',
  },
  {
    key: 'fontSize',
    labelKey: 'fields.fontSize.label',
    kind: 'number',
    min: 10,
    max: 24,
    step: 1,
    hintKey: 'fields.fontSize.hint',
  },
  {
    key: 'fontFamily',
    labelKey: 'fields.fontFamily.label',
    kind: 'text',
    hintKey: 'fields.fontFamily.hint',
  },
  {
    key: 'primaryColor',
    labelKey: 'fields.primaryColor.label',
    kind: 'color',
    hintKey: 'fields.primaryColor.hint',
  },
  {
    key: 'primaryBorderColor',
    labelKey: 'fields.primaryBorderColor.label',
    kind: 'color',
    hintKey: 'fields.primaryBorderColor.hint',
  },
  {
    key: 'lineColor',
    labelKey: 'fields.lineColor.label',
    kind: 'color',
    hintKey: 'fields.lineColor.hint',
  },
  {
    key: 'clusterBkg',
    labelKey: 'fields.clusterBkg.label',
    kind: 'color',
    hintKey: 'fields.clusterBkg.hint',
  },
  {
    key: 'autoAlignSubgraphs',
    labelKey: 'fields.autoAlignSubgraphs.label',
    kind: 'toggle',
    hintKey: 'fields.autoAlignSubgraphs.hint',
  },
];
