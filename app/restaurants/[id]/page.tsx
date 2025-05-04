"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { MapPin, Star, Clock, ArrowLeft, Plus, Check } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { TrackMealDialog } from "@/components/track-meal-dialog"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { saveMealToSupabase } from "@/lib/supabase"
import { getImageUrl } from "@/lib/food-images"

export default function RestaurantPage({ params }: { params: { id: string } }) {
  // Track which dishes have been added
  const [addedDishes, setAddedDishes] = useState<Record<string, boolean>>({})
  const [searchDialogOpen, setSearchDialogOpen] = useState(false)

  // In a real app, we would fetch this data from an API based on the ID
  const restaurant = {
    id: params.id,
    name: params.id === "sweetgreen" ? "Sweetgreen" : params.id === "chopt" ? "Chopt" : "Restaurant",
    category: params.id === "chopt" ? "Salads" : "Salads & Bowls",
    rating: params.id === "chopt" ? 4.6 : 4.8,
    location: "Multiple locations",
    image: getImageUrl("restaurants", params.id),
    interiorImage: getImageUrl("restaurantInteriors", params.id === "chopt" ? "waterfront" : "elegant"),
    description:
      params.id === "chopt"
        ? "Chopt Creative Salad Co. is a fast-casual restaurant chain specializing in custom-built salads and salad wraps."
        : "Sweetgreen is an American fast casual restaurant chain that serves salads. Our mission is to connect people to real food.",
    dishes: [
      {
        id: params.id === "chopt" ? "mexican-caesar" : "harvest-bowl",
        name: params.id === "chopt" ? "Mexican Caesar Salad" : "Harvest Bowl",
        description:
          params.id === "chopt"
            ? "Romaine, kale, grilled chicken, cotija cheese, jalapeño peppers, tortilla chips, and Mexican Caesar dressing"
            : "Roasted chicken, sweet potatoes, apples, goat cheese, roasted almonds, and balsamic vinaigrette",
        calories: params.id === "chopt" ? 520 : 705,
        protein: params.id === "chopt" ? 35 : 32,
        carbs: params.id === "chopt" ? 25 : 80,
        fat: params.id === "chopt" ? 30 : 31,
        fiber: params.id === "chopt" ? 10 : 12,
        image: getImageUrl("dishes", params.id === "chopt" ? "mexican-caesar" : "harvest-bowl"),
        tags: ["Popular", "High Protein"],
      },
      {
        id: params.id === "chopt" ? "kale-caesar" : "protein-bowl",
        name: params.id === "chopt" ? "Kale Caesar Salad" : "Protein Power Bowl",
        description:
          params.id === "chopt"
            ? "Kale, romaine, grilled chicken, parmesan, croutons, and classic Caesar dressing"
            : "Quinoa, roasted chicken, avocado, roasted broccoli, sweet potatoes, and tahini dressing",
        calories: params.id === "chopt" ? 450 : 620,
        protein: params.id === "chopt" ? 30 : 42,
        carbs: params.id === "chopt" ? 20 : 65,
        fat: params.id === "chopt" ? 28 : 25,
        fiber: params.id === "chopt" ? 8 : 14,
        image: getImageUrl("dishes", params.id === "chopt" ? "chicken-salad" : "protein-bowl"),
        tags: ["Bestseller", "Keto-Friendly"],
      },
      {
        id: params.id === "chopt" ? "mediterranean-bowl" : "grilled-chicken",
        name: params.id === "chopt" ? "Mediterranean Bowl" : "Grilled Chicken Plate",
        description:
          params.id === "chopt"
            ? "Mixed greens, falafel, hummus, feta, cucumber, tomato, and lemon tahini dressing"
            : "Grilled chicken breast, quinoa, roasted vegetables, and avocado",
        calories: params.id === "chopt" ? 580 : 490,
        protein: params.id === "chopt" ? 18 : 38,
        carbs: params.id === "chopt" ? 65 : 42,
        fat: params.id === "chopt" ? 32 : 18,
        fiber: params.id === "chopt" ? 12 : 10,
        image: getImageUrl("dishes", params.id === "chopt" ? "mediterranean-bowl" : "grilled-chicken-plate"),
        tags: ["Vegetarian", "Plant-Based"],
      },
    ],
  }

  // Function to handle adding a dish to the tracker
  const handleAddToTracker = async (dish) => {
    // Mark dish as added
    setAddedDishes((prev) => ({ ...prev, [dish.id]: true }))

    // Create meal object
    const meal = {
      name: dish.name,
      restaurant: restaurant.name,
      calories: dish.calories,
      protein: dish.protein,
      carbs: dish.carbs,
      fat: dish.fat,
      fiber: dish.fiber,
    }

    // Save to Supabase
    const { error } = await saveMealToSupabase(meal)

    if (error) {
      toast({
        title: "Error saving meal",
        description: "Your meal was tracked locally but couldn't be saved to the database.",
        variant: "destructive",
      })
    } else {
      // Show success toast
      toast({
        title: "Meal added to tracker",
        description: `${dish.name} (${dish.calories} cal) has been added to your daily log.`,
      })
    }

    // Reset button after 2 seconds for better UX
    setTimeout(() => {
      setAddedDishes((prev) => ({ ...prev, [dish.id]: false }))
    }, 2000)
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-background to-emerald-50/20">
      <SiteHeader currentPath="/restaurants" onSearchClick={() => setSearchDialogOpen(true)} />

      <main className="flex-1 w-full overflow-x-hidden">
        <div className="relative">
          <div className="w-full h-60 sm:h-80 bg-gradient-to-r from-emerald-100 to-emerald-50 overflow-hidden">
            <Image
              src={restaurant.interiorImage || "/placeholder.svg"}
              alt={restaurant.name}
              width={1200}
              height={600}
              className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          </div>
          <div className="absolute top-4 left-4">
            <Button variant="outline" size="sm" className="bg-background/80 backdrop-blur-sm" asChild>
              <Link href="/restaurants">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Link>
            </Button>
          </div>
          <div className="absolute bottom-4 left-4 md:left-8 text-white">
            <h1 className="text-2xl sm:text-3xl font-bold">{restaurant.name}</h1>
            <div className="flex flex-wrap items-center gap-4 mt-2">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span>{restaurant.rating}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{restaurant.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>Open now</span>
              </div>
            </div>
          </div>
        </div>
        <div className="container px-4 sm:px-6 py-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="mt-4 text-muted-foreground">{restaurant.description}</p>
            </div>
            <TrackMealDialog>
              <Button className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 transition-all">
                <Plus className="h-4 w-4 mr-2" />
                Track Meal
              </Button>
            </TrackMealDialog>
          </div>

          <Tabs defaultValue="menu" className="mt-8">
            <div className="overflow-x-auto pb-2">
              <TabsList className="w-full sm:w-auto">
                <TabsTrigger value="menu">Menu</TabsTrigger>
                <TabsTrigger value="nutrition">Nutrition Info</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="menu" className="mt-6">
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {restaurant.dishes.map((dish) => (
                  <Card
                    key={dish.id}
                    className="overflow-hidden border-2 border-emerald-100 shadow-md hover:shadow-lg transition-all group w-full"
                  >
                    <div className="relative overflow-hidden h-48">
                      <Image
                        src={dish.image || "/placeholder.svg"}
                        alt={dish.name}
                        width={400}
                        height={300}
                        className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <CardHeader className="p-4 pb-0">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{dish.name}</CardTitle>
                        <div className="text-sm font-medium">{dish.calories} cal</div>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {dish.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="bg-muted">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardHeader>
                    <CardContent className="p-4">
                      <p className="text-sm text-muted-foreground">{dish.description}</p>
                      <div className="grid grid-cols-4 gap-2 mt-4 text-sm">
                        <div className="flex flex-col items-center p-2 bg-muted rounded-lg">
                          <span className="font-medium">{dish.protein}g</span>
                          <span className="text-xs text-muted-foreground">Protein</span>
                        </div>
                        <div className="flex flex-col items-center p-2 bg-muted rounded-lg">
                          <span className="font-medium">{dish.carbs}g</span>
                          <span className="text-xs text-muted-foreground">Carbs</span>
                        </div>
                        <div className="flex flex-col items-center p-2 bg-muted rounded-lg">
                          <span className="font-medium">{dish.fat}g</span>
                          <span className="text-xs text-muted-foreground">Fat</span>
                        </div>
                        <div className="flex flex-col items-center p-2 bg-muted rounded-lg">
                          <span className="font-medium">{dish.fiber}g</span>
                          <span className="text-xs text-muted-foreground">Fiber</span>
                        </div>
                      </div>
                      <Button
                        className={`w-full mt-4 ${
                          addedDishes[dish.id]
                            ? "bg-green-600 hover:bg-green-700"
                            : "bg-emerald-600 hover:bg-emerald-700"
                        } transition-all`}
                        onClick={() => handleAddToTracker(dish)}
                        disabled={addedDishes[dish.id]}
                      >
                        {addedDishes[dish.id] ? (
                          <>
                            <Check className="h-4 w-4 mr-2" />
                            Added to Tracker
                          </>
                        ) : (
                          "Add to Tracker"
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="nutrition" className="mt-6">
              <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                {restaurant.dishes.map((dish) => (
                  <Card key={`nutrition-${dish.id}`} className="overflow-hidden border border-muted w-full">
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-lg">{dish.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span>Calories</span>
                          <span className="font-medium">{dish.calories} kcal</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Protein</span>
                          <span className="font-medium">{dish.protein}g</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Carbohydrates</span>
                          <span className="font-medium">{dish.carbs}g</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Fat</span>
                          <span className="font-medium">{dish.fat}g</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Fiber</span>
                          <span className="font-medium">{dish.fiber}g</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="reviews" className="mt-6">
              <Card className="border border-muted">
                <CardContent className="p-6">
                  <div className="flex justify-center items-center h-40 text-muted-foreground">Reviews coming soon</div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <SiteFooter />
      <Toaster />
    </div>
  )
}
