"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Search, Salad, Save } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { TrackMealDialog } from "@/components/track-meal-dialog"
import { loadUserGoals, saveGoalsToSupabase } from "@/lib/supabase"

export default function GoalsPage() {
  // State for goals
  const [calorieGoal, setCalorieGoal] = useState(2000)
  const [proteinGoal, setProteinGoal] = useState(120)
  const [carbGoal, setCarbGoal] = useState(250)
  const [fatGoal, setFatGoal] = useState(65)
  const [fiberGoal, setFiberGoal] = useState(30)
  const [waterGoal, setWaterGoal] = useState(2.5)
  const [autoCalculate, setAutoCalculate] = useState(false)
  const [activityLevel, setActivityLevel] = useState("moderate")
  const [weight, setWeight] = useState(70) // in kg
  const [height, setHeight] = useState(170) // in cm
  const [age, setAge] = useState(30)
  const [gender, setGender] = useState("female")
  const [isSaving, setIsSaving] = useState(false)

  // Load goals from Supabase on component mount
  useEffect(() => {
    async function fetchGoals() {
      const { data, error } = await loadUserGoals()

      if (error) {
        toast({
          title: "Error loading goals",
          description: "Could not load your nutrition goals. Using default values.",
          variant: "destructive",
        })
        return
      }

      if (data) {
        setCalorieGoal(data.calorie_goal || 2000)
        setProteinGoal(data.protein_goal || 120)
        setCarbGoal(data.carb_goal || 250)
        setFatGoal(data.fat_goal || 65)
        setFiberGoal(data.fiber_goal || 30)
        setWaterGoal(data.water_goal || 2.5)
        setAutoCalculate(data.auto_calculate || false)
        setActivityLevel(data.activity_level || "moderate")
        setWeight(data.weight || 70)
        setHeight(data.height || 170)
        setAge(data.age || 30)
        setGender(data.gender || "female")
      }
    }

    fetchGoals()
  }, [])

  // Calculate BMR (Basal Metabolic Rate) using Mifflin-St Jeor Equation
  const calculateBMR = () => {
    if (gender === "male") {
      return 10 * weight + 6.25 * height - 5 * age + 5
    } else {
      return 10 * weight + 6.25 * height - 5 * age - 161
    }
  }

  // Calculate TDEE (Total Daily Energy Expenditure)
  const calculateTDEE = () => {
    const bmr = calculateBMR()
    const activityMultipliers = {
      sedentary: 1.2, // Little or no exercise
      light: 1.375, // Light exercise 1-3 days/week
      moderate: 1.55, // Moderate exercise 3-5 days/week
      active: 1.725, // Hard exercise 6-7 days/week
      veryActive: 1.9, // Very hard exercise & physical job
    }
    return Math.round(bmr * activityMultipliers[activityLevel])
  }

  // Auto-calculate goals based on activity level and personal stats
  useEffect(() => {
    if (autoCalculate) {
      const tdee = calculateTDEE()
      setCalorieGoal(tdee)

      // Calculate macros based on standard ratios
      // Protein: 30%, Carbs: 45%, Fat: 25%
      setProteinGoal(Math.round((tdee * 0.3) / 4)) // 4 calories per gram of protein
      setCarbGoal(Math.round((tdee * 0.45) / 4)) // 4 calories per gram of carbs
      setFatGoal(Math.round((tdee * 0.25) / 9)) // 9 calories per gram of fat

      // Fiber recommendation based on calorie intake
      setFiberGoal(Math.round(tdee / 1000) * 14) // ~14g per 1000 calories
    }
  }, [autoCalculate, activityLevel, weight, height, age, gender])

  // Handle saving goals
  const handleSaveGoals = async () => {
    setIsSaving(true)

    const goals = {
      calorieGoal: calorieGoal,
      proteinGoal: proteinGoal,
      carbGoal: carbGoal,
      fatGoal: fatGoal,
      fiberGoal: fiberGoal,
      waterGoal: waterGoal,
      autoCalculate: autoCalculate,
      activityLevel: activityLevel,
      weight: weight,
      height: height,
      age: age,
      gender: gender,
    }

    const { error } = await saveGoalsToSupabase(goals)

    if (error) {
      toast({
        title: "Error saving goals",
        description: "There was a problem saving your goals. Please try again.",
        variant: "destructive",
      })
    } else {
      toast({
        title: "Goals saved successfully",
        description: "Your nutrition goals have been updated.",
      })
    }

    setIsSaving(false)
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
              className="text-sm font-medium text-foreground relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-emerald-500"
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
              <h1 className="text-3xl font-bold">My Nutrition Goals</h1>
              <p className="text-muted-foreground">Set and track your daily nutrition targets</p>
            </div>
            <Button
              className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-700 transition-all"
              onClick={handleSaveGoals}
              disabled={isSaving}
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>

          <Tabs defaultValue="daily" className="mt-8">
            <TabsList>
              <TabsTrigger value="daily">Daily Goals</TabsTrigger>
              <TabsTrigger value="weekly">Weekly Goals</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
            </TabsList>
            <TabsContent value="daily" className="mt-6 space-y-6">
              <Card className="overflow-hidden border-2 border-emerald-100 shadow-md hover:shadow-lg transition-all">
                <CardHeader className="bg-gradient-to-r from-emerald-50 to-transparent">
                  <CardTitle>Calorie Target</CardTitle>
                  <CardDescription>Set your daily calorie intake goal</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="calories">Daily Calories</Label>
                      <span className="text-sm font-medium">{calorieGoal.toLocaleString()} kcal</span>
                    </div>
                    <Slider
                      id="calories"
                      value={[calorieGoal]}
                      max={4000}
                      min={1200}
                      step={50}
                      className="w-full"
                      onValueChange={(value) => setCalorieGoal(value[0])}
                      disabled={autoCalculate}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>1,200 kcal</span>
                      <span>4,000 kcal</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="auto-calculate" checked={autoCalculate} onCheckedChange={setAutoCalculate} />
                    <Label htmlFor="auto-calculate">Auto-calculate based on my activity level</Label>
                  </div>

                  {autoCalculate && (
                    <div className="mt-4 space-y-4 p-4 rounded-lg bg-muted/50 border border-muted animate-in fade-in-50">
                      <div>
                        <Label htmlFor="activity-level">Activity Level</Label>
                        <select
                          id="activity-level"
                          className="w-full mt-1 p-2 rounded-md border border-input bg-background"
                          value={activityLevel}
                          onChange={(e) => setActivityLevel(e.target.value)}
                        >
                          <option value="sedentary">Sedentary (little or no exercise)</option>
                          <option value="light">Light (exercise 1-3 days/week)</option>
                          <option value="moderate">Moderate (exercise 3-5 days/week)</option>
                          <option value="active">Active (exercise 6-7 days/week)</option>
                          <option value="veryActive">Very Active (hard exercise & physical job)</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="weight">Weight (kg)</Label>
                          <Input
                            id="weight"
                            type="number"
                            value={weight}
                            onChange={(e) => setWeight(Number(e.target.value))}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="height">Height (cm)</Label>
                          <Input
                            id="height"
                            type="number"
                            value={height}
                            onChange={(e) => setHeight(Number(e.target.value))}
                            className="mt-1"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="age">Age</Label>
                          <Input
                            id="age"
                            type="number"
                            value={age}
                            onChange={(e) => setAge(Number(e.target.value))}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="gender">Gender</Label>
                          <select
                            id="gender"
                            className="w-full mt-1 p-2 rounded-md border border-input bg-background"
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                          >
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                          </select>
                        </div>
                      </div>

                      <div className="text-sm text-muted-foreground">
                        Based on your stats, your estimated daily calorie need is{" "}
                        <span className="font-medium">{calorieGoal} kcal</span>.
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="overflow-hidden border-2 border-emerald-100 shadow-md hover:shadow-lg transition-all">
                <CardHeader className="bg-gradient-to-r from-emerald-50 to-transparent">
                  <CardTitle>Macronutrient Targets</CardTitle>
                  <CardDescription>Set your daily protein, carbs, and fat goals</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="protein">Protein</Label>
                      <span className="text-sm font-medium">
                        {proteinGoal} g ({Math.round(((proteinGoal * 4) / calorieGoal) * 100)}%)
                      </span>
                    </div>
                    <Slider
                      id="protein"
                      value={[proteinGoal]}
                      max={250}
                      min={50}
                      step={5}
                      className="w-full"
                      onValueChange={(value) => setProteinGoal(value[0])}
                      disabled={autoCalculate}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="carbs">Carbohydrates</Label>
                      <span className="text-sm font-medium">
                        {carbGoal} g ({Math.round(((carbGoal * 4) / calorieGoal) * 100)}%)
                      </span>
                    </div>
                    <Slider
                      id="carbs"
                      value={[carbGoal]}
                      max={400}
                      min={50}
                      step={5}
                      className="w-full"
                      onValueChange={(value) => setCarbGoal(value[0])}
                      disabled={autoCalculate}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="fat">Fat</Label>
                      <span className="text-sm font-medium">
                        {fatGoal} g ({Math.round(((fatGoal * 9) / calorieGoal) * 100)}%)
                      </span>
                    </div>
                    <Slider
                      id="fat"
                      value={[fatGoal]}
                      max={150}
                      min={20}
                      step={5}
                      className="w-full"
                      onValueChange={(value) => setFatGoal(value[0])}
                      disabled={autoCalculate}
                    />
                  </div>

                  <div className="pt-4">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-medium">Macronutrient Ratio</span>
                    </div>
                    <div className="h-4 overflow-hidden rounded-full bg-muted">
                      <div className="flex h-full">
                        <div
                          className="bg-blue-500 transition-all duration-300"
                          style={{ width: `${Math.round(((proteinGoal * 4) / calorieGoal) * 100)}%` }}
                        />
                        <div
                          className="bg-emerald-500 transition-all duration-300"
                          style={{ width: `${Math.round(((carbGoal * 4) / calorieGoal) * 100)}%` }}
                        />
                        <div
                          className="bg-amber-500 transition-all duration-300"
                          style={{ width: `${Math.round(((fatGoal * 9) / calorieGoal) * 100)}%` }}
                        />
                      </div>
                    </div>
                    <div className="mt-2 flex text-xs">
                      <div className="flex items-center">
                        <div className="mr-1 h-2 w-2 rounded-full bg-blue-500" />
                        <span>Protein</span>
                      </div>
                      <div className="ml-4 flex items-center">
                        <div className="mr-1 h-2 w-2 rounded-full bg-emerald-500" />
                        <span>Carbs</span>
                      </div>
                      <div className="ml-4 flex items-center">
                        <div className="mr-1 h-2 w-2 rounded-full bg-amber-500" />
                        <span>Fat</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="overflow-hidden border-2 border-emerald-100 shadow-md hover:shadow-lg transition-all">
                <CardHeader className="bg-gradient-to-r from-emerald-50 to-transparent">
                  <CardTitle>Fiber & Water Goals</CardTitle>
                  <CardDescription>Set your daily fiber and water intake targets</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="fiber">Fiber</Label>
                      <span className="text-sm font-medium">{fiberGoal} g</span>
                    </div>
                    <Slider
                      id="fiber"
                      value={[fiberGoal]}
                      max={50}
                      min={10}
                      step={1}
                      className="w-full"
                      onValueChange={(value) => setFiberGoal(value[0])}
                      disabled={autoCalculate}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="water">Water</Label>
                      <span className="text-sm font-medium">{waterGoal} L</span>
                    </div>
                    <Slider
                      id="water"
                      value={[waterGoal]}
                      max={5}
                      min={1}
                      step={0.1}
                      className="w-full"
                      onValueChange={(value) => setWaterGoal(value[0])}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="weekly" className="mt-6">
              <Card className="overflow-hidden border-2 border-emerald-100 shadow-md hover:shadow-lg transition-all">
                <CardHeader className="bg-gradient-to-r from-emerald-50 to-transparent">
                  <CardTitle>Weekly Targets</CardTitle>
                  <CardDescription>Set your weekly nutrition and activity goals</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-center items-center h-40 text-muted-foreground">
                    Weekly goals coming soon
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preferences" className="mt-6 space-y-6">
              <Card className="overflow-hidden border-2 border-emerald-100 shadow-md hover:shadow-lg transition-all">
                <CardHeader className="bg-gradient-to-r from-emerald-50 to-transparent">
                  <CardTitle>Dietary Preferences</CardTitle>
                  <CardDescription>Set your dietary restrictions and preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Switch id="vegetarian" />
                      <Label htmlFor="vegetarian">Vegetarian</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="vegan" />
                      <Label htmlFor="vegan">Vegan</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="gluten-free" />
                      <Label htmlFor="gluten-free">Gluten-Free</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="dairy-free" />
                      <Label htmlFor="dairy-free">Dairy-Free</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="keto" />
                      <Label htmlFor="keto">Keto-Friendly</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="low-carb" />
                      <Label htmlFor="low-carb">Low-Carb</Label>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="overflow-hidden border-2 border-emerald-100 shadow-md hover:shadow-lg transition-all">
                <CardHeader className="bg-gradient-to-r from-emerald-50 to-transparent">
                  <CardTitle>Food Allergies</CardTitle>
                  <CardDescription>Add any food allergies or intolerances</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <div className="flex items-center rounded-full bg-muted px-3 py-1 text-sm">
                      Peanuts
                      <Button variant="ghost" size="icon" className="h-5 w-5 ml-1 -mr-1">
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
                          className="h-3 w-3"
                        >
                          <path d="M18 6 6 18" />
                          <path d="m6 6 12 12" />
                        </svg>
                      </Button>
                    </div>
                    <div className="flex items-center rounded-full bg-muted px-3 py-1 text-sm">
                      Shellfish
                      <Button variant="ghost" size="icon" className="h-5 w-5 ml-1 -mr-1">
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
                          className="h-3 w-3"
                        >
                          <path d="M18 6 6 18" />
                          <path d="m6 6 12 12" />
                        </svg>
                      </Button>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Input placeholder="Add allergy..." className="max-w-sm" />
                    <Button variant="outline">Add</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
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
