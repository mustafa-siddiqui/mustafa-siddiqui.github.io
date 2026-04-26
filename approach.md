# Making site data-driven and extensible

The goal of this effort is to put the data the site is going to consume at an isolated
location and make it extensible such that adding new entries don't require html or css
additions/modifications.

## Approach: Dynamic data loading with typed sections

All content lives in `data/main.yaml`. The YAML defines an ordered list of sections,
each with a `type` field that determines how it renders:

- **`prose`** — free-form HTML paragraph(s) rendered inside a card. Use for standalone
  text sections like an intro or description. Fields: `body` (required), `heading` (optional).
- **`timeline`** — list of entries rendered as cards with timestamps. Use for experience,
  education, or anything with a title, company/org, date, and description.
  Fields: `heading` (optional), `items` (required, each with `title`, `company`,
  `companyLink`, `date`, `description`).
- **`link-list`** — list of entries rendered as cards with timestamps and links. Use for
  projects or any collection of titled links with dates.
  Fields: `heading` (optional), `items` (required, each with `title`, `date`, `link`).
All section types also support an optional **`sectionFooter`** field — plain HTML text
appended at the end of the section's container, without its own card or wrapper. Use for
supplementary text that belongs visually with the section (e.g., "Interested in more?
Explore my repos." at the end of the projects list).

`scripts/fetch-data-for-main.js` fetches the YAML at page load, parses it, and
dispatches each section to a type-specific renderer. The renderers produce DOM elements
using the same CSS classes as the original hardcoded HTML.

## How to extend

- **Add a new entry** (experience, project): add an item to the relevant section's `items` array.
- **Add a new section** (e.g., "Publications"): add a new entry to the `sections` array with the appropriate `type`.
- **Reorder sections**: reorder items in the `sections` array.
- **No HTML or CSS changes** are needed for any of the above.
