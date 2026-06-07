# InBite — Phase 1 Build Plan (Frontend-Only)

## Project Overview
InBite is a warm, editorial meal planning and group event web app. Phase 1 is a fully static/seeded frontend — no real auth, no database. The goal is a polished, demoable UI that looks and feels like a real product for portfolio/recruiter purposes. Backend (Supabase + real auth) comes in Phase 2.

## Stack
- **Framework:** Next.js 14 (App Router, TypeScript)
- **Styling:** Tailwind CSS + custom CSS variables in `globals.css`
- **Fonts:** Playfair Display (display/headings) + DM Sans (body/UI)
- **Deployment:** Vercel
- **Repo:** github.com/jleo28/inbite

## Design System

### Colors (CSS variables)
```css
--cream:       #F9F5EF   /* page background */
--espresso:    #1C1612   /* primary text */
--terracotta:  #C96A3A   /* accent, CTAs */
--sage:        #8A9E84   /* secondary accent, tags */
--stone:       #E8E2D9   /* card backgrounds, borders */
--muted:       #9A9088   /* secondary text */
```

### Typography
- **Display:** Playfair Display — recipe names, page headings, hero text
- **UI/Body:** DM Sans — nav, labels, body copy, buttons, metadata

### Tone & Texture
- Warm, editorial, cookbook-meets-web-app
- Subtle grain overlay on hero sections (CSS noise texture or SVG filter)
- Generous whitespace, clean card layouts
- No em dashes anywhere in visible UI text — use commas or colons instead

### Motion
- Staggered fade-in on page load (reusable `FadeIn` component)
- Hover lift on cards (translateY + box-shadow)
- Toast notifications for non-functional CTAs ("Coming soon")

---

## Folder Structure
```
inbite/
  app/
    layout.tsx
    page.tsx                  # home
    globals.css
    login/page.tsx
    signup/page.tsx
    recipes/
      page.tsx
      [id]/page.tsx
    meals/page.tsx
    events/
      page.tsx
      [id]/page.tsx
  components/
    Nav.tsx
    Footer.tsx
    FadeIn.tsx
    Toast.tsx
    RecipeCard.tsx
    MealCard.tsx
    EventCard.tsx
    GuestList.tsx
    ShoppingListPreview.tsx
    HeroSection.tsx
  lib/
    data.ts                   # all seed data lives here
  public/
    favicon.ico
```

---

## Seed Data Shape (`lib/data.ts`)

### Recipes (6 total)
```ts
export interface Recipe {
  id: string
  name: string           // e.g. "Roasted Tomato Pasta"
  description: string    // 1-2 sentences, no em dashes
  tags: string[]         // e.g. ["Vegetarian", "Pasta", "30 min"]
  servings: number
  ingredients: { amount: string; item: string }[]
  steps: string[]
  imageGradient: string  // Tailwind gradient classes for placeholder
}
```

### Meals (2 total)
```ts
export interface Meal {
  id: string
  name: string
  recipeIds: string[]
  totalServings: number
}
```

### Events (2 total)
```ts
export interface Event {
  id: string
  name: string           // e.g. "Sunday Dinner"
  date: string           // e.g. "Sunday, June 15"
  host: string           // hardcoded "Joe L."
  status: "upcoming" | "pending-rsvp"
  mealId: string
  guests: Guest[]
}

export interface Guest {
  name: string
  rsvp: "accepted" | "declined" | "pending"
  allergies: string[]    // e.g. ["gluten", "dairy"]
}
```

### Current User (hardcoded)
```ts
export const currentUser = {
  name: "Joe L.",
  initials: "JL",
}
```

---

## Pages

### `/` (Home)
- Hero: large Playfair Display headline + subhead, grain overlay background
- Featured recipes strip: 3 horizontal RecipeCards from seed data
- Mock event invite card: "You're invited to Sunday Dinner" with Accept/Decline buttons (Toast on click)
- "Recently added" recipe teaser at bottom

### `/login`
- Warm editorial treatment, email + password fields
- "Sign in" CTA fires Toast ("Coming soon, check back soon!")
- Link to `/signup`

### `/signup`
- Name + email + password fields
- "Create account" CTA fires Toast
- Link to `/login`

### `/recipes`
- Grid of all 6 RecipeCards
- Tag filter chips (Vegetarian, Pasta, etc.) -- UI only, no real filtering needed for Phase 1
- Search bar -- UI only

### `/recipes/[id]`
- Hero image area (warm gradient placeholder)
- Recipe name in Playfair Display
- Ingredients list
- Step-by-step instructions
- "Add to Meal" CTA fires Toast

### `/meals`
- List of 2 MealCards, each showing constituent recipes + total serving count
- "Create Meal" button fires Toast

### `/events`
- List of 2 EventCards with status chips (Upcoming, Pending RSVP)

### `/events/[id]`
- Event name, date, host
- Guest list with allergy flag badges
- Shopping list preview (aggregated ingredients from meal's recipes)
- RSVP buttons (Accept/Decline) fire Toast

---

## Task List

Work through tasks in order. Do not proceed to the next task until the user confirms. Do not batch tasks. If anything is ambiguous, ask before writing code.

- [ ] **T-01** Init Next.js 14 app at root with TypeScript + Tailwind CSS (`npx create-next-app@latest . --typescript --tailwind --app --no-src-dir --import-alias "@/*"`)
- [ ] **T-02** Configure `globals.css` with full design token system (CSS variables for all colors, base typography, grain texture utility class)
- [ ] **T-03** Add Google Fonts import for Playfair Display + DM Sans in `app/layout.tsx`
- [ ] **T-04** Confirm folder structure matches spec above -- create any missing directories
- [ ] **T-05** Init Git repo, push to GitHub `jleo28/inbite`, connect to Vercel (user handles Vercel connection manually)
- [ ] **T-06** Write `lib/data.ts` -- 6 recipes with real names/ingredients/steps, 2 meals, 2 events, 4 mock guests with allergy flags, currentUser constant. No em dashes anywhere in text content.
- [ ] **T-07** Build `Nav.tsx` -- logo left ("InBite" in Playfair Display), page links center (Home, Recipes, Meals, Events), hardcoded avatar right ("Joe L." initials circle)
- [ ] **T-08** Build `Footer.tsx` -- minimal, warm, single line
- [ ] **T-09** Build `FadeIn.tsx` -- IntersectionObserver-based, same pattern as jleo.me
- [ ] **T-10** Build `Toast.tsx` -- lightweight bottom toast, auto-dismisses after 3s, used for all non-functional CTAs
- [ ] **T-11** Build `/login` page -- email + password fields, Sign in CTA (Toast), link to signup
- [ ] **T-12** Build `/signup` page -- name + email + password, Create account CTA (Toast), link to login
- [ ] **T-13** Build `HeroSection.tsx` -- large Playfair Display headline, subhead, grain overlay, warm background
- [ ] **T-14** Build `RecipeCard.tsx` -- image gradient placeholder, recipe name, tags, serving size, hover lift
- [ ] **T-15** Build home page (`app/page.tsx`) -- hero, featured recipes strip (3 cards), mock event invite card with Accept/Decline (Toast), recently added teaser
- [ ] **T-16** Build `/recipes` page -- grid of all 6 RecipeCards, tag filter chips (UI only), search bar (UI only)
- [ ] **T-17** Build `/recipes/[id]` page -- hero gradient area, Playfair Display name, ingredients list, steps, Add to Meal CTA (Toast)
- [ ] **T-18** Build `MealCard.tsx` -- meal name, recipe list, total servings, hover lift
- [ ] **T-19** Build `/meals` page -- 2 MealCards, Create Meal CTA (Toast)
- [ ] **T-20** Build `EventCard.tsx` -- event name, date, host, status chip
- [ ] **T-21** Build `GuestList.tsx` -- guest rows with RSVP status badge and allergy flag badges
- [ ] **T-22** Build `ShoppingListPreview.tsx` -- aggregated ingredient list from event's meal's recipes
- [ ] **T-23** Build `/events` page -- 2 EventCards
- [ ] **T-24** Build `/events/[id]` page -- event detail, GuestList, ShoppingListPreview, RSVP buttons (Toast)
- [ ] **T-25** Polish pass -- grain texture on all hero areas, hover animations on all cards, staggered page load fade-ins
- [ ] **T-26** Mobile responsiveness pass -- all pages, nav collapses cleanly on small screens
- [ ] **T-27** Metadata + favicon -- title "InBite, Meal Planning", description, favicon
- [ ] **T-28** Final Vercel deploy + confirm live URL

---

## Rules for Claude Code
1. Read this entire file before writing any code.
2. Complete one task at a time. Stop and wait for user confirmation before moving to the next.
3. Do not batch tasks.
4. No em dashes (`--` or `—`) anywhere in visible UI text. Use commas or colons instead.
5. All color/font decisions must follow the design system above exactly.
6. Ask before making any structural decisions not covered in this plan.
