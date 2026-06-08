"use client"

import { useMemo, useState } from "react"
import RecipeCard from "@/components/RecipeCard"
import FadeIn from "@/components/FadeIn"
import type { Recipe } from "@/lib/recipes/queries"

interface RecipeBrowserProps {
  recipes: Recipe[]
}

export default function RecipeBrowser({ recipes }: RecipeBrowserProps) {
  const [search, setSearch] = useState("")
  const [activeTag, setActiveTag] = useState("All")

  const tags = useMemo(() => {
    const unique = new Set<string>()
    for (const recipe of recipes) {
      for (const tag of recipe.tags) unique.add(tag)
    }
    return ["All", ...Array.from(unique).sort()]
  }, [recipes])

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    return recipes.filter((recipe) => {
      const matchesTag = activeTag === "All" || recipe.tags.includes(activeTag)
      const matchesSearch =
        !query ||
        recipe.name.toLowerCase().includes(query) ||
        recipe.description.toLowerCase().includes(query)
      return matchesTag && matchesSearch
    })
  }, [recipes, search, activeTag])

  return (
    <>
      <FadeIn delay={100}>
        <div className="mt-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search recipes..."
            className="w-full rounded-full border border-stone bg-cream px-5 py-3 font-sans text-sm text-espresso placeholder:text-muted focus:border-terracotta focus:outline-none sm:max-w-xs"
          />
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setActiveTag(tag)}
                className={`rounded-full px-4 py-2 font-sans text-sm transition-colors ${
                  activeTag === tag
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

      {filtered.length > 0 ? (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((recipe, index) => (
            <FadeIn key={recipe.id} delay={(index % 3) * 100}>
              <RecipeCard recipe={recipe} />
            </FadeIn>
          ))}
        </div>
      ) : (
        <p className="mt-16 text-center font-sans text-sm text-muted">
          No recipes match your search yet. Try a different term or tag.
        </p>
      )}
    </>
  )
}
