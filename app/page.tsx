"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Utensils, Apple, Salad, TrendingUp, Search, Plus, Check, ChevronRight, Save } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { NutritionDetails } from "@/components/nutrition-details"
import { SaveGoalsDialog } from "@/components/save-goals-dialog"
import { SearchDialog } from "@/components/search-dialog"
import { NotificationsDropdown } from "@/components/notifications-dropdown"
import { loadUserGoals, saveMealToSupabase, saveGoalsToSupabase, getDailyNutritionTotals } from "@/lib/supabase"

export default function Home() {
  // State for nutrition data
  const [calories, setCalories] = useState(1200)
  const [protein, setProtein] = useState(45)
  const [carbs, setCarbs] = useState(150)
  const [fat, setFat] = useState(53)
  const [fiber, setFiber] = useState(12)

  // State for nutrition goals
  const [nutritionGoals, setNutritionGoals] = useState({
    calorieGoal: 2000,
    proteinGoal: 120,
    carbGoal: 250,
    fatGoal: 65,
    fiberGoal: 30,
    autoCalculate: false,
  })

  // State for dialogs
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false)
  const [goalsDialogOpen, setGoalsDialogOpen] = useState(false)
  const [trackMealDialogOpen, setTrackMealDialogOpen] = useState(false)
  const [searchDialogOpen, setSearchDialogOpen] = useState(false)

  // State for meals
  const [recentMeals, setRecentMeals] = useState([
    {
      id: 1,
      name: "Breakfast Sandwich",
      restaurant: "Starbucks",
      time: "8:30 AM",
      calories: 420,
      protein: 18,
      carbs: 40,
      fat: 22,
      fiber: 2,
      icon: <Apple className="h-4 w-4 text-red-500" />,
    },
    {
      id: 2,
      name: "Chicken Caesar Salad",
      restaurant: "Sweetgreen",
      time: "12:15 PM",
      calories: 450,
      protein: 30,
      carbs: 20,
      fat: 25,
      fiber: 5,
      icon: <Utensils className="h-4 w-4 text-amber-500" />,
    },
    {
      id: 3,
      name: "Protein Smoothie",
      restaurant: "Jamba Juice",
      time: "3:45 PM",
      calories: 320,
      protein: 20,
      carbs: 45,
      fat: 6,
      fiber: 5,
      icon: <TrendingUp className="h-4 w-4 text-emerald-500" />,
    },
  ])

  const [suggestions, setSuggestions] = useState([
    {
      id: 1,
      name: "Grilled Chicken Salad",
      restaurant: "Panera Bread",
      calories: 380,
      protein: 32,
      carbs: 15,
      fat: 18,
      fiber: 6,
      added: false,
    },
    {
      id: 2,
      name: "Protein Power Bowl",
      restaurant: "Chipotle",
      calories: 510,
      protein: 40,
      carbs: 45,
      fat: 22,
      fiber: 8,
      added: false,
    },
    {
      id: 3,
      name: "Mediterranean Wrap",
      restaurant: "Pret A Manger",
      calories: 420,
      protein: 18,
      carbs: 48,
      fat: 16,
      fiber: 7,
      added: false,
    },
  ])

  // Add this with the other state variables
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Load data from Supabase on component mount
  useEffect(() => {
    async function loadUserData() {
      try {
        // Load user goals
        const { data: goalsData, error: goalsError } = await loadUserGoals()

        if (goalsError) {
          console.error("Error fetching goals:", goalsError.message)
        } else if (goalsData) {
          setNutritionGoals({
            calorieGoal: goalsData.calorie_goal || 2000,
            proteinGoal: goalsData.protein_goal || 120,
            carbGoal: goalsData.carb_goal || 250,
            fatGoal: goalsData.fat_goal || 65,
            fiberGoal: goalsData.fiber_goal || 30,
            autoCalculate: goalsData.auto_calculate || false,
          })
        }

        // Load daily nutrition totals
        const { data: nutritionData, error: nutritionError } = await getDailyNutritionTotals()

        if (nutritionError) {
          console.error("Error fetching nutrition data:", nutritionError.message)
        } else if (nutritionData) {
          setCalories(nutritionData.calories)
          setProtein(nutritionData.protein)
          setCarbs(nutritionData.carbs)
          setFat(nutritionData.fat)
          setFiber(nutritionData.fiber)

          if (nutritionData.meals && nutritionData.meals.length > 0) {
            // Transform the data to match our state structure
            const formattedMeals = nutritionData.meals.map((meal) => ({
              id: meal.id,
              name: meal.name,
              restaurant: meal.restaurant,
              time: new Date(meal.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              calories: meal.calories,
              protein: meal.protein,
              carbs: meal.carbs,
              fat: meal.fat,
              fiber: meal.fiber,
              icon: <Utensils className="h-4 w-4 text-emerald-500" />,
            }))

            setRecentMeals(formattedMeals.slice(0, 3))
          }
        }
      } catch (error) {
        console.error("Error loading user data:", error)
      }
    }

    // Load user data from Supabase
    loadUserData()
  }, [])

  const handleAddMeal = (meal) => {
    // Update nutrition totals
    setCalories(calories + meal.calories)
    if (meal.protein) setProtein(protein + meal.protein)
    if (meal.carbs) setCarbs(carbs + (meal.carbs || 0))
    if (meal.fat) setFat(fat + (meal.fat || 0))
    if (meal.fiber) setFiber(fiber + (meal.fiber || 0))

    // Add to recent meals
    const newMeal = {
      id: Date.now(),
      name: meal.name,
      restaurant: meal.restaurant,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      calories: meal.calories,
      protein: meal.protein,
      carbs: meal.carbs,
      fat: meal.fat,
      fiber: meal.fiber,
      icon: <Utensils className="h-4 w-4 text-emerald-500" />,
    }

    setRecentMeals([newMeal, ...recentMeals.slice(0, 2)])

    // In a real app, save to Supabase
    saveMealToSupabase(newMeal)

    // Show success toast
    toast({
      title: "Meal added to tracker",
      description: `${meal.name} (${meal.calories} cal) has been added to your daily log.`,
    })

    // Close dialog if open
    setTrackMealDialogOpen(false)
  }

  const handleAddSuggestion = (id) => {
    setSuggestions(
      suggestions.map((suggestion) => (suggestion.id === id ? { ...suggestion, added: true } : suggestion)),
    )

    const meal = suggestions.find((s) => s.id === id)
    if (meal) {
      handleAddMeal(meal)
    }
  }

  const handleTrackCustomMeal = (formData) => {
    const meal = {
      name: formData.get("meal-name"),
      restaurant: formData.get("restaurant"),
      calories: Number.parseInt(formData.get("calories")),
      protein: Number.parseInt(formData.get("protein") || "0"),
      carbs: Number.parseInt(formData.get("carbs") || "0"),
      fat: Number.parseInt(formData.get("fat") || "0"),
      fiber: Number.parseInt(formData.get("fiber") || "0"),
    }

    handleAddMeal(meal)
  }

  const handleSaveGoals = async (newGoals) => {
    setNutritionGoals(newGoals)

    // Save to Supabase
    const { error } = await saveGoalsToSupabase({
      calorieGoal: newGoals.calorieGoal,
      proteinGoal: newGoals.proteinGoal,
      carbGoal: newGoals.carbGoal,
      fatGoal: newGoals.fatGoal,
      fiberGoal: newGoals.fiberGoal,
      autoCalculate: newGoals.autoCalculate,
    })

    if (error) {
      toast({
        title: "Error saving goals",
        description: "There was a problem saving your goals. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Add this function before the return statement
  const refreshData = async () => {
    setIsRefreshing(true)

    async function loadUserData() {
      try {
        // Load user goals
        const { data: goalsData, error: goalsError } = await loadUserGoals()

        if (goalsError) {
          console.error("Error fetching goals:", goalsError.message)
        } else if (goalsData) {
          setNutritionGoals({
            calorieGoal: goalsData.calorie_goal || 2000,
            proteinGoal: goalsData.protein_goal || 120,
            carbGoal: goalsData.carb_goal || 250,
            fatGoal: goalsData.fat_goal || 65,
            fiberGoal: goalsData.fiber_goal || 30,
            autoCalculate: goalsData.auto_calculate || false,
          })
        }

        // Load daily nutrition totals
        const { data: nutritionData, error: nutritionError } = await getDailyNutritionTotals()

        if (nutritionError) {
          console.error("Error fetching nutrition data:", nutritionError.message)
        } else if (nutritionData) {
          setCalories(nutritionData.calories)
          setProtein(nutritionData.protein)
          setCarbs(nutritionData.carbs)
          setFat(nutritionData.fat)
          setFiber(nutritionData.fiber)

          if (nutritionData.meals && nutritionData.meals.length > 0) {
            // Transform the data to match our state structure
            const formattedMeals = nutritionData.meals.map((meal) => ({
              id: meal.id,
              name: meal.name,
              restaurant: meal.restaurant,
              time: new Date(meal.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              calories: meal.calories,
              protein: meal.protein,
              carbs: meal.carbs,
              fat: meal.fat,
              fiber: meal.fiber,
              icon: <Utensils className="h-4 w-4 text-emerald-500" />,
            }))

            setRecentMeals(formattedMeals.slice(0, 3))
          }
        }
      } catch (error) {
        console.error("Error loading user data:", error)
      }
    }

    await loadUserData()
    setIsRefreshing(false)

    toast({
      title: "Data refreshed",
      description: "Your nutrition data has been updated.",
    })
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-background to-emerald-50/20">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Salad className="h-6 w-6 text-emerald-500" />
            <span className="text-xl font-bold">ElementEat</span>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link
              href="/"
              className="text-sm font-medium text-foreground relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-emerald-500"
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
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Suggestions
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <NotificationsDropdown />
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
            <Dialog open={trackMealDialogOpen} onOpenChange={setTrackMealDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  className="hidden md:flex bg-emerald-600 hover:bg-emerald-700 transition-colors"
                  onClick={() => setTrackMealDialogOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Track Meal
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <form action={handleTrackCustomMeal}>
                  <DialogHeader>
                    <DialogTitle>Track a Meal</DialogTitle>
                    <DialogDescription>Enter the details of your meal to add it to your daily log.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="meal-name" className="text-right">
                        Meal
                      </Label>
                      <Input
                        id="meal-name"
                        name="meal-name"
                        placeholder="e.g. Chicken Salad"
                        className="col-span-3"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="restaurant" className="text-right">
                        Restaurant
                      </Label>
                      <Input id="restaurant" name="restaurant" placeholder="e.g. Sweetgreen" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="calories" className="text-right">
                        Calories
                      </Label>
                      <Input
                        id="calories"
                        name="calories"
                        type="number"
                        placeholder="e.g. 450"
                        className="col-span-3"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="protein" className="text-right">
                        Protein (g)
                      </Label>
                      <Input id="protein" name="protein" type="number" placeholder="e.g. 25" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="carbs" className="text-right">
                        Carbs (g)
                      </Label>
                      <Input id="carbs" name="carbs" type="number" placeholder="e.g. 30" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="fat" className="text-right">
                        Fat (g)
                      </Label>
                      <Input id="fat" name="fat" type="number" placeholder="e.g. 15" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="fiber" className="text-right">
                        Fiber (g)
                      </Label>
                      <Input id="fiber" name="fiber" type="number" placeholder="e.g. 8" className="col-span-3" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
                      Add to Tracker
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="container py-6 md:py-10">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="overflow-hidden border-2 border-emerald-100 shadow-md">
              <CardHeader className="pb-2 bg-gradient-to-r from-emerald-50 to-transparent">
                <CardTitle className="text-lg flex items-center gap-2">
                  <span className="inline-block p-2 rounded-full bg-emerald-100">
                    <TrendingUp className="h-4 w-4 text-emerald-600" />
                  </span>
                  Today's Summary
                </CardTitle>
                <CardDescription>Your nutrition progress for today</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Calories</span>
                    <span className="text-sm text-muted-foreground">
                      {calories.toLocaleString()} / {nutritionGoals.calorieGoal.toLocaleString()} kcal
                    </span>
                  </div>
                  <Progress
                    value={(calories / nutritionGoals.calorieGoal) * 100}
                    className="h-2 bg-muted"
                    indicatorClassName="bg-emerald-500"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Protein</span>
                    <span className="text-sm text-muted-foreground">
                      {protein} / {nutritionGoals.proteinGoal} g
                    </span>
                  </div>
                  <Progress
                    value={(protein / nutritionGoals.proteinGoal) * 100}
                    className="h-2 bg-muted"
                    indicatorClassName="bg-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Fiber</span>
                    <span className="text-sm text-muted-foreground">
                      {fiber} / {nutritionGoals.fiberGoal} g
                    </span>
                  </div>
                  <Progress
                    value={(fiber / nutritionGoals.fiberGoal) * 100}
                    className="h-2 bg-muted"
                    indicatorClassName="bg-amber-500"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full group" onClick={() => setDetailsDialogOpen(true)}>
                  View Details
                  <ChevronRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
                </Button>
              </CardFooter>
            </Card>
            <Card className="overflow-hidden border-2 border-emerald-100 shadow-md">
              <CardHeader className="pb-2 bg-gradient-to-r from-emerald-50 to-transparent">
                <CardTitle className="text-lg flex items-center gap-2">
                  <span className="inline-block p-2 rounded-full bg-emerald-100">
                    <Utensils className="h-4 w-4 text-emerald-600" />
                  </span>
                  Meal Suggestions
                </CardTitle>
                <CardDescription>Based on your remaining goals</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {suggestions.map((suggestion) => (
                  <div
                    key={suggestion.id}
                    className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="rounded-md bg-muted p-2">
                      <Utensils className="h-4 w-4 text-emerald-500" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium">{suggestion.name}</h4>
                      <p className="text-xs text-muted-foreground">
                        {suggestion.restaurant} • {suggestion.calories} kcal • {suggestion.protein}g protein
                      </p>
                    </div>
                    <Button
                      variant={suggestion.added ? "outline" : "default"}
                      size="sm"
                      className={suggestion.added ? "pointer-events-none" : "bg-emerald-600 hover:bg-emerald-700"}
                      onClick={() => handleAddSuggestion(suggestion.id)}
                      disabled={suggestion.added}
                    >
                      {suggestion.added ? (
                        <>
                          <Check className="h-3.5 w-3.5 mr-1" />
                          Added
                        </>
                      ) : (
                        <>
                          <Plus className="h-3.5 w-3.5 mr-1" />
                          Add
                        </>
                      )}
                    </Button>
                  </div>
                ))}
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full group" asChild>
                  <Link href="/suggestions">
                    View All Suggestions
                    <ChevronRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
            <Card className="overflow-hidden border-2 border-emerald-100 shadow-md">
              <CardHeader className="pb-2 bg-gradient-to-r from-emerald-50 to-transparent">
                <CardTitle className="text-lg flex items-center gap-2">
                  <span className="inline-block p-2 rounded-full bg-emerald-100">
                    <Apple className="h-4 w-4 text-emerald-600" />
                  </span>
                  Recent Meals
                </CardTitle>
                <CardDescription>Your last tracked meals</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentMeals.map((meal) => (
                  <div
                    key={meal.id}
                    className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="rounded-md bg-muted p-2">{meal.icon}</div>
                    <div>
                      <h4 className="text-sm font-medium">{meal.name}</h4>
                      <p className="text-xs text-muted-foreground">
                        {meal.restaurant} • {meal.time} • {meal.calories} kcal
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full group" onClick={() => setDetailsDialogOpen(true)}>
                  View All Meals
                  <ChevronRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        </section>
        <section className="container py-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold flex items-center">
              <span className="inline-block p-1.5 mr-2 rounded-full bg-emerald-100">
                <Utensils className="h-5 w-5 text-emerald-600" />
              </span>
              Popular Restaurants
            </h2>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={refreshData}
                disabled={isRefreshing}
              >
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
                  className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
                >
                  <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                  <path d="M3 3v5h5" />
                  <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                  <path d="M16 21h5v-5" />
                </svg>
                {isRefreshing ? "Refreshing..." : "Refresh"}
              </Button>
              <Button
                className="bg-emerald-600 hover:bg-emerald-700 flex items-center gap-2"
                onClick={() => setGoalsDialogOpen(true)}
              >
                <Save className="h-4 w-4" />
                Save Goals
              </Button>
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              { name: "Sweetgreen", dishes: 42, image: "/images/live-well-exterior.png" },
              { name: "Chipotle", dishes: 38, image: "/images/restaurant-bar.png" },
              { name: "Panera Bread", dishes: 56, image: "/images/restaurant-interior.png" },
              { name: "Chopt", dishes: 31, image: "/images/waterfront-dining.png" },
            ].map((restaurant) => (
              <Link
                href={`/restaurants/${restaurant.name.toLowerCase().replace(/\s+/g, "-")}`}
                key={restaurant.name}
                className="group"
              >
                <Card className="overflow-hidden hover:shadow-md transition-all duration-300 group-hover:border-emerald-200 group-hover:-translate-y-1">
                  <div className="relative h-32 overflow-hidden">
                    <Image
                      src={restaurant.image || "/placeholder.svg"}
                      alt={restaurant.name}
                      width={200}
                      height={100}
                      className="w-full h-32 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                        View Menu
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-medium">{restaurant.name}</h3>
                    <p className="text-sm text-muted-foreground">{restaurant.dishes} dishes</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          <div className="flex justify-center mt-6">
            <Button variant="outline" className="group" asChild>
              <Link href="/restaurants">
                View All Restaurants
                <ChevronRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </section>
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

      {/* Nutrition Details Dialog */}
      <NutritionDetails
        open={detailsDialogOpen}
        onOpenChange={setDetailsDialogOpen}
        nutritionData={{
          calories,
          protein,
          carbs,
          fat,
          fiber,
          meals: recentMeals,
        }}
      />

      {/* Save Goals Dialog */}
      <SaveGoalsDialog
        open={goalsDialogOpen}
        onOpenChange={setGoalsDialogOpen}
        currentGoals={nutritionGoals}
        onSaveGoals={handleSaveGoals}
      />

      <SearchDialog open={searchDialogOpen} onOpenChange={setSearchDialogOpen} />

      <Toaster />
    </div>
  )
}
