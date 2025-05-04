"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"

export function MobileNav({ currentPath }) {
  const [open, setOpen] = useState(false)

  const routes = [
    { href: "/", label: "Dashboard" },
    { href: "/restaurants", label: "Restaurants" },
    { href: "/goals", label: "My Goals" },
    { href: "/suggestions", label: "Suggestions" },
  ]

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[80vw] sm:w-[350px] pt-10">
        <div className="flex flex-col gap-6">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={`text-lg font-medium ${
                currentPath === route.href
                  ? "text-emerald-600"
                  : "text-muted-foreground hover:text-foreground transition-colors"
              }`}
              onClick={() => setOpen(false)}
            >
              {route.label}
            </Link>
          ))}
          <div className="h-px bg-border my-2" />
          <Button className="w-full bg-emerald-600 hover:bg-emerald-700 transition-all">Track Meal</Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
