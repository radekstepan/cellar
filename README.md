# Lumina Core

![Lumina Core Screenshot](./screenshot.png)

Baseline frontend component library for future projects.

## Features

- **TypeScript** - Full type safety
- **Tailwind CSS** - Utility-first styling
- **React 18** - Modern React patterns
- **Vite** - Fast build tool
- **Vitest** - Testing framework
- **Lucide Icons** - Beautiful & consistent iconography

## Components Included

Lumina Core comes with a variety of pre-built components:
- **Layout**: `SectionHeader`, `TableRow`, `NodeCard`
- **Data Visualization**: `MiniChart`, `MetricBar`, `StatWidget`
- **Feedback**: `Badge`, `StatusCard`, `NotificationItem`, `Tooltip`
- **UI Elements**: `Avatar`, `Skeleton`, `Kbd`, `NavIcon`, `ProfileMenuItem`

## Prerequisites

- **Node.js**: v24.13.0 or later (see [.nvmrc](.nvmrc))
- **Package Manager**: [Yarn](https://yarnpkg.com/) (recommended)

## Getting Started

```bash
# Install dependencies
yarn install

# Start development server
yarn dev

# Build for production
yarn build

# Run tests
yarn test

# Lint code
yarn lint

# Format code
yarn format
```

### (Optional) Infisical Setup

For secure secret management using Infisical:

a. Install Infisical CLI:
```bash
# macOS
brew install infisical/get-cli/infisical
```

b. Update `infisical.json` with your workspace ID.

c. Secrets will be automatically injected into `process.env` when running via Infisical. If Infisical is not used, the project falls back to reading from a local `.env` file via `dotenv`.

## Usage Example

```tsx
import { StatWidget, Badge } from './components';

export const MyComponent = () => (
  <StatWidget 
    title="Total Users" 
    value="1,234" 
    change="+12%" 
    icon={<Badge variant="success">Active</Badge>} 
  />
);
```

## Project Structure

```
lumina-core/
├── bin/               # CLI bootstrap tools
├── src/
│   ├── components/    # Reusable UI components
│   ├── sections/      # Application layout sections
│   ├── utils/         # Utility functions
│   ├── App.tsx        # Main application component
│   ├── main.tsx       # Entry point
│   └── index.css      # Global styles
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## Adding Components

1. Create component file in `src/components/`
2. Export from `src/components/index.ts`
3. Add tests in `src/components/__tests__/`

## Creating a New Project

Use this template to create a new project:

```bash
npx radekstepan/lumina-core --name="My Project" --dir="./my-app"
```

This creates a new project with:
- Package name: `my-app`
- Display name: `My Project`
- All template files copied and updated

## Styling & Customization

Lumina Core uses **Tailwind CSS** with a custom theme:
- **Fonts**: `Inter` for sans-serif, `JetBrains Mono` for code.
- **Colors**: Custom `violet` palette as the primary accent.
- **Animations**: Includes `fadeIn`, `slideUp`, and `shimmer` utility classes.

See [tailwind.config.js](tailwind.config.js) for the full theme configuration.

## Deployment

The project is configured for easy deployment to **Netlify**:
- Configuration: [netlify.toml](netlify.toml)
- Build Command: `yarn build`
- Publish Directory: `dist`

## License

AGPL-3.0
