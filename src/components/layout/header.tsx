"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const navigation: { name: string; href: string }[] = [];

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8" aria-label="Global">
        {/* Logo */}
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="text-xl font-bold text-primary">Sitreps</span>
          </Link>
        </div>

        {/* Navigation */}
        <div className="flex gap-x-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="flex flex-1 justify-end">
          <Link href="/tools">
            <Button>Get Started</Button>
          </Link>
        </div>
      </nav>
    </header>
  );
}
