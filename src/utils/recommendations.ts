import type { OnboardingData, Recommendation, CategoryScore } from '../types';
import { calcTransportScore, calcEnergyScore, calcFoodScore, calcShoppingScore, calcWasteScore } from './carbonCalc';

// ─── Recommendation Pool ──────────────────────────────────────────────────────

const ALL_RECOMMENDATIONS: Recommendation[] = [
  // Transport
  {
    id: 'switch_to_bus',
    title: 'Switch to Public Transport',
    description: 'Replace 2 car trips per week with bus or train. This single change can massively cut your transport emissions.',
    category: 'transport',
    co2SavedKgPerYear: 420,
    difficulty: 2,
    impact: 'very_high',
    weeklyGoal: 'Take the bus/train on 2 days this week',
    icon: '🚌',
  },
  {
    id: 'walk_short_trips',
    title: 'Walk Short Distances',
    description: 'For trips under 2km, choose walking instead of driving. It\'s zero-emission and good for your health.',
    category: 'transport',
    co2SavedKgPerYear: 180,
    difficulty: 1,
    impact: 'medium',
    weeklyGoal: 'Walk to at least 3 nearby destinations',
    icon: '🚶',
  },
  {
    id: 'cycle_commute',
    title: 'Try Cycling to Work',
    description: 'Even once a week replaces a car trip with a zero-emission journey while improving fitness.',
    category: 'transport',
    co2SavedKgPerYear: 250,
    difficulty: 3,
    impact: 'high',
    weeklyGoal: 'Cycle instead of driving on 1 day this week',
    icon: '🚴',
  },
  {
    id: 'carpool',
    title: 'Start Carpooling',
    description: 'Share your commute with a colleague or neighbor. Splitting one car journey halves the per-person emissions.',
    category: 'transport',
    co2SavedKgPerYear: 320,
    difficulty: 2,
    impact: 'high',
    weeklyGoal: 'Arrange a carpool for at least 2 trips this week',
    icon: '🚗',
  },
  {
    id: 'avoid_flights',
    title: 'Choose Train Over Short Flights',
    description: 'For journeys under 500km, trains emit ~90% less CO₂ than planes. Book your next trip by rail.',
    category: 'transport',
    co2SavedKgPerYear: 600,
    difficulty: 3,
    impact: 'very_high',
    weeklyGoal: 'Research train alternatives for your next trip',
    icon: '🚄',
  },

  // Energy
  {
    id: 'standby_power',
    title: 'Eliminate Standby Power',
    description: 'Unplug chargers, TVs, and appliances when not in use. Standby power accounts for up to 10% of home electricity.',
    category: 'energy',
    co2SavedKgPerYear: 85,
    difficulty: 1,
    impact: 'medium',
    weeklyGoal: 'Unplug all standby devices each night this week',
    icon: '🔌',
  },
  {
    id: 'led_lighting',
    title: 'Switch to LED Bulbs',
    description: 'LED bulbs use 75% less energy than incandescent bulbs and last 25x longer. A one-time change with lasting impact.',
    category: 'energy',
    co2SavedKgPerYear: 120,
    difficulty: 1,
    impact: 'medium',
    weeklyGoal: 'Replace at least 2 bulbs with LEDs this week',
    icon: '💡',
  },
  {
    id: 'smart_thermostat',
    title: 'Optimize Heating & Cooling',
    description: 'Reducing your thermostat by 1°C can cut heating bills by 10%. Use timers to only heat when needed.',
    category: 'energy',
    co2SavedKgPerYear: 200,
    difficulty: 2,
    impact: 'high',
    weeklyGoal: 'Set a heating schedule and reduce temp by 1°C',
    icon: '🌡️',
  },
  {
    id: 'cold_wash',
    title: 'Wash Clothes at 30°C',
    description: 'Washing at 30°C instead of 60°C uses 57% less energy and is just as effective for everyday laundry.',
    category: 'energy',
    co2SavedKgPerYear: 65,
    difficulty: 1,
    impact: 'low',
    weeklyGoal: 'Do all laundry at 30°C this week',
    icon: '👕',
  },

  // Food
  {
    id: 'meat_free_day',
    title: 'One Meat-Free Day Per Week',
    description: 'Replacing one meat meal per week with plant-based alternatives can save 350kg CO₂ per year.',
    category: 'food',
    co2SavedKgPerYear: 350,
    difficulty: 1,
    impact: 'high',
    weeklyGoal: 'Eat fully plant-based every Monday',
    icon: '🥦',
  },
  {
    id: 'reduce_beef',
    title: 'Reduce Beef & Lamb',
    description: 'Beef produces 20x more CO₂ than chicken and 50x more than legumes. Swap just 2 servings per week.',
    category: 'food',
    co2SavedKgPerYear: 480,
    difficulty: 2,
    impact: 'very_high',
    weeklyGoal: 'Replace 2 beef meals with chicken or legumes',
    icon: '🫘',
  },
  {
    id: 'local_seasonal',
    title: 'Buy Local & Seasonal Produce',
    description: 'Local food requires less transport and refrigeration. Visit a farmers\' market or use a local veg box scheme.',
    category: 'food',
    co2SavedKgPerYear: 150,
    difficulty: 2,
    impact: 'medium',
    weeklyGoal: 'Buy at least 50% of this week\'s veg locally',
    icon: '🧺',
  },
  {
    id: 'reduce_food_waste',
    title: 'Cut Food Waste in Half',
    description: 'The average family wastes £800 of food yearly. Meal plan, use leftovers, and store food properly.',
    category: 'food',
    co2SavedKgPerYear: 220,
    difficulty: 2,
    impact: 'high',
    weeklyGoal: 'Plan all meals before shopping and use all leftovers',
    icon: '🍽️',
  },

  // Shopping
  {
    id: 'second_hand_first',
    title: 'Buy Second-Hand First',
    description: 'Before buying new, check charity shops, eBay, or Vinted. Manufacturing new goods accounts for 45% of carbon emissions.',
    category: 'shopping',
    co2SavedKgPerYear: 300,
    difficulty: 2,
    impact: 'high',
    weeklyGoal: 'Check second-hand sources before any new purchase this week',
    icon: '♻️',
  },
  {
    id: 'slow_fashion',
    title: 'Quit Fast Fashion',
    description: 'The fashion industry produces 10% of global CO₂. Buy fewer, higher-quality items that last longer.',
    category: 'shopping',
    co2SavedKgPerYear: 400,
    difficulty: 3,
    impact: 'very_high',
    weeklyGoal: 'Review your wardrobe and create a "do not buy" list',
    icon: '👗',
  },
  {
    id: 'consolidate_deliveries',
    title: 'Consolidate Online Orders',
    description: 'Group your online shopping into weekly orders instead of multiple individual deliveries to reduce delivery emissions.',
    category: 'shopping',
    co2SavedKgPerYear: 90,
    difficulty: 1,
    impact: 'low',
    weeklyGoal: 'Limit online orders to one delivery day this week',
    icon: '📦',
  },

  // Waste
  {
    id: 'start_composting',
    title: 'Start Composting Food Scraps',
    description: 'Composting diverts organic waste from landfill, where it would produce methane — a potent greenhouse gas.',
    category: 'waste',
    co2SavedKgPerYear: 130,
    difficulty: 2,
    impact: 'medium',
    weeklyGoal: 'Set up a compost bin and add all food scraps this week',
    icon: '🌱',
  },
  {
    id: 'recycle_properly',
    title: 'Recycle Correctly',
    description: 'Recycling contamination means 25% of material ends up in landfill. Learn what goes in each bin.',
    category: 'waste',
    co2SavedKgPerYear: 160,
    difficulty: 1,
    impact: 'medium',
    weeklyGoal: 'Learn your local recycling rules and sort all waste correctly',
    icon: '🗂️',
  },
  {
    id: 'reusable_bags',
    title: 'Use Reusable Bags & Containers',
    description: 'Replace single-use plastic bags, bottles, and coffee cups with reusable alternatives.',
    category: 'waste',
    co2SavedKgPerYear: 45,
    difficulty: 1,
    impact: 'low',
    weeklyGoal: 'Bring reusable bags to every shop trip this week',
    icon: '🛍️',
  },
];

// ─── Recommendation Engine ────────────────────────────────────────────────────

export function generateRecommendations(data: Partial<OnboardingData>): Recommendation[] {
  const scores = {
    transport: calcTransportScore(data),
    energy: calcEnergyScore(data),
    food: calcFoodScore(data),
    shopping: calcShoppingScore(data),
    waste: calcWasteScore(data),
  };

  // Sort categories by impact (worst first)
  const sortedCategories = (Object.keys(scores) as (keyof CategoryScore)[]).sort(
    (a, b) => scores[b] - scores[a]
  );

  // Score each recommendation: higher CO₂ saved & worse user category = higher priority
  const scored = ALL_RECOMMENDATIONS.map((rec) => {
    const categoryRank = sortedCategories.indexOf(rec.category);
    const categoryWeight = (5 - categoryRank) / 5; // 1.0 for worst category
    const co2Weight = rec.co2SavedKgPerYear / 600; // normalize to 0-1
    const difficultyPenalty = (rec.difficulty - 1) * 0.05; // slight penalty for hard tasks
    const score = categoryWeight * 0.6 + co2Weight * 0.4 - difficultyPenalty;
    return { rec, score };
  });

  // Sort by score desc, deduplicate categories (top 2 per category max)
  scored.sort((a, b) => b.score - a.score);

  const categoryCount: Record<string, number> = {};
  const selected: Recommendation[] = [];

  for (const { rec } of scored) {
    const count = categoryCount[rec.category] || 0;
    if (count < 2 && selected.length < 5) {
      selected.push({ ...rec, completed: false });
      categoryCount[rec.category] = count + 1;
    }
    if (selected.length >= 5) break;
  }

  return selected;
}
