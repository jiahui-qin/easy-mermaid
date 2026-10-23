# Contributing to Easy Mermaid

Thanks for taking the time to contribute! 🎨

## Getting started

```bash
git clone https://github.com/jiahui-qin/easy-mermaid.git
cd easy-mermaid
npm install
npm run dev
```

## Workflow

1. **Branch off** `main`:
   ```bash
   git checkout -b feature/my-change
   ```
2. **Make your change.** Keep `npm run build` green — it runs `tsc -b` first, so type errors will fail the build.
3. **Update the copy in both languages.** Any new user-facing string must be added to *both* `src/i18n/en.ts` and `src/i18n/zh-CN.ts`. The Chinese file is typed as `TranslationTree`, so a missing key is a compile error — this is intentional.
4. **Commit with a clear message** and open a PR describing what changed and why.

## Commit message style

```
<type>(<scope>): <short summary>

<optional longer description>
```

Types: `feat`, `fix`, `refactor`, `style`, `docs`, `perf`, `test`, `chore`, `ci`, `build`.

Examples:

```
feat(presets): add a Nord Light variant
fix(export): split labels by visual line instead of <br>
docs(readme): document the BASE_PATH variable
ci: cache npm dependencies in the Pages workflow
```

## Adding a preset

Presets are pure data — append to the `presets` array in `src/core/presets.ts`:

```ts
{
  id: 'my-preset',
  nameKey: 'presets.my-preset.name',
  descKey: 'presets.my-preset.desc',
  cfg: {
    preset: 'my-preset',
    mermaidTheme: 'base',
    renderer: 'elk',
    curve: 'linear',
    /* ... */
  },
}
```

Then add the matching copy to both locale files. The preset card renders automatically.

## Adding a language

1. Copy `src/i18n/en.ts` → `src/i18n/<locale>.ts` and translate the strings.
2. Add the locale to `Locale` in `src/i18n/types.ts`.
3. Register the dictionary in `src/i18n/index.tsx`.

The `TranslationKey` union is derived from the English tree, so every locale is checked against it at compile time.

## Code style

- TypeScript, `strict` mode — no `any` unless genuinely unavoidable.
- 2-space indentation, single quotes, semicolons.
- Keep components small; put reusable logic in `src/core/`.
- Comment the *why*, not the *what*. The codebase already documents the non-obvious Mermaid quirks in `README.md` — please add to those notes when you discover a new one.

## Reporting bugs

Open an issue with:

- What you did
- What you expected
- What happened instead
- The Mermaid source that triggered it, if applicable
- Browser and OS

## Pull request checklist

- [ ] `npm run build` passes
- [ ] New strings added to **both** locale files
- [ ] README updated if behavior changed
- [ ] Screenshots included for visual changes
