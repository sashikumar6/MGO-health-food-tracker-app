import Link from "next/link"
import { Salad } from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="border-t py-6 md:py-0 bg-gradient-to-b from-transparent to-emerald-50/30">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row px-4">
        <div className="flex items-center gap-2">
          <Salad className="h-5 w-5 text-emerald-500" />
          <p className="text-sm text-muted-foreground">© 2023 ElementEats. All rights reserved.</p>
        </div>
        <div className="flex gap-4">
          <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Terms
          </Link>
          <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Privacy
          </Link>
          <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  )
}
