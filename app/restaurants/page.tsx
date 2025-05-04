"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Star, Filter } from "lucide-react"
import { SearchDialog } from "@/components/search-dialog"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
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
      <SiteHeader currentPath="/restaurants" onSearchClick={() => setSearchDialogOpen(true)} />

      <main className="flex-1 w-full overflow-x-hidden">
        <section className="w-full py-6 md:py-10">
          <div className="container px-4 sm:px-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-bold">Restaurants</h1>
                <p className="text-muted-foreground">Find healthy options at your favorite restaurants</p>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-2 w-full md:w-auto">
                <div className="relative w-full sm:w-auto">
                  <Filter className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search restaurants..."
                    className="w-full pl-8 md:w-[300px]"
                    onClick={() => setSearchDialogOpen(true)}
                    readOnly
                  />
                </div>
                <Button variant="outline" size="icon" className="mt-2 sm:mt-0">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <Tabs defaultValue="all" className="mt-6">
              <div className="overflow-x-auto pb-2">
                <TabsList className="w-full sm:w-auto">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="nearby">Nearby</TabsTrigger>
                  <TabsTrigger value="popular">Popular</TabsTrigger>
                  <TabsTrigger value="healthy">Healthiest</TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="all" className="mt-6">
                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {restaurants.map((restaurant) => (
                    <Link href={`/restaurants/${restaurant.id}`} key={restaurant.id} className="w-full">
                      <Card className="overflow-hidden hover:shadow-md transition-shadow w-full">
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
                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {restaurants
                    .sort((a, b) => b.rating - a.rating)
                    .slice(0, 4)
                    .map((restaurant) => (
                      <Link href={`/restaurants/${restaurant.id}`} key={restaurant.id} className="w-full">
                        <Card className="overflow-hidden hover:shadow-md transition-shadow w-full">
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
                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {restaurants
                    .filter((r) => ["Salads", "Salads & Bowls"].includes(r.category))
                    .map((restaurant) => (
                      <Link href={`/restaurants/${restaurant.id}`} key={restaurant.id} className="w-full">
                        <Card className="overflow-hidden hover:shadow-md transition-shadow w-full">
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
          </div>
        </section>
      </main>

      <SiteFooter />
      <SearchDialog open={searchDialogOpen} onOpenChange={setSearchDialogOpen} />
    </div>
  )
}
