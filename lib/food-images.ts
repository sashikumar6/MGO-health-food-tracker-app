// Food and restaurant images
export const foodImages = {
  // Restaurant logos and images
  restaurants: {
    sweetgreen: "/images/live-well-exterior.png",
    chipotle: "/images/restaurant-bar.png",
    panera: "/images/restaurant-interior.png",
    chopt: "/images/waterfront-dining.png",
    cava: "/images/dining-table.png",
    starbucks: "/images/restaurant-patio.png",
    "pret-a-manger": "/images/garden-restaurant.png",
    "dig-inn": "/images/upscale-restaurant-blue.png",
    "just-salad": "/images/restaurant-patio.png",
  },

  // Restaurant interior/ambiance images
  restaurantInteriors: {
    elegant: "/images/restaurant-interior.png",
    modern: "/images/restaurant-bar.png",
    casual: "/images/live-well-exterior.png",
    waterfront: "/images/waterfront-dining.png",
    dining: "/images/dining-table.png",
    upscale: "/images/upscale-restaurant-blue.png",
    patio: "/images/restaurant-patio.png",
    garden: "/images/garden-restaurant.png",
  },

  // Dish images
  dishes: {
    // Breakfast
    "spinach-feta-wrap": "/images/fried-egg-dish.png",
    "egg-protein-pot": "/images/french-toast-berries.png",
    "avocado-sandwich": "/images/yogurt-berries.png",
    "french-toast": "/images/french-toast-berries.png",
    "fried-egg": "/images/fried-egg-dish.png",
    "yogurt-bowl": "/images/yogurt-berries.png",
    "oatmeal-bowl": "/images/oatmeal-banana-berries.png",

    // Lunch
    "harvest-bowl": "/images/healthy-dishes.png",
    "burrito-bowl": "/images/grilled-chicken-pieces.png",
    "mexican-caesar": "/images/salmon-salad.png",

    // Dinner
    "market-plate": "/images/grilled-chicken-plate.png",
    "mediterranean-bowl": "/images/grilled-chicken-pieces.png",
    "kale-caesar": "/images/salmon-salad.png",

    // Generic
    "chicken-salad": "/images/salmon-salad.png",
    "protein-bowl": "/images/healthy-dishes.png",
    "veggie-wrap": "/images/healthy-dishes.png",
    "breakfast-sandwich": "/images/french-toast-berries.png",
    "protein-smoothie": "/images/yogurt-berries.png",
    "grilled-chicken": "/images/grilled-chicken-plate.png",
    "grilled-chicken-pieces": "/images/grilled-chicken-pieces.png",
  },

  // Meal type icons
  icons: {
    breakfast: "/placeholder.svg?height=40&width=40&text=🍳",
    lunch: "/placeholder.svg?height=40&width=40&text=🥗",
    dinner: "/placeholder.svg?height=40&width=40&text=🍽️",
    snack: "/placeholder.svg?height=40&width=40&text=🍎",
  },
}

// Function to get image URL with fallback
export function getImageUrl(type: "restaurants" | "dishes" | "icons" | "restaurantInteriors", key: string): string {
  if (type === "restaurants") {
    return foodImages.restaurants[key.toLowerCase()] || "/placeholder.svg?height=200&width=300&text=Restaurant"
  } else if (type === "dishes") {
    return foodImages.dishes[key.toLowerCase()] || "/placeholder.svg?height=200&width=300&text=Dish"
  } else if (type === "restaurantInteriors") {
    return foodImages.restaurantInteriors[key.toLowerCase()] || "/placeholder.svg?height=200&width=300&text=Interior"
  } else {
    return foodImages.icons[key.toLowerCase()] || "/placeholder.svg?height=40&width=40&text=🍽️"
  }
}
