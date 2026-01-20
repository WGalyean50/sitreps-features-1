import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="mx-auto flex max-w-7xl items-center p-4 lg:px-8" aria-label="Global">
        <Link href="/" className="-m-1.5 p-1.5">
          <span className="text-xl font-bold text-primary">Sitreps</span>
        </Link>
      </nav>
    </header>
  );
}
