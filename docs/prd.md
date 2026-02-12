# Skate & The City — NYC Skate Tourism Guide
## Product Requirements Document

**Version:** 1.0  
**Date:** February 12, 2026  
**Repository:** https://github.com/clawdiard/skate-and-the-city

---

## 1. Executive Summary

**Skate & The City** is a static web application that serves as the definitive skateboarding tourism guide for New York City. Built to run entirely on GitHub Pages with zero server-side dependencies, it provides visiting skaters with curated routes that combine iconic skate spots with nearby food, culture, and shopping — turning a skate trip into a full NYC experience.

The app offers interactive maps, downloadable GPX routes, offline-capable progressive web app (PWA) functionality, local tips from the NYC skate community, and affiliate-driven discounts at partnered skate shops and restaurants.

**Revenue model:** Affiliate commissions from skate shops/restaurants, sponsored content from tourism boards, and premium downloadable route packs.

---

## 2. Problem Statement

Visiting skaters coming to NYC face several challenges:

1. **Fragmented information:** Skate spot info is scattered across Reddit threads, decade-old forum posts, Instagram stories, and word-of-mouth. No single authoritative source exists.
2. **Spots change constantly:** Brooklyn Banks was closed for years during renovation, spots get knobbed or demolished, new DIY spots emerge. Outdated info wastes precious trip time.
3. **Missing context:** Knowing *where* a spot is doesn't tell you the best time to go, what's nearby to eat, or which local shop to hit for replacement hardware.
4. **Navigation gaps:** Skaters don't drive — they skate, subway, or walk. Generic Google Maps routing doesn't account for skate-friendly paths or multi-spot sessions.
5. **No trip planning tool:** There's no way to plan a multi-day skate trip to NYC that integrates spots, food, transit, and shopping into cohesive daily itineraries.

---

## 3. Market Opportunity

### Skateboarding Market
- Global skateboarding market valued at ~$2.4B (2024), projected growth of 3-4% CAGR
- Post-Olympic inclusion (Tokyo 2020, Paris 2024, LA 2028) has driven mainstream interest and tourism
- NYC remains one of the top 3 global skate destinations alongside Barcelona and Los Angeles

### Skate Tourism
- Estimated 500K+ skate tourists visit NYC annually (combining domestic and international)
- Average skate tourist spends 3-5 days, $150-300/day on food, shopping, and entertainment
- No dedicated skate tourism product exists for NYC — the market is entirely unserved

### Comparable Markets
- Surf tourism apps (Magic Seaweed, Surfline) have proven the action-sports-tourism model
- City walking tour apps (Atlas Obscura, Detour) validate curated urban exploration
- Skate-specific gap: Braille Skateboarding and Thrasher have content but no trip planning tools

---

## 4. Target Users

### Primary: The Visiting Skater (age 18-35)
- Traveling to NYC specifically to skate or combining skating with a trip
- Skill level: intermediate to advanced (comfortable navigating a city on a board)
- Budget-conscious but willing to spend on experiences, gear, and food
- Heavy mobile user, relies on phone for navigation
- Wants authentic local experiences, not tourist traps

### Secondary: The NYC Skate-Curious Tourist (age 16-40)
- Visiting NYC, interested in skate culture even if not a skater
- Wants to visit famous spots they've seen in skate videos
- Interested in the cultural/historical significance of NYC skate spots
- May buy gear or apparel at local shops

### Tertiary: Local NYC Skaters
- Looking for new spots or wanting to see their city through fresh eyes
- Can contribute local tips and keep spot info current
- Ambassadors for the platform through social sharing

---

## 5. Core Features

### MVP (Phase 1)

#### 5.1 Interactive Spot Map
- Full-screen Leaflet.js map with all curated skate spots
- Spot markers color-coded by type: street, park, DIY, plaza, transition
- Click-to-expand spot cards with: photo, description, difficulty, best times, current status, terrain type
- Filter by: spot type, borough, difficulty, features (ledges, stairs, rails, bowls, etc.)

#### 5.2 Curated Routes
- Pre-built daily itineraries combining 4-6 skate spots with food/culture stops
- Each route includes: estimated duration, distance, transit info, difficulty rating
- Route types: "Classic NYC" (iconic spots), "Brooklyn Day", "Manhattan Street Skating", "Queens Hidden Gems", "Bronx & Beyond"
- Step-by-step directions with subway/walking segments

#### 5.3 Spot Database (JSON-driven)
- All spot data stored as static JSON files in the repo
- Each spot entry includes:
  - Name, coordinates, borough, neighborhood
  - Description and history
  - Terrain features (ledges, stairs, gaps, rails, banks, bowls)
  - Difficulty rating (1-5)
  - Current status (active, knobbed, demolished, restricted hours)
  - Best times to skate (time of day, days of week)
  - Photos (stored in repo or CDN-linked)
  - Nearby food/shop recommendations
  - Transit directions
  - Last verified date

#### 5.4 Downloadable GPX Routes
- One-click GPX download for each curated route
- Compatible with Google Maps, Apple Maps, Komoot, Ride with GPS
- Includes waypoints for each stop with notes

#### 5.5 Spot Detail Pages
- Static HTML pages for each major spot
- Rich content: history, famous tricks filmed there, photo gallery
- "Skater's tips" section with practical advice
- Embedded map showing exact location
- Nearby spots, food, and shops sidebar

#### 5.6 Responsive PWA
- Mobile-first responsive design
- Service worker for offline access to spot data and maps
- Add-to-homescreen capability
- Offline map tile caching for subway dead zones

### Future Phases

#### Phase 2: Community & Content
- User-submitted spot updates via GitHub Issues/PRs (structured templates)
- Skate video integration: link spots to famous video parts filmed there
- Weather-aware suggestions (covered spots for rain days)
- Event calendar (contests, demo days, shop events)

#### Phase 3: Revenue & Partnerships
- Affiliate links to partner skate shops with discount codes
- Sponsored "shop routes" (e.g., "The Labor Skateshop Route")
- Restaurant partner highlights with deals
- NYC tourism board integration
- Premium downloadable city pack (print-quality PDF guide)

#### Phase 4: Multi-City Expansion
- Template system for adding new cities (Barcelona, LA, London, Tokyo)
- City comparison features
- "Skate trip planner" combining multiple cities

---

## 6. Technical Architecture

### Constraint: GitHub Pages Only
All architecture decisions flow from the critical constraint: **zero server-side code, zero databases, static files only.**

### Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| **Hosting** | GitHub Pages | Free, reliable, custom domain support, CI/CD via Actions |
| **Static Site Generator** | Eleventy (11ty) or plain HTML/JS | Lightweight, fast builds, Markdown-friendly |
| **Maps** | Leaflet.js + OpenStreetMap tiles | Free, open-source, no API key limits |
| **Routing** | Leaflet Routing Machine + OSRM | Client-side routing, free tile servers |
| **Data** | Static JSON files in `/data/` | Version-controlled, easy to update via PR |
| **GPX Generation** | Client-side JavaScript (togpx library) | No server needed |
| **Offline/PWA** | Workbox service worker | Precache spot data, cache map tiles |
| **Styling** | Tailwind CSS | Utility-first, small bundle, skate-aesthetic friendly |
| **Search** | Lunr.js or Fuse.js | Client-side full-text search |
| **Analytics** | Plausible or Simple Analytics | Privacy-friendly, no cookie banner needed |
| **CI/CD** | GitHub Actions | Auto-build and deploy on push |

### Data Model

```
/data/
  spots.json          # All skate spots
  routes.json         # Curated route definitions
  shops.json          # Partner skate shops
  food.json           # Recommended food spots
  tips.json           # Local tips and advice
  
/data/spots/
  brooklyn-banks.json # Individual detailed spot files
  tompkins-park.json
  les-park.json
  ...

/assets/
  images/spots/       # Spot photography
  images/routes/      # Route hero images
  gpx/                # Pre-generated GPX files
```

#### Spot Schema (spots.json)
```json
{
  "id": "brooklyn-banks",
  "name": "Brooklyn Banks",
  "coordinates": [40.7081, -74.0010],
  "borough": "manhattan",
  "neighborhood": "City Hall",
  "type": "street",
  "status": "active",
  "difficulty": 3,
  "features": ["banks", "ledges", "manual pads", "gaps"],
  "description": "Legendary spot under the Brooklyn Bridge...",
  "history": "One of the most iconic skate spots in the world...",
  "bestTimes": {
    "days": ["weekday"],
    "hours": "10am-6pm",
    "notes": "Less crowded on weekday mornings"
  },
  "transit": {
    "subway": ["4/5/6 to Brooklyn Bridge-City Hall", "J/Z to Chambers St"],
    "walkFromStation": "3 min"
  },
  "nearby": {
    "food": ["joe-pizza-broadway", "vanessa-dumplings"],
    "shops": ["labor-skateshop"],
    "spots": ["city-hall-park", "courthouse-ledges"]
  },
  "photos": ["brooklyn-banks-01.jpg", "brooklyn-banks-02.jpg"],
  "videos": [
    {"title": "Zoo York Mixtape", "url": "...", "year": 1997}
  ],
  "lastVerified": "2026-01-15"
}
```

### Build Pipeline
```
GitHub Push → GitHub Actions → Eleventy Build → Deploy to gh-pages branch
                                    ↓
                              Generate GPX files
                              Optimize images
                              Build search index
                              Generate sitemap
```

---

## 7. Content Strategy

### Iconic NYC Skate Spots (Initial Database — 40+ spots)

#### Manhattan
| Spot | Status | Type | Significance |
|------|--------|------|-------------|
| **Brooklyn Banks** | Active (post-renovation) | Street/Banks | Arguably the most iconic skate spot in the world. Under the Brooklyn Bridge, features natural brick banks, ledges, and manual pads. Decades of skate history filmed here. Reopened after years of closure during bridge renovation. |
| **Tompkins Square Park** | Active | Park | Heart of East Village skate culture. Small but beloved concrete park. Surrounded by punk/skate history. |
| **LES Skatepark (Coleman Playground)** | Active | Park | Under the Manhattan Bridge. Modern concrete park built 2012. Bowls, ledges, rails. Free and open. |
| **Chelsea Piers Skatepark** | Active | Park | Indoor/outdoor. West Side Highway. Good for rainy days. |
| **BANKS Skatepark (Washington Heights)** | Active | Park | Recently built community park. Less crowded, great flow. |
| **Midtown Ledges (various)** | Active | Street | Scattered marble ledges throughout Midtown. Best on weekends when offices close. |
| **Astor Place Cube** | Active | Street/Plaza | Iconic NYC landmark, flat ground and ledges nearby. |
| **Federal Plaza** | Restricted | Street | Classic 90s spot. Security guards active but still skateable early mornings. |

#### Brooklyn
| Spot | Status | Type | Significance |
|------|--------|------|-------------|
| **Owl's Head Skatepark** | Active | Park | Bay Ridge. Massive concrete park, one of NYC's best. Ocean views. |
| **McCarren Skatepark** | Active | Park | Williamsburg. Good park in hipster heartland. |
| **Prospect Park** | Active | Street/Path | Long smooth paths, banks, natural terrain. |
| **DUMBO** | Active | Street | Cobblestone vibes, warehouse ledges, Brooklyn Bridge views. |
| **Bushwick DIY** | Varies | DIY | Underground community-built spots, locations shift. |

#### Queens
| Spot | Status | Type | Significance |
|------|--------|------|-------------|
| **Flushing Meadows Skatepark** | Active | Park | Near USTA. Solid park, less crowded. |
| **Rockaway Beach Skatepark** | Active | Park | Beach vibes, concrete park steps from the ocean. |
| **Astoria Skatepark** | Active | Park | Under the Triborough Bridge. Good mix of street and transition. |
| **Maloof Money Cup Park (Flushing)** | Active | Park | World-class park built for competition. |

#### Bronx
| Spot | Status | Type | Significance |
|------|--------|------|-------------|
| **Mullaly Skatepark** | Active | Park | Bronx's premier park. Great transition skating. |
| **River Park Skatepark** | Active | Park | Under the highway, raw NYC vibes. |

#### Staten Island
| Spot | Status | Type | Significance |
|------|--------|------|-------------|
| **Stapleton Skatepark** | Active | Park | Worth the ferry ride. Solid park, Ferry = free transport. |

### Curated Routes (Initial Set — 8 routes)

1. **"The OG Manhattan"** — Brooklyn Banks → LES Park → Tompkins → Astor Place → Washington Square (Full day, 5 spots, medium difficulty)
2. **"Brooklyn Bridge to Banks"** — Start in DUMBO, skate across Brooklyn Bridge approach, hit Brooklyn Banks, loop through City Hall (Half day, 3 spots)
3. **"Williamsburg to Bushwick"** — McCarren Park → Bushwick DIY spots → local shops and food (Half day, 4 spots)
4. **"Queens Quest"** — Astoria Park → Flushing Meadows → Maloof Park (Full day, 3 spots, transit-heavy)
5. **"Beach Day"** — Rockaway Beach Park + boardwalk skating + tacos (Half day, seasonal)
6. **"Rainy Day Options"** — Chelsea Piers + indoor alternatives + museum/culture stops
7. **"The Full Borough Blitz"** — One spot per borough in one day (challenge route, expert transit navigation)
8. **"Culture & Kickflips"** — Skate spots paired with nearby museums, galleries, and historic sites

### Nearby Recommendations

#### Skate Shops (Partner Targets)
- **Labor Skateshop** (Manhattan) — Premium shop, strong community ties
- **KCDC** (Brooklyn) — Williamsburg institution
- **Supreme** (Manhattan) — Iconic, more fashion but skate roots
- **Homage Brooklyn** — Community-focused shop
- **Bustin Boards** (Brooklyn) — Longboard/cruiser focused
- **Autumn Skateshop** (Brooklyn)
- **DQM** (Manhattan) — If still operating

#### Food Near Spots
- **Joe's Pizza** (multiple locations) — NYC skater fuel since forever
- **Vanessa's Dumplings** (LES) — Cheap, delicious, near LES Park
- **L&B Spumoni Gardens** (Brooklyn) — Sicilian slice near Owl's Head
- **Taqueria Diana** (East Village) — Near Tompkins
- **Los Tacos No.1** (Chelsea) — Near Chelsea Piers route
- **Halal Guys** (Midtown) — Classic street food

---

## 8. Revenue Model

### Phase 1: Foundation (Months 1-6) — $0 revenue
- Build audience, establish content authority
- Target: 5K monthly unique visitors by month 6

### Phase 2: Affiliate & Partnerships (Months 6-12)
| Revenue Stream | Mechanism | Projected Monthly |
|---------------|-----------|-------------------|
| Skate shop affiliates | Commission on referred sales (5-10%) | $200-500 |
| Restaurant partnerships | Featured listings with tracking links | $100-300 |
| Amazon/skate gear affiliates | Gear recommendation links | $100-400 |

### Phase 3: Sponsored Content & Premium (Months 12-24)
| Revenue Stream | Mechanism | Projected Monthly |
|---------------|-----------|-------------------|
| Sponsored routes | Shops/brands pay for featured routes | $500-1,000 |
| NYC Tourism Board | Official partnership/grant | $500-2,000 |
| Premium PDF guide | One-time download purchase ($9.99) | $300-800 |
| Display partnerships | Ethical, relevant ads (skate brands only) | $200-500 |

### Target: $2,000-5,000/month by Year 2

### Partnership Targets
1. **NYC & Company** (official tourism board) — Co-marketing, official endorsement
2. **Thrasher / Transworld** — Content syndication
3. **Skatepark of Tampa (SPoT)** — Cross-promotion for traveling skaters
4. **Vans / Nike SB / Adidas Skateboarding** — Brand sponsorship
5. **Local BIDs** (Business Improvement Districts) — Neighborhood promotion

---

## 9. Competitive Landscape

| Competitor | What They Do | Gap We Fill |
|-----------|-------------|-------------|
| **Google Maps** | General navigation | No skate-specific curation, no spot status, no community context |
| **Skatepark.com / Skatemap** | Basic skatepark directories | No routes, no food/culture, no tourism focus, outdated |
| **Reddit r/NYCskating** | Community discussion | Fragmented, not trip-planning friendly, info buried in threads |
| **Thrasher Spot Check** | Spot features in magazine | Sporadic, not comprehensive, not navigable |
| **Local skate shop word-of-mouth** | In-person tips | Requires being there already, not plannable |
| **CityMapper / Transit apps** | Urban navigation | No skate awareness, no spot data |

**Our differentiation:** The ONLY product that combines skate spot data + curated routes + food/culture + downloadable navigation + offline access, purpose-built for skate tourists, running on free infrastructure.

---

## 10. Success Metrics

### North Star: Monthly Active Users who download a route

| Metric | Month 3 | Month 6 | Month 12 |
|--------|---------|---------|----------|
| Monthly unique visitors | 1,000 | 5,000 | 20,000 |
| Route downloads (GPX) | 100 | 500 | 2,500 |
| Average session duration | 3 min | 4 min | 5 min |
| Return visitors (30-day) | 10% | 20% | 30% |
| Affiliate click-throughs | — | 200 | 1,000 |
| Affiliate revenue | — | $300 | $2,000 |
| GitHub stars | 20 | 100 | 500 |
| Community PRs (spot updates) | — | 5/mo | 20/mo |

---

## 11. Risks & Mitigations

| Risk | Impact | Likelihood | Mitigation |
|------|--------|-----------|------------|
| **Spot data goes stale** | High — bad recommendations damage trust | High | Community update system via GitHub Issues/PRs, "last verified" dates, scheduled review cycles |
| **Map tile costs at scale** | Medium — OpenStreetMap has usage policies | Low | Self-hosted tile server fallback, multiple tile providers, aggressive caching |
| **Legal issues with spot documentation** | Medium — some spots are technically trespassing | Medium | Clear disclaimers, focus on legal/public spots, "skate at your own risk" notice |
| **GitHub Pages limitations** | Low — bandwidth/size limits | Low | CDN for images, lazy loading, efficient builds (100MB soft limit generous for our use) |
| **Low adoption** | High — product fails without users | Medium | Strong SEO, social media presence, partnerships with skate media, Reddit/forum seeding |
| **Seasonal traffic variance** | Medium — winter = less skating | Medium | Indoor spot coverage, "rainy day" routes, year-round content strategy |
| **Competition from funded startup** | Medium — someone builds this with money | Low | First-mover advantage, open-source community moat, zero operating costs |

---

## 12. Implementation Phases

### Phase 1: MVP (Weeks 1-6)
- **Week 1-2:** Project setup, GitHub Pages with Eleventy, base styling, map integration
- **Week 2-3:** Spot data schema, initial 20 spots with full data, spot detail pages
- **Week 3-4:** Curated routes (3 initial routes), GPX generation, route detail pages
- **Week 4-5:** Search, filtering, responsive design, PWA setup
- **Week 5-6:** Content polish, photography sourcing, SEO, soft launch

**Deliverable:** Live site at skateandthecity.com (or GitHub Pages URL) with 20 spots, 3 routes, interactive map, GPX downloads

### Phase 2: Content & Community (Weeks 7-12)
- Expand to 40+ spots across all 5 boroughs
- Add 5 more curated routes (8 total)
- GitHub Issues templates for spot submissions
- Weather integration (client-side API)
- Video part links for each spot
- Blog/content section for SEO

### Phase 3: Revenue & Growth (Months 4-8)
- Affiliate partnership outreach to shops
- Restaurant partnership program
- Premium PDF guide creation
- NYC tourism board outreach
- Social media launch (Instagram, TikTok)
- Influencer/skater partnerships

### Phase 4: Scale (Months 9-12+)
- Multi-city template system
- Barcelona as second city
- Mobile app wrapper (Capacitor/PWA)
- Advanced features: trip planner, packing lists, flight integration
- Community ambassador program

---

## 13. Open Questions

1. **Domain:** Secure skateandthecity.com or use GitHub Pages subdomain initially?
2. **Photography:** Source original photos or use Creative Commons / community-submitted?
3. **Legal review:** Do we need liability disclaimers for spot recommendations?
4. **Localization:** Support languages beyond English for international skate tourists?
5. **Print guide:** Physical zine version for shops to distribute?

---

## Appendix A: NYC Skate History Context

New York City has been central to skateboarding culture since the 1970s. Key historical moments:

- **1970s-80s:** Early NYC skating in Brooklyn schoolyards and Manhattan plazas
- **1990s golden era:** Zoo York crew, Harold Hunter, Jeff Pang — Brooklyn Banks becomes world-famous through video parts
- **2000s:** Supreme opens on Lafayette (1994, but blows up in 2000s), NYC street skating defines an era
- **2010s:** LES Skatepark opens (2012), giving Manhattan its first purpose-built park. Brooklyn Banks closes for bridge renovation.
- **2020s:** Brooklyn Banks reopens post-renovation. Olympic skateboarding drives new interest. NYC parks department invests in skatepark infrastructure.

The city's skate culture is inseparable from its broader cultural identity — hip-hop, punk, street art, fashion. This cultural integration is what makes NYC skate tourism unique and what **Skate & The City** aims to capture.

---

*This PRD is a living document. Updates will be tracked via Git history.*
