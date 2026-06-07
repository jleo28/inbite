export interface Recipe {
  id: string
  name: string
  description: string
  tags: string[]
  servings: number
  ingredients: { amount: string; item: string }[]
  steps: string[]
  imageGradient: string
}

export interface Meal {
  id: string
  name: string
  recipeIds: string[]
  totalServings: number
}

export interface Guest {
  name: string
  rsvp: "accepted" | "declined" | "pending"
  allergies: string[]
}

export interface Event {
  id: string
  name: string
  date: string
  host: string
  status: "upcoming" | "pending-rsvp"
  mealId: string
  guests: Guest[]
}

export const currentUser = {
  name: "Joe L.",
  initials: "JL",
}

export const recipes: Recipe[] = [
  {
    id: "roasted-tomato-pasta",
    name: "Roasted Tomato Pasta",
    description:
      "Cherry tomatoes blistered until jammy, tossed with garlic, basil, and a generous hand of parmesan. Comfort in a bowl.",
    tags: ["Vegetarian", "Pasta", "30 min"],
    servings: 4,
    ingredients: [
      { amount: "1 lb", item: "rigatoni or penne" },
      { amount: "2 pints", item: "cherry tomatoes" },
      { amount: "5 cloves", item: "garlic, smashed" },
      { amount: "1/4 cup", item: "olive oil" },
      { amount: "1/2 cup", item: "fresh basil, torn" },
      { amount: "1 cup", item: "grated parmesan" },
      { amount: "1 tsp", item: "red pepper flakes" },
      { amount: "to taste", item: "salt and black pepper" },
    ],
    steps: [
      "Preheat the oven to 425°F. Toss cherry tomatoes and garlic with olive oil, salt, and pepper on a sheet pan.",
      "Roast for 20 minutes, until the tomatoes blister and release their juices.",
      "Meanwhile, cook pasta in salted water until al dente. Reserve a cup of pasta water before draining.",
      "Crush the roasted tomatoes with a fork and toss with the pasta, adding pasta water to loosen the sauce.",
      "Stir in basil and parmesan, finish with red pepper flakes, and serve warm.",
    ],
    imageGradient: "from-terracotta/70 via-terracotta/40 to-stone",
  },
  {
    id: "lemon-herb-roast-chicken",
    name: "Lemon Herb Roast Chicken",
    description:
      "A whole chicken rubbed with garlic, thyme, and lemon, roasted until the skin turns deep golden and crackling.",
    tags: ["Dinner", "Roast", "1 hr 30 min"],
    servings: 6,
    ingredients: [
      { amount: "1", item: "whole chicken, about 4 lbs" },
      { amount: "2", item: "lemons, halved" },
      { amount: "1 head", item: "garlic, halved crosswise" },
      { amount: "4 sprigs", item: "fresh thyme" },
      { amount: "3 tbsp", item: "butter, softened" },
      { amount: "2 tbsp", item: "olive oil" },
      { amount: "1 tbsp", item: "kosher salt" },
      { amount: "1 tsp", item: "cracked black pepper" },
    ],
    steps: [
      "Preheat the oven to 425°F. Pat the chicken dry and season the cavity with salt and pepper.",
      "Stuff the cavity with a lemon half, the garlic head, and thyme sprigs.",
      "Rub the skin with butter and olive oil, then season generously with salt and pepper.",
      "Roast for about 1 hour 20 minutes, until the juices run clear and the skin is deeply golden.",
      "Rest for 15 minutes before carving, then squeeze the remaining lemon over the top.",
    ],
    imageGradient: "from-sage/60 via-stone to-cream",
  },
  {
    id: "smoky-black-bean-tacos",
    name: "Smoky Black Bean Tacos",
    description:
      "Charred corn, smoky black beans, and a bright cabbage slaw piled into warm tortillas. Quick, cheerful, and easy to share.",
    tags: ["Vegetarian", "Tacos", "25 min"],
    servings: 4,
    ingredients: [
      { amount: "2 cans", item: "black beans, drained and rinsed" },
      { amount: "1 cup", item: "corn kernels, fresh or frozen" },
      { amount: "1 tsp", item: "smoked paprika" },
      { amount: "1 tsp", item: "ground cumin" },
      { amount: "2 cups", item: "shredded purple cabbage" },
      { amount: "1", item: "lime, juiced" },
      { amount: "8", item: "small corn tortillas" },
      { amount: "1/2 cup", item: "crumbled queso fresco" },
      { amount: "to taste", item: "salt" },
    ],
    steps: [
      "Char the corn in a dry skillet over high heat until lightly blackened, then set aside.",
      "In the same skillet, warm the black beans with smoked paprika, cumin, and a splash of water until heated through.",
      "Toss the cabbage with lime juice and a pinch of salt to make a quick slaw.",
      "Warm the tortillas, then fill each with beans, charred corn, and slaw.",
      "Top with queso fresco and serve with extra lime on the side.",
    ],
    imageGradient: "from-terracotta/50 via-sage/30 to-cream",
  },
  {
    id: "mushroom-barley-soup",
    name: "Mushroom Barley Soup",
    description:
      "A deep, earthy soup of cremini mushrooms, pearl barley, and fresh thyme, simmered low and slow until rich and warming.",
    tags: ["Soup", "Vegetarian", "1 hr"],
    servings: 6,
    ingredients: [
      { amount: "1 lb", item: "cremini mushrooms, sliced" },
      { amount: "1", item: "yellow onion, diced" },
      { amount: "2", item: "carrots, diced" },
      { amount: "2", item: "celery stalks, diced" },
      { amount: "3/4 cup", item: "pearl barley" },
      { amount: "8 cups", item: "vegetable stock" },
      { amount: "3 sprigs", item: "fresh thyme" },
      { amount: "2 tbsp", item: "olive oil" },
      { amount: "to taste", item: "salt and black pepper" },
    ],
    steps: [
      "Heat olive oil in a large pot and saute the onion, carrots, and celery until softened, about 8 minutes.",
      "Add the mushrooms and cook until they release their liquid and begin to brown.",
      "Stir in the barley, vegetable stock, and thyme, then bring to a simmer.",
      "Cover and cook for 40 minutes, stirring occasionally, until the barley is tender.",
      "Season to taste with salt and pepper before serving hot.",
    ],
    imageGradient: "from-espresso/40 via-stone to-sage/30",
  },
  {
    id: "honey-glazed-salmon",
    name: "Honey Glazed Salmon",
    description:
      "Salmon fillets brushed with a honey soy glaze and broiled until caramelized at the edges. Bright, fast, and feels like a treat.",
    tags: ["Seafood", "Dinner", "20 min"],
    servings: 4,
    ingredients: [
      { amount: "4", item: "salmon fillets, skin on" },
      { amount: "3 tbsp", item: "honey" },
      { amount: "2 tbsp", item: "soy sauce" },
      { amount: "1 tbsp", item: "rice vinegar" },
      { amount: "2 cloves", item: "garlic, minced" },
      { amount: "1 tsp", item: "grated fresh ginger" },
      { amount: "1 tsp", item: "sesame seeds" },
      { amount: "2", item: "scallions, sliced" },
    ],
    steps: [
      "Whisk together honey, soy sauce, rice vinegar, garlic, and ginger to make the glaze.",
      "Place salmon fillets skin side down on a lined baking sheet and brush generously with the glaze.",
      "Broil for 8 to 10 minutes, brushing once more halfway through, until caramelized and just cooked through.",
      "Sprinkle with sesame seeds and scallions before serving.",
    ],
    imageGradient: "from-terracotta/60 via-terracotta/30 to-cream",
  },
  {
    id: "spiced-apple-galette",
    name: "Spiced Apple Galette",
    description:
      "A free form pastry filled with cinnamon spiced apples, folded rustic and golden. Best served warm with a scoop of vanilla.",
    tags: ["Dessert", "Baking", "1 hr 15 min"],
    servings: 8,
    ingredients: [
      { amount: "1", item: "all butter pie dough, chilled" },
      { amount: "4", item: "apples, thinly sliced" },
      { amount: "1/3 cup", item: "brown sugar" },
      { amount: "1 tsp", item: "ground cinnamon" },
      { amount: "1/4 tsp", item: "ground nutmeg" },
      { amount: "1 tbsp", item: "lemon juice" },
      { amount: "2 tbsp", item: "butter, cut into small pieces" },
      { amount: "1", item: "egg, beaten, for the crust" },
      { amount: "1 tbsp", item: "turbinado sugar" },
    ],
    steps: [
      "Preheat the oven to 400°F and roll the chilled dough into a rough circle on a lined baking sheet.",
      "Toss the apple slices with brown sugar, cinnamon, nutmeg, and lemon juice.",
      "Arrange the apples in the center of the dough, leaving a two inch border, and dot with butter.",
      "Fold the edges of the dough over the apples, pleating as you go, then brush with egg and sprinkle with turbinado sugar.",
      "Bake for 45 to 50 minutes, until the crust is deep golden and the apples are tender.",
    ],
    imageGradient: "from-terracotta/40 via-stone to-espresso/20",
  },
]

export const meals: Meal[] = [
  {
    id: "sunday-dinner-spread",
    name: "Sunday Dinner Spread",
    recipeIds: ["lemon-herb-roast-chicken", "mushroom-barley-soup", "spiced-apple-galette"],
    totalServings: 8,
  },
  {
    id: "weeknight-taco-night",
    name: "Weeknight Taco Night",
    recipeIds: ["smoky-black-bean-tacos", "roasted-tomato-pasta"],
    totalServings: 6,
  },
]

export const events: Event[] = [
  {
    id: "sunday-dinner",
    name: "Sunday Dinner",
    date: "Sunday, June 15",
    host: "Joe L.",
    status: "upcoming",
    mealId: "sunday-dinner-spread",
    guests: [
      { name: "Maya R.", rsvp: "accepted", allergies: ["gluten"] },
      { name: "Theo B.", rsvp: "accepted", allergies: [] },
      { name: "Priya N.", rsvp: "pending", allergies: ["dairy", "tree nuts"] },
    ],
  },
  {
    id: "taco-night-hangout",
    name: "Taco Night Hangout",
    date: "Friday, June 20",
    host: "Joe L.",
    status: "pending-rsvp",
    mealId: "weeknight-taco-night",
    guests: [
      { name: "Sam K.", rsvp: "pending", allergies: [] },
      { name: "Lena G.", rsvp: "declined", allergies: ["shellfish"] },
      { name: "Maya R.", rsvp: "pending", allergies: ["gluten"] },
      { name: "Theo B.", rsvp: "accepted", allergies: [] },
    ],
  },
]
