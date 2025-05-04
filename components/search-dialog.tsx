"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, Utensils, Building2, Apple, ArrowRight } from "lucide-react"
import Link from "next/link"

export function SearchDialog({ open, onOpenChange }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const router = useRouter()

  // Sample data for search results
  const sampleData = {
    meals: [
      { id: "harvest-bowl", name: "Harvest Bowl", restaurant: "Sweetgreen", type: "meal", calories: 705 },
      { id: "mexican-caesar", name: "Mexican Caesar Salad", restaurant: "Chopt", type: "meal", calories: 520 },
      { id: "protein-bowl", name: "Protein Power Bowl", restaurant: "Chipotle", type: "meal", calories: 620 },
    ],
    restaurants: [
      { id: "sweetgreen", name: "Sweetgreen", type: "restaurant", dishes: 42 },
      { id: "chopt", name: "Chopt", type: "restaurant", dishes: 31 },
      { id: "chipotle", name: "Chipotle", type: "restaurant", dishes: 38 },
      { id: "panera", name: "Panera Bread", type: "restaurant", dishes: 56 },
    ],
    nutrients: [
      { id: "protein", name: "High Protein Meals", type: "nutrient", count: 24 },
      { id: "fiber", name: "High Fiber Meals", type: "nutrient", count: 18 },
      { id: "low-carb", name: "Low Carb Options", type: "nutrient", count: 15 },
    ],
  }

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
  }

  // Perform search when query changes
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      return
    }

    setIsSearching(true)

    // Simulate API call with setTimeout
    const searchTimeout = setTimeout(() => {
      const query = searchQuery.toLowerCase()

      // Filter meals
      const filteredMeals = sampleData.meals.filter(
        (meal) => meal.name.toLowerCase().includes(query) || meal.restaurant.toLowerCase().includes(query),
      )

      // Filter restaurants
      const filteredRestaurants = sampleData.restaurants.filter((restaurant) =>
        restaurant.name.toLowerCase().includes(query),
      )

      // Filter nutrients
      const filteredNutrients = sampleData.nutrients.filter((nutrient) => nutrient.name.toLowerCase().includes(query))

      // Combine results
      const combinedResults = [...filteredMeals, ...filteredRestaurants, ...filteredNutrients]

      setSearchResults(combinedResults)
      setIsSearching(false)
    }, 300)

    return () => clearTimeout(searchTimeout)
  }, [searchQuery])

  // Handle result click
  const handleResultClick = (result) => {
    onOpenChange(false)

    if (result.type === "restaurant") {
      router.push(`/restaurants/${result.id}`)
    } else if (result.type === "meal") {
      // In a real app, you might want to navigate to a meal detail page
      // For now, we'll just navigate to the restaurant page
      router.push(`/restaurants/${result.restaurant.toLowerCase().replace(/\s+/g, "-")}`)
    } else if (result.type === "nutrient") {
      router.push(`/suggestions?filter=${result.id}`)
    }
  }

  // Get icon based on result type
  const getResultIcon = (type) => {
    switch (type) {
      case "meal":
        return <Utensils className="h-4 w-4 text-emerald-500" />
      case "restaurant":
        return <Building2 className="h-4 w-4 text-emerald-500" />
      case "nutrient":
        return <Apple className="h-4 w-4 text-emerald-500" />
      default:
        return <Search className="h-4 w-4 text-emerald-500" />
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-lg p-0">
        <div className="flex items-center border-b p-4">
          <Search className="h-5 w-5 text-muted-foreground mr-2 flex-shrink-0" />
          <Input
            placeholder="Search meals, restaurants, or nutrients..."
            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
            value={searchQuery}
            onChange={handleSearchChange}
            autoFocus
          />
        </div>

        <ScrollArea className="max-h-[60vh] overflow-y-auto p-4">
          {isSearching ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-pulse text-muted-foreground">Searching...</div>
            </div>
          ) : searchResults.length > 0 ? (
            <div className="space-y-4">
              {searchResults.map((result) => (
                <div
                  key={`${result.type}-${result.id}`}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted cursor-pointer transition-colors"
                  onClick={() => handleResultClick(result)}
                >
                  <div className="rounded-md bg-muted p-2 flex-shrink-0">{getResultIcon(result.type)}</div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate">{result.name}</h4>
                    <p className="text-xs text-muted-foreground">
                      {result.type === "meal" && `${result.restaurant} • ${result.calories} cal`}
                      {result.type === "restaurant" && `${result.dishes} dishes available`}
                      {result.type === "nutrient" && `${result.count} options available`}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                </div>
              ))}
            </div>
          ) : searchQuery ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="text-muted-foreground mb-2">No results found for "{searchQuery}"</div>
              <p className="text-sm text-muted-foreground">Try searching for a meal, restaurant, or nutrient type</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <h3 className="font-medium mb-2">Popular Searches</h3>
                <div className="flex flex-wrap gap-2">
                  {["Protein", "Salad", "Sweetgreen", "Low Carb", "Breakfast"].map((term) => (
                    <Button
                      key={term}
                      variant="outline"
                      size="sm"
                      className="rounded-full"
                      onClick={() => setSearchQuery(term)}
                    >
                      {term}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Recent Searches</h3>
                <div className="space-y-2">
                  {["Chipotle Burrito Bowl", "Protein Smoothie", "Panera Bread"].map((term) => (
                    <div
                      key={term}
                      className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted cursor-pointer transition-colors"
                      onClick={() => setSearchQuery(term)}
                    >
                      <Search className="h-4 w-4 text-muted-foreground" />
                      <span>{term}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Suggested Restaurants</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {sampleData.restaurants.slice(0, 4).map((restaurant) => (
                    <Link
                      key={restaurant.id}
                      href={`/restaurants/${restaurant.id}`}
                      className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors"
                      onClick={() => onOpenChange(false)}
                    >
                      <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center">
                        <Building2 className="h-4 w-4 text-emerald-500" />
                      </div>
                      <span className="text-sm">{restaurant.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
