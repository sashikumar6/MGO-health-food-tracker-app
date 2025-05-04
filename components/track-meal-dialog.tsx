"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Loader2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { saveMealToSupabase } from "@/lib/supabase"

export function TrackMealDialog({ className, variant = "default", children, onMealAdded }) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleTrackCustomMeal = async (event) => {
    event.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(event.target)
    const meal = {
      name: formData.get("meal-name"),
      restaurant: formData.get("restaurant"),
      calories: Number.parseInt(formData.get("calories")),
      protein: Number.parseInt(formData.get("protein") || "0"),
      carbs: Number.parseInt(formData.get("carbs") || "0"),
      fat: Number.parseInt(formData.get("fat") || "0"),
      fiber: Number.parseInt(formData.get("fiber") || "0"),
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
        description: `${meal.name} (${meal.calories} cal) has been added to your daily log.`,
      })

      // Call the callback if provided
      if (onMealAdded) {
        onMealAdded(meal)
      }
    }

    setIsSubmitting(false)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button className={`${className} bg-emerald-600 hover:bg-emerald-700 transition-all`} variant={variant}>
            <Plus className="h-4 w-4 mr-2" />
            Track Meal
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleTrackCustomMeal}>
          <DialogHeader>
            <DialogTitle>Track a Meal</DialogTitle>
            <DialogDescription>Enter the details of your meal to add it to your daily log.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="meal-name" className="text-right">
                Meal
              </Label>
              <Input id="meal-name" name="meal-name" placeholder="e.g. Chicken Salad" className="col-span-3" required />
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
            <Button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 transition-all"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add to Tracker"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
