import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="max-w-3xl text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
          Make Smarter Transition Decisions
        </h1>
        <p className="mt-6 text-lg leading-8 text-muted-foreground">
          Self-service tools built by veterans, for veterans. Calculate your true
          compensation, translate your experience, and plan your next move with
          confidence.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link href="/tools">
            <Button size="lg">
              Explore Tools
            </Button>
          </Link>
          <Link href="/tools" className="text-sm font-semibold leading-6 text-foreground">
            Learn more <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
