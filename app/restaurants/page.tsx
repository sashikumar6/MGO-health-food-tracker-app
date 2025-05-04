"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, MapPin, Star, Filter } from "lucide-react"
import { useState } from "react"
import { SearchDialog } from "@/components/search-dialog"
import { NotificationsDropdown } from "@/components/notifications-dropdown"
import { getImageUrl } from "@/lib/food-images"

export default function RestaurantsPage() {
  const restaurants = [
    {
      id: "sweetgreen",
      name: "Sweetgreen",
      category: "Salads & Bowls",
      rating: 4.8,
      dishes: 42,
      location: "Multiple locations",
      image: getImageUrl("restaurants", "sweetgreen"),
      interior: getImageUrl("restaurantInteriors", "casual"),
    },
    {
      id: "chipotle",
      name: "Chipotle",
      category: "Mexican",
      rating: 4.5,
      dishes: 38,
      location: "Multiple locations",
      image: getImageUrl("restaurants", "chipotle"),
      interior: getImageUrl("restaurantInteriors", "modern"),
    },
    {
      id: "panera-bread",
      name: "Panera Bread",
      category: "Bakery & Sandwiches",
      rating: 4.3,
      dishes: 56,
      location: "Multiple locations",
      image: getImageUrl("restaurants", "panera"),
      interior: getImageUrl("restaurantInteriors", "elegant"),
    },
    {
      id: "chopt",
      name: "Chopt",
      category: "Salads",
      rating: 4.6,
      dishes: 31,
      location: "Multiple locations",
      image: getImageUrl("restaurants", "chopt"),
      interior: getImageUrl("restaurantInteriors", "waterfront"),
    },
    {
      id: "cava",
      name: "Cava",
      category: "Mediterranean",
      rating: 4.7,
      dishes: 35,
      location: "Multiple locations",
      image: getImageUrl("restaurants", "cava"),
      interior: getImageUrl("restaurantInteriors", "dining"),
    },
    {
      id: "just-salad",
      name: "Just Salad",
      category: "Salads",
      rating: 4.4,
      dishes: 28,
      location: "Multiple locations",
      image: getImageUrl("restaurants", "just-salad"),
      interior: getImageUrl("restaurantInteriors", "patio"),
    },
    {
      id: "dig-inn",
      name: "Dig Inn",
      category: "Bowls",
      rating: 4.5,
      dishes: 32,
      location: "Multiple locations",
      image: getImageUrl("restaurants", "dig-inn"),
      interior: getImageUrl("restaurantInteriors", "upscale"),
    },
    {
      id: "pret-a-manger",
      name: "Pret A Manger",
      category: "Sandwiches & Salads",
      rating: 4.2,
      dishes: 45,
      location: "Multiple locations",
      image: getImageUrl("restaurants", "pret-a-manger"),
      interior: getImageUrl("restaurantInteriors", "garden"),
    },
  ]

  const [searchDialogOpen, setSearchDialogOpen] = useState(false)

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6 text-emerald-500"
              >
                <path d="M12 2a10 10 0 1 0 10 10 10 10 0 0 0-10-10Z" />
                <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                <path d="M9 9h.01" />
                <path d="M15 9h.01" />
              </svg>
              <span className="text-xl font-bold">ElementEats</span>
            </Link>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Dashboard
            </Link>
            <Link href="/restaurants" className="text-sm font-medium text-foreground">
              Restaurants
            </Link>
            <Link href="/goals" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              My Goals
            </Link>
            <Link href="/suggestions" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Suggestions
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setSearchDialogOpen(true)}>
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="md:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <line x1="4" x2="20" y1="12" y2="12" />
                <line x1="4" x2="20" y1="6" y2="6" />
                <line x1="4" x2="20" y1="18" y2="18" />
              </svg>
            </Button>
            <Button className="hidden md:flex bg-emerald-600 hover:bg-emerald-700">Track Meal</Button>
            <NotificationsDropdown />
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="container py-6 md:py-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold">Restaurants</h1>
              <p className="text-muted-foreground">Find healthy options at your favorite restaurants</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search restaurants..."
                  className="w-full pl-8 md:w-[300px]"
                  onClick={() => setSearchDialogOpen(true)}
                  readOnly
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <Tabs defaultValue="all" className="mt-6">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="nearby">Nearby</TabsTrigger>
              <TabsTrigger value="popular">Popular</TabsTrigger>
              <TabsTrigger value="healthy">Healthiest</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-6">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {restaurants.map((restaurant) => (
                  <Link href={`/restaurants/${restaurant.id}`} key={restaurant.id}>
                    <Card className="overflow-hidden hover:shadow-md transition-shadow">
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={restaurant.image || "/placeholder.svg"}
                          alt={restaurant.name}
                          width={400}
                          height={300}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end">
                          <div className="p-4 w-full">
                            <p className="text-white font-medium">{restaurant.name}</p>
                            <p className="text-white/80 text-sm">{restaurant.category}</p>
                          </div>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{restaurant.name}</h3>
                            <p className="text-sm text-muted-foreground">{restaurant.category}</p>
                          </div>
                          <div className="flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2 py-1 rounded text-xs font-medium">
                            <Star className="h-3 w-3 fill-emerald-500 text-emerald-500" />
                            {restaurant.rating}
                          </div>
                        </div>
                        <div className="mt-3 flex items-center text-sm text-muted-foreground">
                          <MapPin className="h-3.5 w-3.5 mr-1" />
                          {restaurant.location}
                        </div>
                        <div className="mt-4 text-sm">
                          <span className="font-medium">{restaurant.dishes}</span> dishes available
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="nearby">
              <div className="flex items-center justify-center h-40 text-muted-foreground">
                Enable location services to see nearby restaurants
              </div>
            </TabsContent>
            <TabsContent value="popular">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {restaurants
                  .sort((a, b) => b.rating - a.rating)
                  .slice(0, 4)
                  .map((restaurant) => (
                    <Link href={`/restaurants/${restaurant.id}`} key={restaurant.id}>
                      <Card className="overflow-hidden hover:shadow-md transition-shadow">
                        <div className="relative h-48 overflow-hidden">
                          <Image
                            src={restaurant.image || "/placeholder.svg"}
                            alt={restaurant.name}
                            width={400}
                            height={300}
                            className="w-full h-48 object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end">
                            <div className="p-4 w-full">
                              <p className="text-white font-medium">{restaurant.name}</p>
                              <p className="text-white/80 text-sm">{restaurant.category}</p>
                            </div>
                          </div>
                        </div>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">{restaurant.name}</h3>
                              <p className="text-sm text-muted-foreground">{restaurant.category}</p>
                            </div>
                            <div className="flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2 py-1 rounded text-xs font-medium">
                              <Star className="h-3 w-3 fill-emerald-500 text-emerald-500" />
                              {restaurant.rating}
                            </div>
                          </div>
                          <div className="mt-3 flex items-center text-sm text-muted-foreground">
                            <MapPin className="h-3.5 w-3.5 mr-1" />
                            {restaurant.location}
                          </div>
                          <div className="mt-4 text-sm">
                            <span className="font-medium">{restaurant.dishes}</span> dishes available
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
              </div>
            </TabsContent>
            <TabsContent value="healthy">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {restaurants
                  .filter((r) => ["Salads", "Salads & Bowls"].includes(r.category))
                  .map((restaurant) => (
                    <Link href={`/restaurants/${restaurant.id}`} key={restaurant.id}>
                      <Card className="overflow-hidden hover:shadow-md transition-shadow">
                        <div className="relative h-48 overflow-hidden">
                          <Image
                            src={restaurant.image || "/placeholder.svg"}
                            alt={restaurant.name}
                            width={400}
                            height={300}
                            className="w-full h-48 object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end">
                            <div className="p-4 w-full">
                              <p className="text-white font-medium">{restaurant.name}</p>
                              <p className="text-white/80 text-sm">{restaurant.category}</p>
                            </div>
                          </div>
                        </div>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">{restaurant.name}</h3>
                              <p className="text-sm text-muted-foreground">{restaurant.category}</p>
                            </div>
                            <div className="flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2 py-1 rounded text-xs font-medium">
                              <Star className="h-3 w-3 fill-emerald-500 text-emerald-500" />
                              {restaurant.rating}
                            </div>
                          </div>
                          <div className="mt-3 flex items-center text-sm text-muted-foreground">
                            <MapPin className="h-3.5 w-3.5 mr-1" />
                            {restaurant.location}
                          </div>
                          <div className="mt-4 text-sm">
                            <span className="font-medium">{restaurant.dishes}</span> dishes available
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        </section>
      </main>
      <SearchDialog open={searchDialogOpen} onOpenChange={setSearchDialogOpen} />
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-sm text-muted-foreground">© 2023 ElementEats. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Terms
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Privacy
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
