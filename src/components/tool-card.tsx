"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Calculator,
  Home,
  DollarSign,
  FileText,
  ArrowRightLeft,
  GraduationCap,
  Briefcase,
  MapPin,
  TrendingUp,
  Users,
  type LucideIcon,
} from "lucide-react";

// Map icon names to components
const iconMap: Record<string, LucideIcon> = {
  Calculator,
  Home,
  DollarSign,
  FileText,
  ArrowRightLeft,
  GraduationCap,
  Briefcase,
  MapPin,
  TrendingUp,
  Users,
};

interface ToolCardProps {
  title: string;
  description: string;
  href: string;
  iconName: string;
  className?: string;
}

export function ToolCard({ title, description, href, iconName, className }: ToolCardProps) {
  const Icon = iconMap[iconName] || Calculator;

  return (
    <Link href={href} className="block group">
      <Card className={cn(
        "h-full transition-all duration-200 hover:shadow-card-hover hover:border-primary/20",
        className
      )}>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Icon className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-lg group-hover:text-primary transition-colors">
                {title}
              </CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-sm">
            {description}
          </CardDescription>
          <Button
            variant="ghost"
            className="mt-4 p-0 h-auto text-primary hover:text-primary/80 hover:bg-transparent"
          >
            Get started <span aria-hidden="true" className="ml-1">→</span>
          </Button>
        </CardContent>
      </Card>
    </Link>
  );
}
