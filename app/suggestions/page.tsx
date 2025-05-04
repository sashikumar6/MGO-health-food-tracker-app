"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Search, Salad, Filter, ArrowRight, Plus, Check } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { TrackMealDialog } from "@/components/track-meal-dialog"
import { getImageUrl } from "@/lib/food-images"
import { saveMealToSupabase } from "@/lib/supabase"

export default function SuggestionsPage() {
  // Track which suggestions have been added
  const [addedSuggestions, setAddedSuggestions] = useState<Record<string, boolean>>({})

  const suggestions = [
    {
      id: "breakfast-suggestion",
      title: "Protein-Packed Breakfast",
      description: "Start your day with these high-protein options to meet your daily goals",
      restaurants: [
        {
          id: "breakfast-1",
          name: "Starbucks",
          dish: "Spinach, Feta & Egg White Wrap",
          calories: 290,
          protein: 20,
          carbs: 33,
          fat: 8,
          fiber: 5,
          image: getImageUrl("dishes", "fried-egg"),
        },
        {
          id: "breakfast-2",
          name: "Pret A Manger",
          dish: "Egg & Spinach Protein Pot",
          calories: 270,
          protein: 22,
          carbs: 12,
          fat: 16,
          fiber: 3,
          image: getImageUrl("dishes", "french-toast"),
        },
        {
          id: "breakfast-3",
          name: "Panera Bread",
          dish: "Avocado, Egg White & Spinach Sandwich",
          calories: 350,
          protein: 19,
          carbs: 39,
          fat: 14,
          fiber: 6,
          image: getImageUrl("dishes", "yogurt-bowl"),
        },
      ],
    },
    {
      id: "lunch-suggestion",
      title: "Fiber-Rich Lunch Options",
      description: "These lunch choices will help you reach your daily fiber goal",
      restaurants: [
        {
          id: "lunch-1",
          name: "Sweetgreen",
          dish: "Harvest Bowl",
          calories: 705,
          protein: 32,
          carbs: 80,
          fat: 31,
          fiber: 12,
          image: getImageUrl("dishes", "harvest-bowl"),
        },
        {
          id: "lunch-2",
          name: "Chipotle",
          dish: "Veggie Burrito Bowl with Brown Rice & Beans",
          calories: 650,
          protein: 22,
          carbs: 110,
          fat: 18,
          fiber: 15,
          image: getImageUrl("dishes", "burrito-bowl"),
        },
        {
          id: "lunch-3",
          name: "Chopt",
          dish: "Mexican Caesar Salad",
          calories: 520,
          protein: 35,
          carbs: 25,
          fat: 30,
          fiber: 10,
          image: getImageUrl("dishes", "mexican-caesar"),
        },
      ],
    },
    {
      id: "dinner-suggestion",
      title: "Balanced Dinner Selections",
      description: "Complete your day with these well-balanced dinner options",
      restaurants: [
        {
          id: "dinner-1",
          name: "Dig Inn",
          dish: "Market Plate with Salmon",
          calories: 620,
          protein: 32,
          carbs: 65,
          fat: 24,
          fiber: 8,
          image: getImageUrl("dishes", "chicken-salad"),
        },
        {
          id: "dinner-2",
          name: "Cava",
          dish: "Mediterranean Bowl with Grilled Chicken",
          calories: 680,
          protein: 38,
          carbs: 72,
          fat: 28,
          fiber: 9,
          image: getImageUrl("dishes", "mediterranean-bowl"),
        },
        {
          id: "dinner-3",
          name: "Sweetgreen",
          dish: "Kale Caesar with Chicken",
          calories: 450,
          protein: 40,
          carbs: 15,
          fat: 25,
          fiber: 8,
          image: getImageUrl("dishes", "protein-bowl"),
        },
      ],
    },
    {
      id: "breakfast-healthy",
      title: "Nutrient-Dense Breakfast Ideas",
      description: "Fuel your morning with these nutritious breakfast options",
      restaurants: [
        {
          id: "healthy-breakfast-1",
          name: "Homemade",
          dish: "French Toast with Berries & Pecans",
          calories: 420,
          protein: 15,
          carbs: 48,
          fat: 18,
          fiber: 7,
          image: "/images/french-toast-berries.png",
        },
        {
          id: "healthy-breakfast-2",
          name: "Homemade",
          dish: "Greek Yogurt Bowl with Fresh Berries",
          calories: 280,
          protein: 18,
          carbs: 32,
          fat: 8,
          fiber: 6,
          image: "/images/yogurt-berries.png",
        },
        {
          id: "healthy-breakfast-3",
          name: "Homemade",
          dish: "Oatmeal with Banana, Berries & Nut Butter",
          calories: 380,
          protein: 12,
          carbs: 58,
          fat: 14,
          fiber: 9,
          image: "/images/oatmeal-banana-berries.png",
        },
      ],
    },
  ]

  // Function to handle adding a suggestion to the tracker
  const handleAddSuggestion = async (suggestionId, item) => {
    // Mark suggestion as added
    setAddedSuggestions((prev) => ({ ...prev, [suggestionId]: true }))

    // Create meal object
    const meal = {
      name: item.dish,
      restaurant: item.name,
      calories: item.calories,
      protein: item.protein,
      carbs: item.carbs,
      fat: item.fat,
      fiber: item.fiber,
    }

    // Save to Supabase
    const { error } = await saveMealToSupabase(meal)

    if (error) {
      console.error("Error saving meal to Supabase:", error.message)
      toast({
        title: "Error saving meal",
        description: "Your meal was tracked locally but couldn't be saved to the database.",
        variant: "destructive",
      })
    } else {
      // Show success toast
      toast({
        title: "Meal added to tracker",
        description: `${item.dish} (${item.calories} cal) has been added to your daily log.`,
      })
    }

    // Reset button after 2 seconds for better UX
    setTimeout(() => {
      setAddedSuggestions((prev) => ({ ...prev, [suggestionId]: false }))
    }, 2000)
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-background to-emerald-50/20">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <Salad className="h-6 w-6 text-emerald-500" />
              <span className="text-xl font-bold">ElementEats</span>
            </Link>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link
              href="/"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/restaurants"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Restaurants
            </Link>
            <Link
              href="/goals"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              My Goals
            </Link>
            <Link
              href="/suggestions"
              className="text-sm font-medium text-foreground relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-emerald-500"
            >
              Suggestions
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
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
            <TrackMealDialog className="hidden md:flex" />
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="container px-4 sm:px-6 py-6 md:py-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold">Meal Suggestions</h1>
              <p className="text-muted-foreground">Personalized recommendations based on your nutrition goals</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                Refresh Suggestions
              </Button>
            </div>
          </div>

          <Tabs defaultValue="all" className="mt-8">
            <TabsList>
              <TabsTrigger value="all">All Suggestions</TabsTrigger>
              <TabsTrigger value="breakfast">Breakfast</TabsTrigger>
              <TabsTrigger value="lunch">Lunch</TabsTrigger>
              <TabsTrigger value="dinner">Dinner</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-6 space-y-8">
              {suggestions.map((suggestion) => (
                <Card
                  key={suggestion.id}
                  className="overflow-hidden border-2 border-emerald-100 shadow-md hover:shadow-lg transition-all"
                >
                  <CardHeader className="bg-gradient-to-r from-emerald-50 to-transparent">
                    <CardTitle>{suggestion.title}</CardTitle>
                    <CardDescription>{suggestion.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                      {suggestion.restaurants.map((item) => (
                        <div
                          key={`${suggestion.id}-${item.id}`}
                          className="flex flex-col p-3 rounded-lg hover:bg-muted/50 transition-all"
                        >
                          <div className="relative h-48 w-full mb-3 overflow-hidden rounded-md">
                            <Image
                              src={item.image || "/placeholder.svg"}
                              alt={item.dish}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="space-y-2">
                            <div className="font-medium">{item.dish}</div>
                            <div className="text-sm text-muted-foreground">{item.name}</div>
                            <div className="flex flex-wrap gap-2">
                              <Badge variant="outline" className="bg-muted">
                                {item.calories} cal
                              </Badge>
                              {item.protein && (
                                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                  {item.protein}g protein
                                </Badge>
                              )}
                              {item.fiber && (
                                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                                  {item.fiber}g fiber
                                </Badge>
                              )}
                            </div>
                            <Button
                              size="sm"
                              className={`mt-2 w-full ${
                                addedSuggestions[item.id]
                                  ? "bg-green-600 hover:bg-green-700"
                                  : "bg-emerald-600 hover:bg-emerald-700"
                              } transition-all`}
                              onClick={() => handleAddSuggestion(item.id, item)}
                              disabled={addedSuggestions[item.id]}
                            >
                              {addedSuggestions[item.id] ? (
                                <>
                                  <Check className="h-3.5 w-3.5 mr-1" />
                                  Added
                                </>
                              ) : (
                                <>
                                  <Plus className="h-3.5 w-3.5 mr-1" />
                                  Add to Tracker
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
            <TabsContent value="breakfast" className="mt-6 space-y-8">
              <Card className="overflow-hidden border-2 border-emerald-100 shadow-md hover:shadow-lg transition-all">
                <CardHeader className="bg-gradient-to-r from-emerald-50 to-transparent">
                  <CardTitle>{suggestions[0].title}</CardTitle>
                  <CardDescription>{suggestions[0].description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-3">
                    {suggestions[0].restaurants.map((item) => (
                      <div
                        key={`breakfast-${item.id}`}
                        className="flex flex-col p-3 rounded-lg hover:bg-muted/50 transition-all"
                      >
                        <div className="relative h-48 w-full mb-3 overflow-hidden rounded-md">
                          <Image src={item.image || "/placeholder.svg"} alt={item.dish} fill className="object-cover" />
                        </div>
                        <div className="space-y-2">
                          <div className="font-medium">{item.dish}</div>
                          <div className="text-sm text-muted-foreground">{item.name}</div>
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="outline" className="bg-muted">
                              {item.calories} cal
                            </Badge>
                            {item.protein && (
                              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                {item.protein}g protein
                              </Badge>
                            )}
                          </div>
                          <Button
                            size="sm"
                            className={`mt-2 w-full ${
                              addedSuggestions[item.id]
                                ? "bg-green-600 hover:bg-green-700"
                                : "bg-emerald-600 hover:bg-emerald-700"
                            } transition-all`}
                            onClick={() => handleAddSuggestion(item.id, item)}
                            disabled={addedSuggestions[item.id]}
                          >
                            {addedSuggestions[item.id] ? (
                              <>
                                <Check className="h-3.5 w-3.5 mr-1" />
                                Added
                              </>
                            ) : (
                              <>
                                <Plus className="h-3.5 w-3.5 mr-1" />
                                Add to Tracker
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="overflow-hidden border-2 border-emerald-100 shadow-md hover:shadow-lg transition-all">
                <CardHeader className="bg-gradient-to-r from-emerald-50 to-transparent">
                  <CardTitle>{suggestions[3].title}</CardTitle>
                  <CardDescription>{suggestions[3].description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-3">
                    {suggestions[3].restaurants.map((item) => (
                      <div
                        key={`healthy-breakfast-${item.id}`}
                        className="flex flex-col p-3 rounded-lg hover:bg-muted/50 transition-all"
                      >
                        <div className="relative h-48 w-full mb-3 overflow-hidden rounded-md">
                          <Image src={item.image || "/placeholder.svg"} alt={item.dish} fill className="object-cover" />
                        </div>
                        <div className="space-y-2">
                          <div className="font-medium">{item.dish}</div>
                          <div className="text-sm text-muted-foreground">{item.name}</div>
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="outline" className="bg-muted">
                              {item.calories} cal
                            </Badge>
                            {item.protein && (
                              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                {item.protein}g protein
                              </Badge>
                            )}
                            {item.fiber && (
                              <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                                {item.fiber}g fiber
                              </Badge>
                            )}
                          </div>
                          <Button
                            size="sm"
                            className={`mt-2 w-full ${
                              addedSuggestions[item.id]
                                ? "bg-green-600 hover:bg-green-700"
                                : "bg-emerald-600 hover:bg-emerald-700"
                            } transition-all`}
                            onClick={() => handleAddSuggestion(item.id, item)}
                            disabled={addedSuggestions[item.id]}
                          >
                            {addedSuggestions[item.id] ? (
                              <>
                                <Check className="h-3.5 w-3.5 mr-1" />
                                Added
                              </>
                            ) : (
                              <>
                                <Plus className="h-3.5 w-3.5 mr-1" />
                                Add to Tracker
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="lunch" className="mt-6">
              <Card className="overflow-hidden border-2 border-emerald-100 shadow-md hover:shadow-lg transition-all">
                <CardHeader className="bg-gradient-to-r from-emerald-50 to-transparent">
                  <CardTitle>{suggestions[1].title}</CardTitle>
                  <CardDescription>{suggestions[1].description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-3">
                    {suggestions[1].restaurants.map((item) => (
                      <div
                        key={`lunch-${item.id}`}
                        className="flex flex-col p-3 rounded-lg hover:bg-muted/50 transition-all"
                      >
                        <div className="relative h-48 w-full mb-3 overflow-hidden rounded-md">
                          <Image src={item.image || "/placeholder.svg"} alt={item.dish} fill className="object-cover" />
                        </div>
                        <div className="space-y-2">
                          <div className="font-medium">{item.dish}</div>
                          <div className="text-sm text-muted-foreground">{item.name}</div>
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="outline" className="bg-muted">
                              {item.calories} cal
                            </Badge>
                            {item.fiber && (
                              <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                                {item.fiber}g fiber
                              </Badge>
                            )}
                          </div>
                          <Button
                            size="sm"
                            className={`mt-2 w-full ${
                              addedSuggestions[item.id]
                                ? "bg-green-600 hover:bg-green-700"
                                : "bg-emerald-600 hover:bg-emerald-700"
                            } transition-all`}
                            onClick={() => handleAddSuggestion(item.id, item)}
                            disabled={addedSuggestions[item.id]}
                          >
                            {addedSuggestions[item.id] ? (
                              <>
                                <Check className="h-3.5 w-3.5 mr-1" />
                                Added
                              </>
                            ) : (
                              <>
                                <Plus className="h-3.5 w-3.5 mr-1" />
                                Add to Tracker
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="dinner" className="mt-6">
              <Card className="overflow-hidden border-2 border-emerald-100 shadow-md hover:shadow-lg transition-all">
                <CardHeader className="bg-gradient-to-r from-emerald-50 to-transparent">
                  <CardTitle>{suggestions[2].title}</CardTitle>
                  <CardDescription>{suggestions[2].description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-3">
                    {suggestions[2].restaurants.map((item) => (
                      <div
                        key={`dinner-${item.id}`}
                        className="flex flex-col p-3 rounded-lg hover:bg-muted/50 transition-all"
                      >
                        <div className="relative h-48 w-full mb-3 overflow-hidden rounded-md">
                          <Image src={item.image || "/placeholder.svg"} alt={item.dish} fill className="object-cover" />
                        </div>
                        <div className="space-y-2">
                          <div className="font-medium">{item.dish}</div>
                          <div className="text-sm text-muted-foreground">{item.name}</div>
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="outline" className="bg-muted">
                              {item.calories} cal
                            </Badge>
                            {item.protein && (
                              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                {item.protein}g protein
                              </Badge>
                            )}
                            {item.fiber && (
                              <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                                {item.fiber}g fiber
                              </Badge>
                            )}
                          </div>
                          <Button
                            size="sm"
                            className={`mt-2 w-full ${
                              addedSuggestions[item.id]
                                ? "bg-green-600 hover:bg-green-700"
                                : "bg-emerald-600 hover:bg-emerald-700"
                            } transition-all`}
                            onClick={() => handleAddSuggestion(item.id, item)}
                            disabled={addedSuggestions[item.id]}
                          >
                            {addedSuggestions[item.id] ? (
                              <>
                                <Check className="h-3.5 w-3.5 mr-1" />
                                Added
                              </>
                            ) : (
                              <>
                                <Plus className="h-3.5 w-3.5 mr-1" />
                                Add to Tracker
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="mt-10">
            <h2 className="text-2xl font-bold mb-6">Based on Your Recent Meals</h2>
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              <Card className="overflow-hidden border-2 border-emerald-100 shadow-md hover:shadow-lg transition-all">
                <CardHeader className="pb-2 bg-gradient-to-r from-emerald-50 to-transparent">
                  <CardTitle className="text-lg">Complete Your Protein Goal</CardTitle>
                  <CardDescription>You're 45g short of your daily protein goal</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <div className="relative h-20 w-20 rounded-md overflow-hidden">
                      <Image src="/images/salmon-salad.png" alt="Grilled Chicken Salad" fill className="object-cover" />
                    </div>
                    <div>
                      <div className="font-medium">Grilled Chicken Salad</div>
                      <div className="text-sm text-muted-foreground">Chopt</div>
                      <Badge variant="outline" className="mt-1 bg-blue-50 text-blue-700 border-blue-200">
                        32g protein
                      </Badge>
                    </div>
                  </div>
                  <Button variant="link" className="mt-2 h-8 p-0 text-emerald-600" asChild>
                    <Link href="/restaurants/chopt">
                      View more options
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="overflow-hidden border-2 border-emerald-100 shadow-md hover:shadow-lg transition-all">
                <CardHeader className="pb-2 bg-gradient-to-r from-emerald-50 to-transparent">
                  <CardTitle className="text-lg">Boost Your Fiber Intake</CardTitle>
                  <CardDescription>You're 15g short of your daily fiber goal</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <div className="relative h-20 w-20 rounded-md overflow-hidden">
                      <Image src="/images/healthy-dishes.png" alt="Harvest Bowl" fill className="object-cover" />
                    </div>
                    <div>
                      <div className="font-medium">Harvest Bowl</div>
                      <div className="text-sm text-muted-foreground">Sweetgreen</div>
                      <Badge variant="outline" className="mt-1 bg-amber-50 text-amber-700 border-amber-200">
                        12g fiber
                      </Badge>
                    </div>
                  </div>
                  <Button variant="link" className="mt-2 h-8 p-0 text-emerald-600" asChild>
                    <Link href="/restaurants/sweetgreen">
                      View more options
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="overflow-hidden border-2 border-emerald-100 shadow-md hover:shadow-lg transition-all">
                <CardHeader className="pb-2 bg-gradient-to-r from-emerald-50 to-transparent">
                  <CardTitle className="text-lg">Stay Within Calorie Budget</CardTitle>
                  <CardDescription>You have 650 calories left for today</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <div className="relative h-20 w-20 rounded-md overflow-hidden">
                      <Image src="/images/yogurt-berries.png" alt="Greek Yogurt Bowl" fill className="object-cover" />
                    </div>
                    <div>
                      <div className="font-medium">Greek Yogurt Bowl</div>
                      <div className="text-sm text-muted-foreground">Homemade</div>
                      <Badge variant="outline" className="mt-1 bg-muted">
                        280 calories
                      </Badge>
                    </div>
                  </div>
                  <Button variant="link" className="mt-2 h-8 p-0 text-emerald-600" asChild>
                    <Link href="/suggestions?filter=low-calorie">
                      View more options
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <footer className="border-t py-6 md:py-0 bg-gradient-to-b from-transparent to-emerald-50/30">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
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
      <Toaster />
    </div>
  )
}
