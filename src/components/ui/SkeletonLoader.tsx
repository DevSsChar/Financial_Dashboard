import clsx from "clsx";

type SkeletonProps = {
  className?: string;
  count?: number;
  type?: "row" | "card" | "circle";
};

export function SkeletonLoader({ className, count = 1, type = "row" }: SkeletonProps) {
  const elements = Array.from({ length: count }, (_, i) => i);

  if (type === "card") {
    return (
      <>
        {elements.map((i) => (
          <div key={i} className={clsx("rounded-2xl bg-gray-200 dark:bg-gray-800 animate-pulse", className)}>
            <div className="h-40 w-full" />
          </div>
        ))}
      </>
    );
  }

  if (type === "circle") {
    return (
      <>
        {elements.map((i) => (
          <div key={i} className={clsx("rounded-full bg-gray-200 dark:bg-gray-800 animate-pulse", className)} />
        ))}
      </>
    );
  }

  return (
    <>
      {elements.map((i) => (
        <div key={i} className={clsx("h-16 rounded-xl bg-gray-200 dark:bg-gray-800 animate-pulse w-full", className)} />
      ))}
    </>
  );
}
