# Taxo Link-in-Bio: Evaluation Report

**Date:** 2026-02-26
**Branch:** `claude/evaluate-test-app-ayy4T`

---

## Summary

The app is a link-in-bio tool for Instagram creator **@_Taxo_**. It consists of two implementations:

1. **`index.html`** — A fully functional, standalone Vanilla JS/HTML/CSS app (the active implementation)
2. **`src/App.jsx` + `src/main.jsx`** — An incomplete/broken React implementation (not integrated)

The **standalone `index.html` app works correctly** and implements all expected features. The **React implementation is non-functional** and should either be fixed or removed.

---

## Features Implemented (index.html)

| Feature | Status |
|---|---|
| Admin/Preview toggle | ✅ Working |
| Instagram Business API integration | ✅ Working |
| Add posts from Instagram | ✅ Working |
| Edit post (teaser caption, link URL, category) | ✅ Working |
| Delete post | ✅ Working |
| Publish / Unpublish post | ✅ Working |
| Click tracking & analytics | ✅ Working |
| Stats dashboard (total posts, clicks, CTR) | ✅ Working |
| Settings (profile pic, bio title, description, brand color, bg color) | ✅ Working |
| Tab navigation (Instagram / Published / Drafts / Settings) | ✅ Working |
| Modal form with character counter | ✅ Working |
| LocalStorage persistence | ✅ Working |
| Vite build | ✅ Builds successfully |

---

## Issues Found

### 🔴 Critical

1. **`src/App.jsx` is corrupted** — The file contains invisible Unicode Zero Width Non-Joiner characters (`U+200B`) starting at line 116, causing it to appear truncated. The React implementation is incomplete and broken.

2. **`src/App.jsx` uses `window.storage` API** — The React version references `window.storage.get()` / `window.storage.set()`, which is a non-standard, platform-specific API not available in standard browsers. This makes the React app non-functional even if the file corruption were fixed.

### 🟡 Medium (Security)

3. **XSS Risk — `error.message` via innerHTML** (`index.html:895`)
   ```js
   grid.innerHTML = `...${error.message}...`;
   ```
   Error messages from external API responses are injected without sanitization.

4. **XSS Risk — `settings.profilePicUrl` via innerHTML** (`index.html:1150`)
   ```js
   avatar.innerHTML = `<img src="${settings.profilePicUrl}" ...>`;
   ```
   URL from localStorage is injected without sanitization. While localStorage is same-origin, a crafted URL like `" onerror="alert(1)"` could execute scripts.

5. **XSS Risk — post data rendered via innerHTML** (`index.html:1023, 1093`)
   `post.teaserCaption`, `post.category`, and `post.igCaption` are all injected via template literals into `innerHTML` without escaping.

### 🔵 Low

6. **No test suite** — No testing framework is configured. `package.json` has no `test` script.

7. **React source not integrated** — `index.html` does not reference `src/main.jsx`, so the React files in `src/` are ignored by both the dev server and the build.

8. **Dependency vulnerabilities** — `esbuild <=0.24.2` (moderate severity): dev server can be queried by cross-origin requests. Fix: upgrade Vite to v7.

---

## Recommendations

### Immediate

1. **Remove or fix `src/App.jsx`** — Either delete the corrupted React files or rewrite them properly. Having two diverged implementations creates confusion.

2. **Sanitize HTML output** — Add an `escapeHTML()` helper function and use it when inserting user-controlled data into `innerHTML`:
   ```js
   function escapeHTML(str) {
     return String(str)
       .replace(/&/g, '&amp;')
       .replace(/</g, '&lt;')
       .replace(/>/g, '&gt;')
       .replace(/"/g, '&quot;');
   }
   ```

### Nice to Have

3. **Add a test suite** — Install `vitest` or `jest` and write basic unit tests for core logic functions (addPost, deletePost, trackClick, saveSettings).

4. **Update dependencies** — Run `npm audit fix --force` to update to Vite v7 and resolve the esbuild vulnerability (note: this is a breaking change, test the build afterwards).

---

## Build Status

```
✅ npm install     — Success
✅ vite build      — Success (builds standalone index.html, 42.25 kB)
⚠️  npm audit      — 2 moderate severity vulnerabilities (esbuild/vite)
❌  React src/     — Non-functional (corrupted file + non-standard API)
```
