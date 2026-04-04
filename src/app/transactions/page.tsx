"use client";

import { motion } from "framer-motion";
import { ANIM } from "@/constants/animations";
import { TransactionsView } from "@/components/transactions/TransactionsView";

export default function TransactionsPage() {
  return (
    <motion.div {...ANIM.page} className="max-w-6xl mx-auto">
      <header className="mb-8">
        <h1 className="heading-section text-[2rem]">Transactions</h1>
        <p className="text-[var(--muted)] mt-2 text-[15px]">
          View, filter, and manage your financial activity.
        </p>
      </header>

      <TransactionsView />
    </motion.div>
  );
}
