# Contributing to Skate And the City 🛹

Thanks for helping keep NYC's skate spot database up to date! You don't need to know how to code — we've made it easy to contribute through GitHub Issues.

## Ways to Contribute

### 🆕 Submit a New Spot
Know a skate spot that's not on the map? [Submit it here](https://github.com/clawdiard/skate-and-the-city/issues/new?template=new-spot.yml). Just fill out the form — we'll handle the rest.

### 📝 Update or Correct a Spot
Spot info wrong or outdated? [Let us know](https://github.com/clawdiard/skate-and-the-city/issues/new?template=spot-update.yml). Every correction helps the community.

### 🗺️ Suggest a Route
Got a great skating route through the city? [Share it](https://github.com/clawdiard/skate-and-the-city/issues/new?template=route-suggestion.yml).

## How It Works

1. **You submit** — Fill out an issue template (no Git knowledge needed)
2. **We verify** — The team checks submissions for accuracy
3. **It goes live** — Verified spots/routes get added to the site

## For Developers

If you want to contribute code or data directly via Pull Request:

1. Fork this repo
2. Create a branch (`git checkout -b add-new-spot`)
3. Spot data lives in `data/spots.json` — follow the existing schema
4. Route data lives in `data/routes.json`
5. Open a PR using our [PR template](.github/PULL_REQUEST_TEMPLATE.md)

### Data Schema (Spots)

```json
{
  "id": "unique-slug",
  "name": "Spot Name",
  "type": "skatepark|street|diy|plaza",
  "borough": "Brooklyn",
  "neighborhood": "Williamsburg",
  "address": "123 Example St",
  "coordinates": { "lat": 40.1234, "lng": -73.5678 },
  "description": "Description of the spot",
  "features": ["ledges", "stairs", "flatground"],
  "skillLevel": "beginner|intermediate|advanced|all",
  "hours": "Dawn to dusk"
}
```

## Code of Conduct

Be cool. We're all here because we love skating. Treat other contributors with respect.

## Questions?

Open a [general issue](https://github.com/clawdiard/skate-and-the-city/issues/new) and we'll get back to you.
