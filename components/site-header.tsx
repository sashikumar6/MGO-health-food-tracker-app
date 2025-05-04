"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Search, Salad } from "lucide-react"
import { MobileNav } from "@/components/mobile-nav"
import { NotificationsDropdown } from "@/components/notifications-dropdown"
import { TrackMealDialog } from "@/components/track-meal-dialog"

export function SiteHeader({ currentPath, onSearchClick }) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Salad className="h-6 w-6 text-emerald-500" />
            <span className="text-xl font-bold">ElementEats</span>
          </Link>
        </div>
        <nav className="hidden md:flex gap-6">
          <Link
            href="/"
            className={`text-sm font-medium ${
              currentPath === "/"
                ? "text-foreground relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-emerald-500"
                : "text-muted-foreground hover:text-foreground transition-colors"
            }`}
          >
            Dashboard
          </Link>
          <Link
            href="/restaurants"
            className={`text-sm font-medium ${
              currentPath === "/restaurants"
                ? "text-foreground relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-emerald-500"
                : "text-muted-foreground hover:text-foreground transition-colors"
            }`}
          >
            Restaurants
          </Link>
          <Link
            href="/goals"
            className={`text-sm font-medium ${
              currentPath === "/goals"
                ? "text-foreground relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-emerald-500"
                : "text-muted-foreground hover:text-foreground transition-colors"
            }`}
          >
            My Goals
          </Link>
          <Link
            href="/suggestions"
            className={`text-sm font-medium ${
              currentPath === "/suggestions"
                ? "text-foreground relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-emerald-500"
                : "text-muted-foreground hover:text-foreground transition-colors"
            }`}
          >
            Suggestions
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <NotificationsDropdown />
          <Button variant="ghost" size="icon" onClick={onSearchClick}>
            <Search className="h-5 w-5" />
          </Button>
          <MobileNav currentPath={currentPath} />
          <TrackMealDialog className="hidden md:flex" />
        </div>
      </div>
    </header>
  )
}
