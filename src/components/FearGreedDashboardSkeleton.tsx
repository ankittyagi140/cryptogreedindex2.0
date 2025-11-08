import { Skeleton } from "@/components/ui/skeleton";

export default function FearGreedDashboardSkeleton() {
  return (
    <main className="space-y-12 px-6 py-12">
      <section className="mx-auto flex w-full max-w-5xl flex-col items-center gap-8">
        <Skeleton className="h-10 w-60" />
        <Skeleton className="h-[280px] w-full max-w-2xl rounded-full" />
        <Skeleton className="h-6 w-48" />
      </section>

      <section className="mx-auto grid w-full max-w-6xl gap-6 md:grid-cols-3">
        <Skeleton className="h-28 rounded-xl" />
        <Skeleton className="h-28 rounded-xl" />
        <Skeleton className="h-28 rounded-xl" />
      </section>

      <section className="mx-auto w-full max-w-6xl">
        <Skeleton className="h-[420px] rounded-xl" />
      </section>
    </main>
  );
}

