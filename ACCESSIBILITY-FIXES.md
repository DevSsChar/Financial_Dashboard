# ♿ AccessibilityGuard — Automated Fix Report

**Report ID:** scan_1789753415765_b40ab0
**Target URL:** https://financial-dashboard-rust-sigma.vercel.app/
**Scan Date:** 2026-09-18T17:43:35.765Z
**Fix Date:** 2026-09-18T17:46:31.192Z
**Branch:** AG-Fix-scan_1789753415765_b40ab0-1789753544573

---

## 📊 Summary

| Metric | Count |
|---|---|
| ✅ Fully Fixed | 1 |
| ⚠️ Partially Fixed | 0 |
| 🔴 Needs Manual Review | 4 |
| 🎨 Design Decisions Required | 4 |
| 📌 Stubs Added | 0 |
| 📁 Files Modified | 4 |

---

## ✅ Applied Fixes

### 1. scrollable-region-focusable — serious — `src/components/transactions/TransactionsView.tsx`

**WCAG Guideline:** 2.1.1 Keyboard (A)
**Reference:** https://dequeuniversity.com/rules/axe/4.10/scrollable-region-focusable?application=axe-puppeteer

**Before:**
```html
}
  };
  return <div className="space-y-6">
      <TransactionFilters onExportCSV={handleExportCSV} onExportJSON={handleExportJSON} />

      <div className="card-surface overflow-hidden">
        {filtered.length === 0 ? <EmptyState title="No transactions found" description="Try adjusting your filters or search terms." /> : <div className="overflow-x-auto" tabIndex="0">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--surface-alt)]">
                  <th className="px-6 py-4 text-[11px] font-medium text-[var(--muted)] uppercase tracking-[0.08em]">Date</th>
                  <th className="px-6 py-4 text-[11px] font-medium text-[var(--muted)] uppercase tracking-[0.08em]">Description</th>
                  <th className="px-6 py-4 text-[11px] font-medium text-[var(--muted)] uppercase tracking-[0.08em]">Category</th>
                  <th className="px-6 py-4 text-[11px] font-medium text-[var(--muted)] uppercase tracking-[0.08em] text-right">Amount</th>
                  {isAdmin && <th className="px-6 py-4 text-[11px] font-medium text-[var(--muted)] uppercase tracking-[0.08em] text-center w-28">Actions</th>}
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filtered.map((t, i) => <motion.tr key={t.id} layout initial={{
                opacity: 0,
                y: 10
              }} animate={{
                opacity: 1,
                y: 0,
                transition: {
                  delay: Math.min(i * 0.03, 0.3)
                }
              }} exit={{
                opacity: 0,
                x: -30,
                transition: {
                  duration: 0.2
                }
              }} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--surface-alt)] transition-colors group">
                      <td className="px-6 py-4 text-sm text-[var(--muted)] whitespace-nowrap">
                        {format(parseISO(t.date), "MMM dd, yyyy")}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">
                        {t.description}
                        {t.tags && t.tags.length > 0 && <span className="block mt-1 text-[11px] text-[var(--muted)] font-normal">
                            #{t.tags.join(", ")}
                          </span>}
                      </td>
                      <td className="px-6 py-4 text-sm text-[var(--muted)]">
                        <span className="bg-[var(--surface-alt)] px-3 py-1 rounded-[9999px] text-[11px] font-medium">
                          {t.category}
                        </span>
                      </td>
                      <td className={`px-6 py-4 text-sm font-medium text-right whitespace-nowrap tabular-nums ${t.type === "income" ? "text-[#00a87e]" : ""}`}>
                        {t.type === "income" ? "+" : "-"}₹{t.amount.toLocaleString()}
                      </td>
                      {isAdmin && <td className="px-6 py-4 text-sm text-center whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1">
                            <button className="p-2 rounded-[9999px] text-[var(--muted)] hover:text-[#494fdf] hover:bg-[#494fdf]/8 transition-colors" aria-label={`Edit ${t.description}`} onClick={() => setEditTarget(t)}>
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button className="p-2 rounded-[9999px] text-[var(--muted)] hover:text-[#e23b4a] hover:bg-[#e23b4a]/8 transition-colors" aria-label={`Delete ${t.description}`} onClick={() => setDeleteTarget(t)}>
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>}
                    </motion.tr>)}
                </AnimatePresence>
              </tbody>
            </table>
          </div>}
      </div>

      <ConfirmDialog isOpen={!!deleteTarget} title="Delete Transaction" description={deleteTarget ? `Are you sure you want to delete "${deleteTarget.description}"? This action will be simulated and may be rolled back.` : ""} confirmText="Delete" cancelText="Keep" onConfirm={handleDeleteConfirm} onCancel={() => setDeleteTarget(null)} isDestructive />

      <EditTransactionModal isOpen={!!editTarget} transaction={editTarget} onClose={() => setEditTarget(null)} onSuccess={msg => addToast(msg, "success")} onError={msg => addToast(msg, "error")} />

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>;
}
```

**After:**
```html
}
  };
  return <div className="space-y-6">
      <TransactionFilters onExportCSV={handleExportCSV} onExportJSON={handleExportJSON} />

      <div className="card-surface overflow-hidden">
        {filtered.length === 0 ? <EmptyState title="No transactions found" description="Try adjusting your filters or search terms." /> : <div className="overflow-x-auto" tabIndex={0} role="region" aria-label="Transactions table">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--surface-alt)]">
                  <th className="px-6 py-4 text-[11px] font-medium text-[var(--muted)] uppercase tracking-[0.08em]">Date</th>
                  <th className="px-6 py-4 text-[11px] font-medium text-[var(--muted)] uppercase tracking-[0.08em]">Description</th>
                  <th className="px-6 py-4 text-[11px] font-medium text-[var(--muted)] uppercase tracking-[0.08em]">Category</th>
                  <th className="px-6 py-4 text-[11px] font-medium text-[var(--muted)] uppercase tracking-[0.08em] text-right">Amount</th>
                  {isAdmin && <th className="px-6 py-4 text-[11px] font-medium text-[var(--muted)] uppercase tracking-[0.08em] text-center w-28">Actions</th>}
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filtered.map((t, i) => <motion.tr key={t.id} layout initial={{
                opacity: 0,
                y: 10
              }} animate={{
                opacity: 1,
                y: 0,
                transition: {
                  delay: Math.min(i * 0.03, 0.3)
                }
              }} exit={{
                opacity: 0,
                x: -30,
                transition: {
                  duration: 0.2
                }
              }} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--surface-alt)] transition-colors group">
                      <td className="px-6 py-4 text-sm text-[var(--muted)] whitespace-nowrap">
                        {format(parseISO(t.date), "MMM dd, yyyy")}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">
                        {t.description}
                        {t.tags && t.tags.length > 0 && <span className="block mt-1 text-[11px] text-[var(--muted)] font-normal">
                            #{t.tags.join(", ")}
                          </span>}
                      </td>
                      <td className="px-6 py-4 text-sm text-[var(--muted)]">
                        <span className="bg-[var(--surface-alt)] px-3 py-1 rounded-[9999px] text-[11px] font-medium">
                          {t.category}
                        </span>
                      </td>
                      <td className={`px-6 py-4 text-sm font-medium text-right whitespace-nowrap tabular-nums ${t.type === "income" ? "text-[#00a87e]" : ""}`}>
                        {t.type === "income" ? "+" : "-"}₹{t.amount.toLocaleString()}
                      </td>
                      {isAdmin && <td className="px-6 py-4 text-sm text-center whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1">
                            <button className="p-2 rounded-[9999px] text-[var(--muted)] hover:text-[#494fdf] hover:bg-[#494fdf]/8 transition-colors" aria-label={`Edit ${t.description}`} onClick={() => setEditTarget(t)}>
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button className="p-2 rounded-[9999px] text-[var(--muted)] hover:text-[#e23b4a] hover:bg-[#e23b4a]/8 transition-colors" aria-label={`Delete ${t.description}`} onClick={() => setDeleteTarget(t)}>
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>}
                    </motion.tr>)}
                </AnimatePresence>
              </tbody>
            </table>
          </div>}
      </div>

      <ConfirmDialog isOpen={!!deleteTarget} title="Delete Transaction" description={deleteTarget ? `Are you sure you want to delete "${deleteTarget.description}"? This action will be simulated and may be rolled back.` : ""} confirmText="Delete" cancelText="Keep" onConfirm={handleDeleteConfirm} onCancel={() => setDeleteTarget(null)} isDestructive />

      <EditTransactionModal isOpen={!!editTarget} transaction={editTarget} onClose={() => setEditTarget(null)} onSuccess={msg => addToast(msg, "success")} onError={msg => addToast(msg, "error")} />

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>;
}
```

**Validation:** ✅ Passes re-check

---

## 🔴 Manual Review Required

### color-contrast-incomplete-0 — Ensure the contrast between foreground and background colors meets WCAG 2 AA minimum contrast ratio thresholds

**Affected Element:** `unknown file`
**Found on:** https://financial-dashboard-rust-sigma.vercel.app/
**HTML:** `<tspan x="78.2258064516129" dy="0.71em">Aug 20</tspan>`
**How to fix manually:** No registered fix strategy for this rule; flag for manual review.
**WCAG Reference:** https://dequeuniversity.com/rules/axe/4.10/color-contrast?application=axe-puppeteer
**Details:** Could not resolve this violation to a source file. See the scan report for the selector and HTML snippet.

### color-contrast-incomplete-0 — Ensure the contrast between foreground and background colors meets WCAG 2 AA minimum contrast ratio thresholds

**Affected Element:** `unknown file`
**Found on:** https://financial-dashboard-rust-sigma.vercel.app/
**HTML:** `<tspan x="78.2258064516129" dy="0.71em">Aug 20</tspan>`
**How to fix manually:** No registered fix strategy for this rule; flag for manual review.
**WCAG Reference:** https://dequeuniversity.com/rules/axe/4.10/color-contrast?application=axe-puppeteer
**Details:** Could not resolve this violation to a source file. See the scan report for the selector and HTML snippet.

### heading-order — Ensure the order of headings is semantically correct

**Affected Element:** `src/components/dashboard/RecentTransactions.tsx`
**Found on:** https://financial-dashboard-rust-sigma.vercel.app/
**HTML:** `<h4 class="font-medium leading-tight text-sm">Salary</h4>`
**How to fix manually:** Fix heading hierarchy so levels are never skipped (h1→h2→h3, never h1→h3).
**WCAG Reference:** https://dequeuniversity.com/rules/axe/4.10/heading-order?application=axe-puppeteer
**Details:** No fixer implemented for rule "heading-order" (Fix heading hierarchy so levels are never skipped (h1→h2→h3, never h1→h3).). | AI attempt: AI fix rejected by evaluator: No changes were made to heading elements or their order, so the heading-order violation is not fixed.

### select-name — Ensure select element has an accessible name

**Affected Element:** `src/components/transactions/TransactionFilters.tsx:39`
**Found on:** https://financial-dashboard-rust-sigma.vercel.app/transactions
**HTML:** `<select class="flex-1 min-w-0 px-3 py-3 bg-[var(--surface-alt)] text-[var(--foreground)] border-none rounded-[9999px] text-[13px] font-medium focus:ring-2 focus:ring-[#494fdf] outline-none cursor-poin`
**How to fix manually:** Add a <label> or aria-label to <select> elements.
**WCAG Reference:** https://dequeuniversity.com/rules/axe/4.10/select-name?application=axe-puppeteer
**Details:** Attribute already present. | AI attempt: AI fix rejected by evaluator: The fix changes the aria-label on the first select from 'Select an option' to 'Transaction type', which is acceptable, but it also removes the aria-label from the second select, leaving it without an accessible name, so the violation is not fully fixed.

---

## 🎨 Design Decisions Required

### color-contrast — `src/components/layout/Sidebar.tsx`

Color-contrast issue flagged for manual review — see the scan report for details.

### color-contrast — `src/components/layout/Sidebar.tsx`

Color-contrast issue flagged for manual review — see the scan report for details.

### color-contrast — `src/components/layout/Sidebar.tsx`

Color-contrast issue flagged for manual review — see the scan report for details.

### color-contrast — `src/components/layout/Sidebar.tsx`

Color-contrast issue flagged for manual review — see the scan report for details.

---

## 🔁 Re-Scan Instructions

After merging this PR and deploying:
1. Return to AccessibilityGuard
2. Start a new scan on https://financial-dashboard-rust-sigma.vercel.app/
3. Compare results with Report ID: scan_1789753415765_b40ab0
