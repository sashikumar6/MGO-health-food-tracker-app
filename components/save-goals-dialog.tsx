"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/use-toast"

export function SaveGoalsDialog({ open, onOpenChange, currentGoals, onSaveGoals }) {
  const [goals, setGoals] = useState(currentGoals)
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    onSaveGoals({
      calorieGoal: goals.calorieGoal,
      proteinGoal: goals.proteinGoal,
      carbGoal: goals.carbGoal,
      fatGoal: goals.fatGoal,
      fiberGoal: goals.fiberGoal,
      autoCalculate: goals.autoCalculate,
      // Add any other fields that might be needed
    })

    setSaving(false)
    onOpenChange(false)

    toast({
      title: "Goals saved successfully",
      description: "Your nutrition goals have been updated.",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-lg">
        <DialogHeader>
          <DialogTitle>Update Nutrition Goals</DialogTitle>
          <DialogDescription>Set your daily nutrition targets to help you reach your health goals.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="calories">Daily Calories</Label>
              <span className="text-sm font-medium">{goals.calorieGoal} kcal</span>
            </div>
            <Slider
              id="calories"
              min={1200}
              max={4000}
              step={50}
              value={[goals.calorieGoal]}
              onValueChange={(value) => setGoals({ ...goals, calorieGoal: value[0] })}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>1,200 kcal</span>
              <span>4,000 kcal</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="protein">Protein Goal</Label>
              <span className="text-sm font-medium">{goals.proteinGoal} g</span>
            </div>
            <Slider
              id="protein"
              min={50}
              max={250}
              step={5}
              value={[goals.proteinGoal]}
              onValueChange={(value) => setGoals({ ...goals, proteinGoal: value[0] })}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="carbs">Carbohydrates Goal</Label>
              <span className="text-sm font-medium">{goals.carbGoal} g</span>
            </div>
            <Slider
              id="carbs"
              min={50}
              max={400}
              step={5}
              value={[goals.carbGoal]}
              onValueChange={(value) => setGoals({ ...goals, carbGoal: value[0] })}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="fat">Fat Goal</Label>
              <span className="text-sm font-medium">{goals.fatGoal} g</span>
            </div>
            <Slider
              id="fat"
              min={20}
              max={150}
              step={5}
              value={[goals.fatGoal]}
              onValueChange={(value) => setGoals({ ...goals, fatGoal: value[0] })}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="fiber">Fiber Goal</Label>
              <span className="text-sm font-medium">{goals.fiberGoal} g</span>
            </div>
            <Slider
              id="fiber"
              min={10}
              max={50}
              step={1}
              value={[goals.fiberGoal]}
              onValueChange={(value) => setGoals({ ...goals, fiberGoal: value[0] })}
            />
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <Switch
              id="auto-calculate"
              checked={goals.autoCalculate}
              onCheckedChange={(checked) => setGoals({ ...goals, autoCalculate: checked })}
            />
            <Label htmlFor="auto-calculate">Auto-calculate based on my activity level</Label>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-emerald-600 hover:bg-emerald-700 w-full sm:w-auto"
          >
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
