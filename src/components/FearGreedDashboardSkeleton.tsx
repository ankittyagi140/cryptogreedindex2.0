import { Skeleton } from "@/components/ui/skeleton";

export default function FearGreedDashboardSkeleton() {
  return (
    <main className="space-y-8 px-4 py-10 sm:px-6 sm:py-14">
      {/* Title skeleton */}
      <section className="mx-auto flex w-full max-w-3xl flex-col items-center gap-3">
        <Skeleton className="h-10 w-72 rounded-lg" />
        <Skeleton className="h-5 w-96 max-w-full rounded-lg" />
      </section>

      {/* Gauge skeleton */}
      <section className="mx-auto flex w-full max-w-[420px] flex-col items-center gap-4">
        <div className="relative w-full" style={{ aspectRatio: "400 / 280" }}>
          <Skeleton className="absolute inset-0 rounded-3xl" />
          {/* Fake gauge arc */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <Skeleton className="h-16 w-24 rounded-xl" />
              <Skeleton className="h-8 w-32 rounded-full" />
            </div>
          </div>
        </div>
        <Skeleton className="h-8 w-56 rounded-full" />
      </section>

      {/* Sentiment cards skeleton */}
      <section className="mx-auto grid w-full max-w-7xl gap-4 px-4 sm:grid-cols-3 sm:px-6">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={`sentiment-skeleton-${index}`}
            className="rounded-2xl border border-border/40 bg-card/50 p-5"
          >
            <Skeleton className="h-3 w-20 rounded" />
            <Skeleton className="mt-4 h-10 w-20 rounded-lg" />
            <Skeleton className="mt-2 h-4 w-28 rounded" />
            <Skeleton className="mt-4 h-1.5 w-full rounded-full" />
          </div>
        ))}
      </section>

      {/* Chart skeleton */}
      <section className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        <div className="rounded-2xl border border-border/40 bg-card/50 p-5 sm:p-8">
          <div className="mb-6 flex items-center justify-between">
            <Skeleton className="h-8 w-48 rounded-lg" />
            <Skeleton className="h-9 w-28 rounded-lg" />
          </div>
          <Skeleton className="h-[320px] w-full rounded-xl sm:h-96" />
        </div>
      </section>
    </main>
  );
}
