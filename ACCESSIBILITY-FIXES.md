# ♿ AccessibilityGuard — Automated Fix Report

**Report ID:** scan_1788518699854_3be5c9
**Target URL:** https://financial-dashboard-rust-sigma.vercel.app/
**Scan Date:** 2026-09-04T10:44:59.854Z
**Fix Date:** 2026-09-04T10:46:30.844Z
**Branch:** AG-Fix-scan_1788518699854_3be5c9-1788518790411

---

## 📊 Summary

| Metric | Count |
|---|---|
| ✅ Fully Fixed | 0 |
| ⚠️ Partially Fixed | 0 |
| 🔴 Needs Manual Review | 5 |
| 🎨 Design Decisions Required | 4 |
| 📌 Stubs Added | 0 |
| 📁 Files Modified | 5 |

---

## 🔴 Manual Review Required

### color-contrast-incomplete-0 — Ensure the contrast between foreground and background colors meets WCAG 2 AA minimum contrast ratio thresholds

**Affected Element:** `unknown file`
**Found on:** https://financial-dashboard-rust-sigma.vercel.app/
**HTML:** `<tspan x="78.2258064516129" dy="0.71em">Aug 06</tspan>`
**How to fix manually:** No registered fix strategy for this rule; flag for manual review.
**WCAG Reference:** https://dequeuniversity.com/rules/axe/4.10/color-contrast?application=axe-puppeteer
**Details:** Could not resolve this violation to a source file. See the scan report for the selector and HTML snippet.

### color-contrast-incomplete-0 — Ensure the contrast between foreground and background colors meets WCAG 2 AA minimum contrast ratio thresholds

**Affected Element:** `unknown file`
**Found on:** https://financial-dashboard-rust-sigma.vercel.app/
**HTML:** `<tspan x="78.2258064516129" dy="0.71em">Aug 06</tspan>`
**How to fix manually:** No registered fix strategy for this rule; flag for manual review.
**WCAG Reference:** https://dequeuniversity.com/rules/axe/4.10/color-contrast?application=axe-puppeteer
**Details:** Could not resolve this violation to a source file. See the scan report for the selector and HTML snippet.

### heading-order — Ensure the order of headings is semantically correct

**Affected Element:** `src/app/page.tsx`
**Found on:** https://financial-dashboard-rust-sigma.vercel.app/
**HTML:** `<h4 class="font-medium leading-tight text-sm">Salary</h4>`
**How to fix manually:** Fix heading hierarchy so levels are never skipped (h1→h2→h3, never h1→h3).
**WCAG Reference:** https://dequeuniversity.com/rules/axe/4.10/heading-order?application=axe-puppeteer
**Details:** No fixer implemented for rule "heading-order" (Fix heading hierarchy so levels are never skipped (h1→h2→h3, never h1→h3).).

### scrollable-region-focusable — Ensure elements that have scrollable content are accessible by keyboard

**Affected Element:** `src/components/transactions/TransactionsView.tsx`
**Found on:** https://financial-dashboard-rust-sigma.vercel.app/transactions
**HTML:** `<div class="overflow-x-auto">`
**How to fix manually:** Add tabindex="0" to scrollable regions not otherwise reachable by keyboard.
**WCAG Reference:** https://dequeuniversity.com/rules/axe/4.10/scrollable-region-focusable?application=axe-puppeteer
**Details:** No fixer implemented for rule "scrollable-region-focusable" (Add tabindex="0" to scrollable regions not otherwise reachable by keyboard.).

### select-name — Ensure select element has an accessible name

**Affected Element:** `src/app/layout.tsx`
**Found on:** https://financial-dashboard-rust-sigma.vercel.app/transactions
**HTML:** `<select class="flex-1 min-w-0 px-3 py-3 bg-[var(--surface-alt)] text-[var(--foreground)] border-none rounded-[9999px] text-[13px] font-medium focus:ring-2 focus:ring-[#494fdf] outline-none cursor-poin`
**How to fix manually:** Add a <label> or aria-label to <select> elements.
**WCAG Reference:** https://dequeuniversity.com/rules/axe/4.10/select-name?application=axe-puppeteer
**Details:** Could not locate the target element in this file.

---

## 🎨 Design Decisions Required

### color-contrast — `src/app/admin/page.tsx`

Color-contrast issue flagged for manual review — see the scan report for details.

### color-contrast — `src/app/admin/page.tsx`

Color-contrast issue flagged for manual review — see the scan report for details.

### color-contrast — `src/app/admin/page.tsx`

Color-contrast issue flagged for manual review — see the scan report for details.

### color-contrast — `src/context/AppContext.tsx`

Color-contrast issue flagged for manual review — see the scan report for details.

---

## 🔁 Re-Scan Instructions

After merging this PR and deploying:
1. Return to AccessibilityGuard
2. Start a new scan on https://financial-dashboard-rust-sigma.vercel.app/
3. Compare results with Report ID: scan_1788518699854_3be5c9
