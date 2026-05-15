# NovaSaaS — Dynamic Pricing Plans

A modern, fully responsive pricing page that dynamically fetches and renders SaaS pricing plans from a local JSON-based mock API. Built with vanilla HTML, CSS, and JavaScript — no frameworks, no dependencies.

---

## Live Preview

> Open `index.html` with [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) in VS Code or any local server.

---

## Features

- **Dynamic Rendering** — Pricing cards are rendered entirely from `data.json` via the Fetch API. Zero hardcoded UI data.
- **Monthly / Yearly Toggle** — Switch billing cycles with smooth transitions and savings highlighted automatically.
- **Currency Switcher** — Live price conversion across USD, EUR, GBP, PKR, and INR.
- **Loading Skeleton** — Animated skeleton cards shown while data is being fetched.
- **Error Handling** — Graceful error state with a retry button if the fetch fails.
- **API Response Caching** — Uses `sessionStorage` to cache the JSON response for 5 minutes, avoiding redundant fetches.
- **Most Popular Badge** — Highlighted card with distinct styling for the recommended plan.
- **Custom Toast Notifications** — Styled in-page toast replaces browser `alert()` on CTA click, with auto-dismiss and progress bar.
- **Hover Animations** — Cards lift with shadow and accent line on hover.
- **Staggered Card Reveal** — Cards animate in sequentially on load.
- **Mobile-First Responsive** — Works cleanly on all screen sizes (1-column on mobile, 2-column on tablet, 4-column on desktop).

---

## File Structure

```
novasaas-pricing/
├── index.html       # Main HTML structure
├── style.css        # All styles, animations, and responsive layout
├── app.js           # Fetch logic, dynamic rendering, toggle, currency, toast
└── data.json        # Mock API — pricing plans and currency rates
```

---

## Tech Stack

| Technology | Usage |
|---|---|
| HTML5 | Semantic page structure |
| CSS3 | Custom properties, animations, responsive grid |
| JavaScript (ES6+) | Fetch API, DOM manipulation, sessionStorage caching |
| JSON | Mock API / data source |
| Google Fonts | Syne (headings) + DM Sans (body) |

---

## Getting Started

**1. Clone the repository**
```bash
git clone https://github.com/KhadijaCodes-hub/novasaas-pricing.git
cd novasaas-pricing
```

**2. Open with Live Server**

In VS Code, right-click `index.html` → *Open with Live Server*

Or use any static file server:
```bash
npx serve .
```

> **Note:** The page must be served over HTTP (not opened as a raw file) because `fetch()` requires a server context to load `data.json`.

---

## Data Structure (`data.json`)

```json
{
  "billing_cycles": {
    "monthly": [ { "plan_name": "Starter", "price": 9, "features": [...], ... } ],
    "yearly":  [ { "plan_name": "Starter", "price": 7, "features": [...], ... } ]
  },
  "currencies": {
    "USD": { "symbol": "$", "rate": 1 },
    "PKR": { "symbol": "₨", "rate": 278 }
  }
}
```

To add a new plan, add an entry to both `monthly` and `yearly` arrays. To add a currency, add it to the `currencies` object with a `symbol` and `rate`.

---
## Author

**Khadija** — [@KhadijaCodes-hub](https://github.com/KhadijaCodes-hub)

---

## License

This project is open source and available under the [MIT License](LICENSE).
