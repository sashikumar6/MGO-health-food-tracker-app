import { createClient } from "@supabase/supabase-js"

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Create a singleton instance of the Supabase client
let supabaseInstance = null

// Add this function to the supabase.ts file to ensure we're always using a demo user
export function getCurrentUser() {
  // Always return a demo user without authentication
  return {
    id: "demo-user",
    email: "demo@example.com",
    name: "Demo User",
  }
}

// Modify the getSupabaseClient function to not check for authentication
export function getSupabaseClient() {
  if (supabaseInstance) return supabaseInstance

  // Create client even if keys are missing (for demo purposes)
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("Supabase URL or Anon Key is missing. Using mock database operations.")
    // Return a mock client that doesn't actually connect to Supabase
    return {
      from: () => ({
        select: () => ({
          eq: () => ({
            single: () => Promise.resolve({ data: getMockUserData() }),
            order: () => ({
              limit: () => Promise.resolve({ data: getMockMealsData() }),
            }),
          }),
          gte: () => ({
            order: () => Promise.resolve({ data: getMockMealsData() }),
          }),
        }),
        insert: () => Promise.resolve({ data: {}, error: null }),
        update: () => Promise.resolve({ data: {}, error: null }),
      }),
    }
  }

  try {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey)
    return supabaseInstance
  } catch (error) {
    console.error("Failed to initialize Supabase client:", error)
    return null
  }
}

// Add mock data functions
function getMockUserData() {
  return {
    id: "demo-user",
    user_id: "demo-user",
    calorie_goal: 2000,
    protein_goal: 120,
    carb_goal: 250,
    fat_goal: 65,
    fiber_goal: 30,
    water_goal: 2.5,
    auto_calculate: false,
    activity_level: "moderate",
    weight: 70,
    height: 170,
    age: 30,
    gender: "female",
  }
}

function getMockMealsData() {
  return [
    {
      id: 1,
      user_id: "demo-user",
      name: "Breakfast Sandwich",
      restaurant: "Starbucks",
      calories: 420,
      protein: 18,
      carbs: 40,
      fat: 22,
      fiber: 2,
      created_at: new Date().toISOString(),
    },
    {
      id: 2,
      user_id: "demo-user",
      name: "Chicken Caesar Salad",
      restaurant: "Sweetgreen",
      calories: 450,
      protein: 30,
      carbs: 20,
      fat: 25,
      fiber: 5,
      created_at: new Date().toISOString(),
    },
  ]
}

// Helper function to save a meal to Supabase
export async function saveMealToSupabase(meal) {
  const supabase = getSupabaseClient()
  if (!supabase) {
    console.warn("Supabase client not available. Meal will not be saved to database.")
    return { error: { message: "Database connection not available" } }
  }

  try {
    // In a real app, you would get the user ID from authentication
    const userId = "demo-user"

    // Validate meal data before sending to Supabase
    const mealData = {
      user_id: userId,
      name: meal.name || "Unnamed Meal",
      restaurant: meal.restaurant || null,
      calories: meal.calories || 0,
      protein: meal.protein || null,
      carbs: meal.carbs || null,
      fat: meal.fat || null,
      fiber: meal.fiber || null,
    }

    const { data, error } = await supabase.from("user_meals").insert(mealData)

    if (error) {
      console.error("Error saving meal to Supabase:", error.message)
      return { error }
    }

    return { data }
  } catch (error) {
    console.error("Exception in saveMealToSupabase:", error)
    return { error }
  }
}

// Helper function to save goals to Supabase
export async function saveGoalsToSupabase(goals) {
  const supabase = getSupabaseClient()
  if (!supabase) {
    console.warn("Supabase client not available. Goals will not be saved to database.")
    return { error: { message: "Database connection not available" } }
  }

  try {
    // In a real app, you would get the user ID from authentication
    const userId = "demo-user"

    // First check if the user already exists
    const { data: existingUser } = await supabase.from("user_goals").select("id").eq("user_id", userId).single()

    let result

    if (existingUser) {
      // Update existing record
      result = await supabase
        .from("user_goals")
        .update({
          calorie_goal: goals.calorieGoal || 2000,
          protein_goal: goals.proteinGoal || 120,
          carb_goal: goals.carbGoal || 250,
          fat_goal: goals.fatGoal || 65,
          fiber_goal: goals.fiberGoal || 30,
          water_goal: goals.waterGoal || 2.5,
          auto_calculate: goals.autoCalculate || false,
          activity_level: goals.activityLevel || "moderate",
          weight: goals.weight || 70,
          height: goals.height || 170,
          age: goals.age || 30,
          gender: goals.gender || "female",
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", userId)
    } else {
      // Insert new record
      result = await supabase.from("user_goals").insert({
        user_id: userId,
        calorie_goal: goals.calorieGoal || 2000,
        protein_goal: goals.proteinGoal || 120,
        carb_goal: goals.carbGoal || 250,
        fat_goal: goals.fatGoal || 65,
        fiber_goal: goals.fiberGoal || 30,
        water_goal: goals.waterGoal || 2.5,
        auto_calculate: goals.autoCalculate || false,
        activity_level: goals.activityLevel || "moderate",
        weight: goals.weight || 70,
        height: goals.height || 170,
        age: goals.age || 30,
        gender: goals.gender || "female",
      })
    }

    const { error } = result

    if (error) {
      console.error("Error saving goals to Supabase:", error.message)
      return { error }
    }

    return { data: result.data }
  } catch (error) {
    console.error("Exception in saveGoalsToSupabase:", error)
    return { error }
  }
}

// Helper function to load user goals from Supabase
export async function loadUserGoals() {
  const supabase = getSupabaseClient()
  if (!supabase) {
    console.warn("Supabase client not available. Unable to load user goals.")
    return { error: { message: "Database connection not available" } }
  }

  try {
    const userId = "demo-user"
    const { data, error } = await supabase.from("user_goals").select("*").eq("user_id", userId).single()

    if (error) {
      console.error("Error loading user goals:", error.message)
      return { error }
    }

    return { data }
  } catch (error) {
    console.error("Exception in loadUserGoals:", error)
    return { error }
  }
}

// Helper function to load user meals from Supabase
export async function loadUserMeals(limit = 10) {
  const supabase = getSupabaseClient()
  if (!supabase) {
    console.warn("Supabase client not available. Unable to load user meals.")
    return { error: { message: "Database connection not available" } }
  }

  try {
    const userId = "demo-user"
    const { data, error } = await supabase
      .from("user_meals")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit)

    if (error) {
      console.error("Error loading user meals:", error.message)
      return { error }
    }

    return { data }
  } catch (error) {
    console.error("Exception in loadUserMeals:", error)
    return { error }
  }
}

// Helper function to get daily nutrition totals
export async function getDailyNutritionTotals() {
  const supabase = getSupabaseClient()
  if (!supabase) {
    console.warn("Supabase client not available. Unable to load nutrition totals.")
    return { error: { message: "Database connection not available" } }
  }

  try {
    const userId = "demo-user"
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const { data, error } = await supabase
      .from("user_meals")
      .select("*")
      .eq("user_id", userId)
      .gte("created_at", today.toISOString())
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error loading daily nutrition:", error.message)
      return { error }
    }

    // Calculate totals
    const totals = {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
      meals: data || [],
    }

    if (data && data.length > 0) {
      data.forEach((meal) => {
        totals.calories += meal.calories || 0
        totals.protein += meal.protein || 0
        totals.carbs += meal.carbs || 0
        totals.fat += meal.fat || 0
        totals.fiber += meal.fiber || 0
      })
    }

    return { data: totals }
  } catch (error) {
    console.error("Exception in getDailyNutritionTotals:", error)
    return { error }
  }
}
