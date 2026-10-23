import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { en } from './en';
import { zhCN } from './zh-CN';
import {
  DEFAULT_LOCALE,
  type Locale,
  type TranslationKey,
  type TranslationTree,
  type TranslationVars,
} from './types';

export * from './types';

const DICTIONARIES: Record<Locale, TranslationTree> = {
  en,
  'zh-CN': zhCN,
};

const STORAGE_KEY = 'bm-locale';

function lookup(tree: TranslationTree, path: string): string | undefined {
  const parts = path.split('.');
  let cur: unknown = tree;
  for (const p of parts) {
    if (cur && typeof cur === 'object' && p in (cur as Record<string, unknown>)) {
      cur = (cur as Record<string, unknown>)[p];
    } else {
      return undefined;
    }
  }
  return typeof cur === 'string' ? cur : undefined;
}

/** 把 {name} 占位符替换为实际值 */
function interpolate(template: string, vars?: TranslationVars): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in vars ? String(vars[key]) : match
  );
}

/**
 * 纯函数式翻译（不依赖 React），可在模块顶层调用。
 * 找不到路径时回退到英文，再回退到路径本身（便于发现遗漏）。
 */
export function translate(locale: Locale, path: TranslationKey, vars?: TranslationVars): string {
  const hit = lookup(DICTIONARIES[locale], path) ?? lookup(DICTIONARIES[DEFAULT_LOCALE], path);
  return interpolate(hit ?? path, vars);
}

export interface I18nContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (path: TranslationKey, vars?: TranslationVars) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

/** 读取 localStorage 里已保存的语言；没有则返回默认（英语） */
export function readStoredLocale(): Locale {
  if (typeof window === 'undefined') return DEFAULT_LOCALE;
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved && saved in DICTIONARIES) return saved as Locale;
  } catch {
    /* localStorage 不可用（隐私模式等），忽略 */
  }
  return DEFAULT_LOCALE;
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(readStoredLocale);

  // 持久化 + 同步 <html lang>，供读屏软件与浏览器翻译使用
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, locale);
    } catch {
      /* 忽略写入失败 */
    }
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((l: Locale) => setLocaleState(l), []);

  const value = useMemo<I18nContextValue>(
    () => ({
      locale,
      setLocale,
      t: (path, vars) => translate(locale, path, vars),
    }),
    [locale, setLocale]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

/** 在组件里取翻译函数 */
export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used inside <I18nProvider>');
  return ctx;
}
