"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts"

export function NutritionDetails({ open, onOpenChange, nutritionData }) {
  const [activeTab, setActiveTab] = useState("overview")

  // Calculate percentages for macros
  const totalCalories = nutritionData.calories
  const calorieGoal = 2000
  const caloriePercentage = Math.min(100, Math.round((totalCalories / calorieGoal) * 100))

  const proteinCalories = nutritionData.protein * 4
  const carbCalories = nutritionData.carbs * 4
  const fatCalories = nutritionData.fat * 9

  const proteinPercentage = Math.round((proteinCalories / totalCalories) * 100) || 0
  const carbPercentage = Math.round((carbCalories / totalCalories) * 100) || 0
  const fatPercentage = Math.round((fatCalories / totalCalories) * 100) || 0

  const macroData = [
    { name: "Protein", value: proteinPercentage, color: "#3b82f6" },
    { name: "Carbs", value: carbPercentage, color: "#10b981" },
    { name: "Fat", value: fatPercentage, color: "#f59e0b" },
  ]

  const nutrientData = [
    { name: "Protein", current: nutritionData.protein, goal: 120, color: "#3b82f6" },
    { name: "Carbs", current: nutritionData.carbs || 150, goal: 250, color: "#10b981" },
    { name: "Fat", current: nutritionData.fat || 53, goal: 65, color: "#f59e0b" },
    { name: "Fiber", current: nutritionData.fiber, goal: 30, color: "#8b5cf6" },
  ]

  const mealData = nutritionData.meals || []

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nutrition Details</DialogTitle>
          <DialogDescription>Detailed breakdown of your daily nutrition</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="macros">Macronutrients</TabsTrigger>
            <TabsTrigger value="meals">Meals</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Daily Progress</CardTitle>
                <CardDescription>Your nutrition progress for today</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Calories</span>
                    <span className="text-sm text-muted-foreground">
                      {totalCalories.toLocaleString()} / {calorieGoal.toLocaleString()} kcal
                    </span>
                  </div>
                  <Progress value={caloriePercentage} className="h-2 bg-muted" indicatorClassName="bg-emerald-500" />
                  <div className="text-xs text-muted-foreground text-right">{caloriePercentage}% of daily goal</div>
                </div>

                {nutrientData.map((nutrient) => (
                  <div key={nutrient.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{nutrient.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {nutrient.current} / {nutrient.goal} g
                      </span>
                    </div>
                    <Progress
                      value={Math.min(100, (nutrient.current / nutrient.goal) * 100)}
                      className="h-2 bg-muted"
                      indicatorClassName={`bg-[${nutrient.color}]`}
                    />
                    <div className="text-xs text-muted-foreground text-right">
                      {Math.round((nutrient.current / nutrient.goal) * 100)}% of daily goal
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Remaining</CardTitle>
                  <CardDescription>Nutrients left for today</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Calories</span>
                      <span className="font-medium">{Math.max(0, calorieGoal - totalCalories)} kcal</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Protein</span>
                      <span className="font-medium">{Math.max(0, 120 - nutritionData.protein)} g</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Fiber</span>
                      <span className="font-medium">{Math.max(0, 30 - nutritionData.fiber)} g</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Macro Ratio</CardTitle>
                  <CardDescription>Current macronutrient distribution</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <div className="w-32 h-32">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={macroData}
                          cx="50%"
                          cy="50%"
                          innerRadius={25}
                          outerRadius={45}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {macroData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => `${value}%`} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="ml-4 flex flex-col justify-center">
                    {macroData.map((entry) => (
                      <div key={entry.name} className="flex items-center mb-1">
                        <div className="w-3 h-3 mr-2" style={{ backgroundColor: entry.color }}></div>
                        <span className="text-xs">
                          {entry.name}: {entry.value}%
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="macros">
            <Card>
              <CardHeader>
                <CardTitle>Macronutrient Breakdown</CardTitle>
                <CardDescription>Detailed view of your macronutrient intake</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={nutrientData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar name="Current" dataKey="current" fill="#10b981" />
                      <Bar name="Goal" dataKey="goal" fill="#6b7280" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-6 space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Protein ({nutritionData.protein}g)</h4>
                    <p className="text-sm text-muted-foreground">
                      Protein is essential for muscle repair and growth. Your current intake is
                      {nutritionData.protein < 120 ? " below" : " meeting"} your daily goal.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Carbohydrates ({nutritionData.carbs || 150}g)</h4>
                    <p className="text-sm text-muted-foreground">
                      Carbs are your body's main energy source. Your current intake is
                      {(nutritionData.carbs || 150) < 250 ? " below" : " meeting"} your daily goal.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Fat ({nutritionData.fat || 53}g)</h4>
                    <p className="text-sm text-muted-foreground">
                      Healthy fats are important for hormone production and nutrient absorption. Your current intake is
                      {(nutritionData.fat || 53) < 65 ? " below" : " meeting"} your daily goal.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Fiber ({nutritionData.fiber}g)</h4>
                    <p className="text-sm text-muted-foreground">
                      Fiber supports digestive health and helps you feel full. Your current intake is
                      {nutritionData.fiber < 30 ? " below" : " meeting"} your daily goal.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="meals">
            <Card>
              <CardHeader>
                <CardTitle>Today's Meals</CardTitle>
                <CardDescription>All meals tracked today</CardDescription>
              </CardHeader>
              <CardContent>
                {mealData.length > 0 ? (
                  <div className="space-y-4">
                    {mealData.map((meal, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{meal.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {meal.restaurant} • {meal.time}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">{meal.calories} kcal</div>
                            {meal.protein && (
                              <div className="text-sm text-muted-foreground">{meal.protein}g protein</div>
                            )}
                            {meal.fiber && <div className="text-sm text-muted-foreground">{meal.fiber}g fiber</div>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No meals tracked today. Use the "Track Meal" button to add meals.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
