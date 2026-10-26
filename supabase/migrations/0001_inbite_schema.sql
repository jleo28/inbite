-- InBite lives in its own "inbite" schema inside the Supabase project it
-- shares with TrailFinder (one free-tier slot for both apps). Recreated from the
-- original standalone InBite project in Oct 2026.

CREATE SCHEMA IF NOT EXISTS inbite;
GRANT USAGE ON SCHEMA inbite TO anon, authenticated, service_role;

-- ─── Tables ──────────────────────────────────────────────────────────────────
CREATE TABLE inbite.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  initials text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE inbite.recipes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  description text NOT NULL,
  tags text[] NOT NULL DEFAULT '{}',
  servings integer NOT NULL CHECK (servings > 0),
  ingredients jsonb NOT NULL DEFAULT '[]'::jsonb,
  steps text[] NOT NULL DEFAULT '{}',
  image_gradient text NOT NULL,
  created_by uuid REFERENCES inbite.profiles(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  photo_url text
);

CREATE TABLE inbite.meals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  total_servings integer NOT NULL CHECK (total_servings > 0),
  created_by uuid REFERENCES inbite.profiles(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE inbite.meal_recipes (
  meal_id uuid NOT NULL REFERENCES inbite.meals(id) ON DELETE CASCADE,
  recipe_id uuid NOT NULL REFERENCES inbite.recipes(id) ON DELETE CASCADE,
  position integer NOT NULL DEFAULT 0,
  PRIMARY KEY (meal_id, recipe_id)
);

CREATE TABLE inbite.events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  event_date date NOT NULL,
  host_id uuid REFERENCES inbite.profiles(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'pending-rsvp' CHECK (status IN ('upcoming', 'pending-rsvp')),
  meal_id uuid REFERENCES inbite.meals(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE inbite.guests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES inbite.events(id) ON DELETE CASCADE,
  user_id uuid REFERENCES inbite.profiles(id) ON DELETE SET NULL,
  name text NOT NULL,
  rsvp text NOT NULL DEFAULT 'pending' CHECK (rsvp IN ('accepted', 'declined', 'pending')),
  allergies text[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT ALL ON ALL TABLES IN SCHEMA inbite TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA inbite GRANT ALL ON TABLES TO anon, authenticated, service_role;

-- ─── Functions ───────────────────────────────────────────────────────────────
CREATE FUNCTION inbite.is_event_host(p_event_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = ''
AS $$
  select exists (select 1 from inbite.events e where e.id = p_event_id and e.host_id = auth.uid());
$$;

CREATE FUNCTION inbite.is_event_participant(p_event_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = ''
AS $$
  select inbite.is_event_host(p_event_id) or exists (
    select 1 from inbite.guests g where g.event_id = p_event_id and g.user_id = auth.uid()
  );
$$;

CREATE FUNCTION inbite.respond_to_invite(p_guest_id uuid, p_rsvp text)
RETURNS inbite.guests LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
declare
  updated_guest inbite.guests;
begin
  if p_rsvp not in ('accepted', 'declined', 'pending') then
    raise exception 'Invalid RSVP status: %', p_rsvp;
  end if;
  update inbite.guests set rsvp = p_rsvp
  where id = p_guest_id and user_id = auth.uid()
  returning * into updated_guest;
  if updated_guest.id is null then
    raise exception 'Invitation not found for the current user';
  end if;
  return updated_guest;
end;
$$;

CREATE FUNCTION inbite.lookup_user_id_by_email(p_email text)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
declare
  v_id uuid;
begin
  select id into v_id from auth.users where email = lower(p_email) and deleted_at is null;
  return v_id;
end;
$$;

-- Every new account gets an InBite profile. TrailFinder's own trigger on the
-- same table gives it a TrailFinder profile; the two don't interact.
CREATE FUNCTION inbite.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
begin
  insert into inbite.profiles (id, name, initials)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data ->> 'initials', upper(left(coalesce(new.raw_user_meta_data ->> 'name', new.email), 2)))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

CREATE TRIGGER on_auth_user_created_inbite
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION inbite.handle_new_user();

-- Accounts that existed before InBite moved in get a profile too.
INSERT INTO inbite.profiles (id, name, initials)
SELECT id,
       coalesce(raw_user_meta_data ->> 'name', raw_user_meta_data ->> 'display_name', split_part(email, '@', 1)),
       upper(left(coalesce(raw_user_meta_data ->> 'name', raw_user_meta_data ->> 'display_name', email), 2))
FROM auth.users
ON CONFLICT (id) DO NOTHING;

GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA inbite TO anon, authenticated, service_role;

-- ─── Row level security (same rules as the original project) ─────────────────
ALTER TABLE inbite.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE inbite.recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE inbite.meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE inbite.meal_recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE inbite.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE inbite.guests ENABLE ROW LEVEL SECURITY;

CREATE POLICY profiles_select_authenticated ON inbite.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY profiles_update_own ON inbite.profiles FOR UPDATE TO authenticated
  USING ((select auth.uid()) = id) WITH CHECK ((select auth.uid()) = id);

CREATE POLICY recipes_select_anon ON inbite.recipes FOR SELECT TO anon USING (true);
CREATE POLICY recipes_select_authenticated ON inbite.recipes FOR SELECT TO authenticated USING (true);
CREATE POLICY recipes_insert_own ON inbite.recipes FOR INSERT TO authenticated WITH CHECK ((select auth.uid()) = created_by);
CREATE POLICY recipes_update_own ON inbite.recipes FOR UPDATE TO authenticated
  USING ((select auth.uid()) = created_by) WITH CHECK ((select auth.uid()) = created_by);
CREATE POLICY recipes_delete_own ON inbite.recipes FOR DELETE TO authenticated USING ((select auth.uid()) = created_by);

CREATE POLICY meals_select_authenticated ON inbite.meals FOR SELECT TO authenticated USING (true);
CREATE POLICY meals_insert_own ON inbite.meals FOR INSERT TO authenticated WITH CHECK ((select auth.uid()) = created_by);
CREATE POLICY meals_update_own ON inbite.meals FOR UPDATE TO authenticated
  USING ((select auth.uid()) = created_by) WITH CHECK ((select auth.uid()) = created_by);
CREATE POLICY meals_delete_own ON inbite.meals FOR DELETE TO authenticated USING ((select auth.uid()) = created_by);

CREATE POLICY meal_recipes_select_authenticated ON inbite.meal_recipes FOR SELECT TO authenticated USING (true);
CREATE POLICY meal_recipes_insert_own_meal ON inbite.meal_recipes FOR INSERT TO authenticated
  WITH CHECK (exists (select 1 from inbite.meals m where m.id = meal_recipes.meal_id and m.created_by = (select auth.uid())));
CREATE POLICY meal_recipes_update_own_meal ON inbite.meal_recipes FOR UPDATE TO authenticated
  USING (exists (select 1 from inbite.meals m where m.id = meal_recipes.meal_id and m.created_by = (select auth.uid())))
  WITH CHECK (exists (select 1 from inbite.meals m where m.id = meal_recipes.meal_id and m.created_by = (select auth.uid())));
CREATE POLICY meal_recipes_delete_own_meal ON inbite.meal_recipes FOR DELETE TO authenticated
  USING (exists (select 1 from inbite.meals m where m.id = meal_recipes.meal_id and m.created_by = (select auth.uid())));

CREATE POLICY events_select_participant ON inbite.events FOR SELECT TO authenticated USING (inbite.is_event_participant(id));
CREATE POLICY events_insert_as_host ON inbite.events FOR INSERT TO authenticated WITH CHECK ((select auth.uid()) = host_id);
CREATE POLICY events_update_own ON inbite.events FOR UPDATE TO authenticated
  USING ((select auth.uid()) = host_id) WITH CHECK ((select auth.uid()) = host_id);
CREATE POLICY events_delete_own ON inbite.events FOR DELETE TO authenticated USING ((select auth.uid()) = host_id);

CREATE POLICY guests_select_participant ON inbite.guests FOR SELECT TO authenticated USING (inbite.is_event_participant(event_id));
CREATE POLICY guests_insert_as_host ON inbite.guests FOR INSERT TO authenticated WITH CHECK (inbite.is_event_host(event_id));
CREATE POLICY guests_update_as_host ON inbite.guests FOR UPDATE TO authenticated
  USING (inbite.is_event_host(event_id)) WITH CHECK (inbite.is_event_host(event_id));
CREATE POLICY guests_delete_as_host ON inbite.guests FOR DELETE TO authenticated USING (inbite.is_event_host(event_id));

-- ─── Recipe photo storage (public read; uploads go through the server) ───────
INSERT INTO storage.buckets (id, name, public)
VALUES ('recipe-photos', 'recipe-photos', true)
ON CONFLICT (id) DO NOTHING;

-- ─── Seed recipes from the original project ──────────────────────────────────
INSERT INTO inbite.recipes (id, slug, name, description, tags, servings, ingredients, steps, image_gradient)
SELECT (r->>'id')::uuid, r->>'slug', r->>'name', r->>'description',
       ARRAY(SELECT jsonb_array_elements_text(r->'tags')),
       (r->>'servings')::int, r->'ingredients',
       ARRAY(SELECT jsonb_array_elements_text(r->'steps')),
       r->>'image_gradient'
FROM jsonb_array_elements($seed$[{"id": "6f2ac884-7165-4588-864e-037110a8318f", "slug": "roasted-tomato-pasta", "name": "Roasted Tomato Pasta", "description": "Cherry tomatoes blistered until jammy, tossed with garlic, basil, and a generous hand of parmesan. Comfort in a bowl.", "tags": ["Vegetarian", "Pasta", "30 min"], "servings": 4, "ingredients": [{"item": "rigatoni or penne", "amount": "1 lb"}, {"item": "cherry tomatoes", "amount": "2 pints"}, {"item": "garlic, smashed", "amount": "5 cloves"}, {"item": "olive oil", "amount": "1/4 cup"}, {"item": "fresh basil, torn", "amount": "1/2 cup"}, {"item": "grated parmesan", "amount": "1 cup"}, {"item": "red pepper flakes", "amount": "1 tsp"}, {"item": "salt and black pepper", "amount": "to taste"}], "steps": ["Preheat the oven to 425°F. Toss cherry tomatoes and garlic with olive oil, salt, and pepper on a sheet pan.", "Roast for 20 minutes, until the tomatoes blister and release their juices.", "Meanwhile, cook pasta in salted water until al dente. Reserve a cup of pasta water before draining.", "Crush the roasted tomatoes with a fork and toss with the pasta, adding pasta water to loosen the sauce.", "Stir in basil and parmesan, finish with red pepper flakes, and serve warm."], "image_gradient": "linear-gradient(to bottom right, rgba(201,106,58,0.7), rgba(201,106,58,0.4), #E8E2D9)"}, {"id": "9977166f-f1e8-4fa6-ae44-ae202cdb6547", "slug": "lemon-herb-roast-chicken", "name": "Lemon Herb Roast Chicken", "description": "A whole chicken rubbed with garlic, thyme, and lemon, roasted until the skin turns deep golden and crackling.", "tags": ["Dinner", "Roast", "1 hr 30 min"], "servings": 6, "ingredients": [{"item": "whole chicken, about 4 lbs", "amount": "1"}, {"item": "lemons, halved", "amount": "2"}, {"item": "garlic, halved crosswise", "amount": "1 head"}, {"item": "fresh thyme", "amount": "4 sprigs"}, {"item": "butter, softened", "amount": "3 tbsp"}, {"item": "olive oil", "amount": "2 tbsp"}, {"item": "kosher salt", "amount": "1 tbsp"}, {"item": "cracked black pepper", "amount": "1 tsp"}], "steps": ["Preheat the oven to 425°F. Pat the chicken dry and season the cavity with salt and pepper.", "Stuff the cavity with a lemon half, the garlic head, and thyme sprigs.", "Rub the skin with butter and olive oil, then season generously with salt and pepper.", "Roast for about 1 hour 20 minutes, until the juices run clear and the skin is deeply golden.", "Rest for 15 minutes before carving, then squeeze the remaining lemon over the top."], "image_gradient": "linear-gradient(to bottom right, rgba(138,158,132,0.6), #E8E2D9, #F9F5EF)"}, {"id": "eee41b96-9c82-4c59-ad5e-8c96dda0f502", "slug": "smoky-black-bean-tacos", "name": "Smoky Black Bean Tacos", "description": "Charred corn, smoky black beans, and a bright cabbage slaw piled into warm tortillas. Quick, cheerful, and easy to share.", "tags": ["Vegetarian", "Tacos", "25 min"], "servings": 4, "ingredients": [{"item": "black beans, drained and rinsed", "amount": "2 cans"}, {"item": "corn kernels, fresh or frozen", "amount": "1 cup"}, {"item": "smoked paprika", "amount": "1 tsp"}, {"item": "ground cumin", "amount": "1 tsp"}, {"item": "shredded purple cabbage", "amount": "2 cups"}, {"item": "lime, juiced", "amount": "1"}, {"item": "small corn tortillas", "amount": "8"}, {"item": "crumbled queso fresco", "amount": "1/2 cup"}, {"item": "salt", "amount": "to taste"}], "steps": ["Char the corn in a dry skillet over high heat until lightly blackened, then set aside.", "In the same skillet, warm the black beans with smoked paprika, cumin, and a splash of water until heated through.", "Toss the cabbage with lime juice and a pinch of salt to make a quick slaw.", "Warm the tortillas, then fill each with beans, charred corn, and slaw.", "Top with queso fresco and serve with extra lime on the side."], "image_gradient": "linear-gradient(to bottom right, rgba(201,106,58,0.5), rgba(138,158,132,0.3), #F9F5EF)"}, {"id": "7551da3d-569d-46ee-9e21-1cb80cd76f19", "slug": "mushroom-barley-soup", "name": "Mushroom Barley Soup", "description": "A deep, earthy soup of cremini mushrooms, pearl barley, and fresh thyme, simmered low and slow until rich and warming.", "tags": ["Soup", "Vegetarian", "1 hr"], "servings": 6, "ingredients": [{"item": "cremini mushrooms, sliced", "amount": "1 lb"}, {"item": "yellow onion, diced", "amount": "1"}, {"item": "carrots, diced", "amount": "2"}, {"item": "celery stalks, diced", "amount": "2"}, {"item": "pearl barley", "amount": "3/4 cup"}, {"item": "vegetable stock", "amount": "8 cups"}, {"item": "fresh thyme", "amount": "3 sprigs"}, {"item": "olive oil", "amount": "2 tbsp"}, {"item": "salt and black pepper", "amount": "to taste"}], "steps": ["Heat olive oil in a large pot and saute the onion, carrots, and celery until softened, about 8 minutes.", "Add the mushrooms and cook until they release their liquid and begin to brown.", "Stir in the barley, vegetable stock, and thyme, then bring to a simmer.", "Cover and cook for 40 minutes, stirring occasionally, until the barley is tender.", "Season to taste with salt and pepper before serving hot."], "image_gradient": "linear-gradient(to bottom right, rgba(28,22,18,0.4), #E8E2D9, rgba(138,158,132,0.3))"}, {"id": "83e5b839-e9ad-4bc3-9f6b-3d0b00df3822", "slug": "honey-glazed-salmon", "name": "Honey Glazed Salmon", "description": "Salmon fillets brushed with a honey soy glaze and broiled until caramelized at the edges. Bright, fast, and feels like a treat.", "tags": ["Seafood", "Dinner", "20 min"], "servings": 4, "ingredients": [{"item": "salmon fillets, skin on", "amount": "4"}, {"item": "honey", "amount": "3 tbsp"}, {"item": "soy sauce", "amount": "2 tbsp"}, {"item": "rice vinegar", "amount": "1 tbsp"}, {"item": "garlic, minced", "amount": "2 cloves"}, {"item": "grated fresh ginger", "amount": "1 tsp"}, {"item": "sesame seeds", "amount": "1 tsp"}, {"item": "scallions, sliced", "amount": "2"}], "steps": ["Whisk together honey, soy sauce, rice vinegar, garlic, and ginger to make the glaze.", "Place salmon fillets skin side down on a lined baking sheet and brush generously with the glaze.", "Broil for 8 to 10 minutes, brushing once more halfway through, until caramelized and just cooked through.", "Sprinkle with sesame seeds and scallions before serving."], "image_gradient": "linear-gradient(to bottom right, rgba(201,106,58,0.6), rgba(201,106,58,0.3), #F9F5EF)"}, {"id": "92dfba6b-6260-42ed-a3f5-3f58d7dd4de4", "slug": "spiced-apple-galette", "name": "Spiced Apple Galette", "description": "A free form pastry filled with cinnamon spiced apples, folded rustic and golden. Best served warm with a scoop of vanilla.", "tags": ["Dessert", "Baking", "1 hr 15 min"], "servings": 8, "ingredients": [{"item": "all butter pie dough, chilled", "amount": "1"}, {"item": "apples, thinly sliced", "amount": "4"}, {"item": "brown sugar", "amount": "1/3 cup"}, {"item": "ground cinnamon", "amount": "1 tsp"}, {"item": "ground nutmeg", "amount": "1/4 tsp"}, {"item": "lemon juice", "amount": "1 tbsp"}, {"item": "butter, cut into small pieces", "amount": "2 tbsp"}, {"item": "egg, beaten, for the crust", "amount": "1"}, {"item": "turbinado sugar", "amount": "1 tbsp"}], "steps": ["Preheat the oven to 400°F and roll the chilled dough into a rough circle on a lined baking sheet.", "Toss the apple slices with brown sugar, cinnamon, nutmeg, and lemon juice.", "Arrange the apples in the center of the dough, leaving a two inch border, and dot with butter.", "Fold the edges of the dough over the apples, pleating as you go, then brush with egg and sprinkle with turbinado sugar.", "Bake for 45 to 50 minutes, until the crust is deep golden and the apples are tender."], "image_gradient": "linear-gradient(to bottom right, rgba(201,106,58,0.4), #E8E2D9, rgba(28,22,18,0.2))"}]$seed$::jsonb) AS r
ON CONFLICT (id) DO NOTHING;
