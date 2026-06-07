import RecipeCard from "@/components/RecipeCard"
import FadeIn from "@/components/FadeIn"
import { recipes } from "@/lib/data"

const filterTags = ["All", "Vegetarian", "Dinner", "Tacos", "Soup", "Seafood", "Dessert"]

export default function RecipesPage() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-16">
      <FadeIn>
        <p className="font-sans text-sm uppercase tracking-[0.2em] text-terracotta">
          The collection
        </p>
        <h1 className="mt-3 font-display text-4xl text-espresso">Recipes</h1>
        <p className="mt-3 max-w-xl font-sans text-base text-muted">
          A growing collection of dishes worth making again, from weeknight staples to
          slow Sunday projects.
        </p>
      </FadeIn>

      <FadeIn delay={100}>
        <div className="mt-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <input
            type="search"
            placeholder="Search recipes..."
            className="w-full rounded-full border border-stone bg-cream px-5 py-3 font-sans text-sm text-espresso placeholder:text-muted focus:border-terracotta focus:outline-none sm:max-w-xs"
          />
          <div className="flex flex-wrap gap-2">
            {filterTags.map((tag, index) => (
              <button
                key={tag}
                type="button"
                className={`rounded-full px-4 py-2 font-sans text-sm transition-colors ${
                  index === 0
                    ? "bg-terracotta text-cream"
                    : "border border-stone bg-cream text-espresso hover:border-terracotta hover:text-terracotta"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </FadeIn>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {recipes.map((recipe, index) => (
          <FadeIn key={recipe.id} delay={(index % 3) * 100}>
            <RecipeCard recipe={recipe} />
          </FadeIn>
        ))}
      </div>
    </main>
  )
}
