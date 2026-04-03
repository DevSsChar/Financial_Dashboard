export const ANIM = {
  page: {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.25 } },
    exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
  },
  drawer: {
    initial: { x: "100%" },
    animate: { x: 0, transition: { type: "spring", damping: 30, stiffness: 300 } },
    exit: { x: "100%", transition: { duration: 0.2 } },
  },
  toast: {
    initial: { y: -50, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { opacity: 0, y: -20 },
  },
  row: (i: number) => ({
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { delay: Math.min(i * 0.05, 0.5) } },
  }),
  collapse: {
    initial: { height: 0, opacity: 0 },
    animate: { height: "auto", opacity: 1 },
    exit: { height: 0, opacity: 0 },
  },
};
