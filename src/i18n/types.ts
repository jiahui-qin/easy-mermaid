import type { en } from './en';

export type Locale = 'en' | 'zh-CN';

export const LOCALES: Locale[] = ['en', 'zh-CN'];

/** 默认语言：英语（不随浏览器语言自动切换，需用户显式选择） */
export const DEFAULT_LOCALE: Locale = 'en';

export const LOCALE_LABELS: Record<Locale, string> = {
  en: 'English',
  'zh-CN': '简体中文',
};

/** 文案树类型（zh-CN 必须严格匹配此结构） */
export type TranslationTree = typeof en;

/**
 * 文案树的叶子路径联合类型，如 `app.title` / `fields.radius.hint`。
 * 编译期校验：路径写错会直接报 TS 错误，而不是运行时拿到 undefined。
 */
type Leaves<T> = T extends string
  ? never
  : {
      [K in keyof T & string]: T[K] extends string ? K : `${K}.${Leaves<T[K]>}`;
    }[keyof T & string];

export type TranslationKey = Leaves<TranslationTree>;

/** 插值参数：{name} → 实际值 */
export type TranslationVars = Record<string, string | number>;
