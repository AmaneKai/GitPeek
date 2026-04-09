# GitPeek

A web application for viewing public GitHub profile statistics. Enter any GitHub username and get an instant overview of their activity, languages, repositories, and contribution history.

Live at [gitpk.vercel.app](https://gitpk.vercel.app)

---

## Features

- Profile overview with avatar, bio, followers, and account age
- Contribution and commit totals
- Language distribution chart with per-language breakdown
- Most starred repository highlight
- Responsive layout for desktop and mobile

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [SvelteKit](https://kit.svelte.dev/) |
| Components | [shadcn-svelte](https://www.shadcn-svelte.com/) |
| Headless UI | [bits-ui](https://www.bits-ui.com/) |
| Styling | [Tailwind CSS](https://tailwindcss.com/) |
| Icons | [Lucide](https://lucide.dev/) |
| Backend | Cloudflare Worker proxying GitHub's GraphQL API |

---

## Project Structure

```
src/
  lib/
    components/ui/     # shadcn component primitives
    features/
      charts/          # LanguagePie component and hook
      profile/         # ProfileCard component
      repos/           # MostStarredRepo component
      search/          # SearchBar, EmptyState, useSearch hook
      skeleton/        # DashboardSkeleton loading state
      stats/           # StatGrid component and hook
    utils/             # api, config, format, icons, theme, tilt, types
  routes/
    +page.svelte       # main page
    +layout.svelte     # app shell
```

---

## License

MIT
