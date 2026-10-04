# Sample Business Operations Dashboard

## Project overview

Sample is a fictional business operations dashboard for managing customers, projects, tasks, and team members. It demonstrates a modular frontend with local mock data, client-side navigation, forms, reporting, and shared application state.

Nuxt uses its default server rendering with client-side navigation after hydration. No backend API, database, or authentication service is required.

## Features

- **Dashboard:** summary cards, revenue and activity charts, project and task status breakdowns, recent work, team activity, deadlines, and quick actions.
- **Customers:** create, edit, delete, profile details, related projects, search, status filters, sorting, and pagination.
- **Projects:** create, edit, delete, customer and status filters, progress indicators, team assignments, task details, and timelines.
- **Tasks:** Kanban columns, drag and drop, task-menu status changes, search, filters, priority, due dates, and assignees.
- **Team:** member management, profiles, roles, departments, availability, search, and filtering.
- **Reports:** date ranges, summary cards, charts, project and team statistics, CSV downloads, and printing.
- **Settings:** profile details, light/dark theme, sidebar preferences, notifications, and regional preferences.
- **Shared UI:** validation messages, confirmation dialogs, toast notifications, and reusable loading, empty, and error states.

## Tech stack

| Technology     | Purpose                                                |
| -------------- | ------------------------------------------------------ |
| Nuxt 3         | Routing, layouts, server rendering, and auto-imports   |
| Vue 3          | Composition API and component rendering                |
| TypeScript     | Store, mock data, utility, and shared type definitions |
| Tailwind CSS 4 | Responsive utility styling and dark variants           |
| Pinia          | Application state with setup stores                    |
| Lucide Vue     | Interface icons                                        |
| Prettier       | Source formatting                                      |

Vue components use plain `<script setup>`. TypeScript is used in supporting `.ts` files.

## Architecture

```text
app.vue
assets/css/tailwind.css
components/
composables/
data/
layouts/default.vue
pages/
  index.vue
  [section].vue
public/
stores/
types/
utils/
nuxt.config.ts
```

`app.vue` renders `NuxtLayout` and `NuxtPage`. The default layout owns the sidebar, header, content container, and toast outlet. Route files remain small and render `AppPage`, which selects the appropriate page component using navigation state.

Shared types live in `types/`. Pure formatting, validation, CSV, string, and DOM helpers live in `utils/`. Composables contain Vue-aware behavior, including a shared initial date for hydration consistency and validation focus handling.

## Component structure

```text
components/
  AppHeader.vue
  AppPage.vue
  AppSidebar.vue
  AppToast.vue
  common/
  customers/
  dashboard/
  projects/
  reports/
  settings/
  tasks/
  team/
```

Each feature folder contains its parent page and supporting components. Parent pages coordinate forms, dialogs, and feature interactions; smaller components render tables, cards, charts, and other sections.

`components/common/` contains reusable controls and feedback components such as `BaseButton`, `BaseInput`, `BaseSelect`, `BaseModal`, `BaseDropdown`, `BaseBadge`, `BaseCard`, `DataTable`, `Pagination`, and `ConfirmDialog`.

Nuxt auto-imports Vue/Nuxt APIs and components without directory prefixes. Custom stores, data, and utility modules use explicit imports.

## State management

All Pinia stores use the Composition API setup pattern with `ref`, `computed`, and returned actions.

| Store              | Responsibility                                                       |
| ------------------ | -------------------------------------------------------------------- |
| `dashboard.ts`     | Dashboard revenue range                                              |
| `customers.ts`     | Customer records, search, status filtering, and dashboard pagination |
| `projects.ts`      | Project records and CRUD actions                                     |
| `tasks.ts`         | Task records, status changes, and completion state                   |
| `team.ts`          | Team member records and CRUD actions                                 |
| `settings.ts`      | Profile, preferences, theme, and browser persistence                 |
| `navigation.ts`    | Active section derived from the URL and navigation actions           |
| `notifications.ts` | Toast messages and dismissal timing                                  |

Store composables use singular names, such as `useCustomerStore`, `useProjectStore`, and `useTaskStore`. Local form drafts, modal visibility, and feature-table controls remain in their owning components.

## Mock data approach

```text
data/
  activity.ts
  customers.ts
  navigation.ts
  projects.ts
  tasks.ts
  users.ts
```

Stores initialize editable records from copies of the mock data. Changes update local Pinia state and appear in related views without an API request. Customer, project, task, and team changes reset on a full reload.

Profile and preferences persist in `localStorage` under `nuxtapp-profile` and `nuxtapp-preferences`. Settings hydrate after mounting to keep the initial server and browser render consistent.

Some overview metrics and revenue visuals are illustrative mock figures. They are not all calculated from the editable record lists. Reports and status summaries use the current local records.

## Responsive design

Tailwind breakpoints adapt the interface for desktop, laptop, tablet, and mobile widths.

- Desktop navigation supports expanded and collapsed sidebars; mobile uses a dismissible drawer.
- Page actions and filters stack on narrow screens.
- Wide tables scroll within their containers.
- Forms switch between one and multiple columns.
- Modals stay within the viewport and scroll for longer content.
- Charts use flexible containers.
- The Kanban board uses horizontally scrollable columns on smaller screens; task menus provide an alternative to dragging.

## Accessibility

The interface includes semantic landmarks and headings, accessible control labels, a skip link, and visible keyboard focus indicators.

Dialogs use native modal behavior with explicit Tab wrapping, Escape dismissal, initial focus, and focus restoration. Dropdowns support keyboard navigation, and the mobile drawer contains focus while open.

Validation messages are associated with their fields, invalid submissions focus the affected field, and live regions announce loading states, notifications, and task moves. Tables provide captions and scoped column headings. Decorative heading content is hidden from screen readers.

Buttons use native disabled states and default to `type="button"`; form submission buttons explicitly use `type="submit"`. Styling includes dark variants, improved text contrast, and reduced-motion handling. These features do not constitute a formal accessibility certification.

## Installation

Requirements: Node.js 20.19+ within the Node 20 release line, or Node.js 22.12+, and npm.

From the project directory:

```bash
npm install
```

No environment variables or external service credentials are required for the local mock-data implementation.

## Development

Start the development server:

```bash
npm run dev
```

Open the URL printed by Nuxt in the terminal. Nuxt DevTools is disabled in `nuxt.config.ts`.

Available maintenance commands:

```bash
npm run typecheck
npm run format
```

## Production build

Build the application:

```bash
npm run build
```

Nuxt writes the production output to `.output/`. Preview it locally:

```bash
npm run preview
```

For a static output, use:

```bash
npm run generate
```

When hosting static output, configure the host to serve the generated route pages or provide a fallback for direct visits to application routes.
