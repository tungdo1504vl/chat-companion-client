# Chat Companion Client

A modern, feature-rich chat companion client application built with Next.js and React. This project provides a beautiful and intuitive interface for chat interactions with a responsive design, dark mode support, and a comprehensive UI component library.

## Requirements

- **Node.js**: v22 or above
- **Package Manager**: pnpm (recommended)

## Tech Stack

This project is built with the following technologies:

### Core Framework
- **[Next.js 16](https://nextjs.org/)** - React framework with App Router
- **[React 19](https://react.dev/)** - UI library
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety

### Styling
- **[Tailwind CSS v4](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Geist Font](https://vercel.com/font)** - Optimized font family

### UI Components
- **[Radix UI](https://www.radix-ui.com/)** - Unstyled, accessible component primitives
  - Avatar, Dialog, Dropdown Menu, Menubar, Popover, Separator, Tooltip
- **[Lucide React](https://lucide.dev/)** - Icon library
- **[Sonner](https://sonner.emilkowal.ski/)** - Toast notifications

### State Management & Data Fetching
- **[Zustand](https://zustand-demo.pmnd.rs/)** - Lightweight state management
- **[TanStack React Query](https://tanstack.com/query)** - Data fetching and caching
- **[Axios](https://axios-http.com/)** - HTTP client

### Additional Libraries
- **[Next Themes](https://github.com/pacocoursey/next-themes)** - Theme switching (dark/light mode)
- **[date-fns](https://date-fns.org/)** - Date utility library
- **[react-day-picker](https://react-day-picker.js.org/)** - Date picker component
- **[Vaul](https://vaul.emilkowal.ski/)** - Drawer component
- **[class-variance-authority](https://cva.style/)** - Component variant management
- **[clsx](https://github.com/lukeed/clsx)** & **[tailwind-merge](https://github.com/dcastil/tailwind-merge)** - Class name utilities

## Getting Started

### Prerequisites

Make sure you have Node.js v22 or above installed. You can check your Node.js version by running:

```bash
node --version
```

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd chat-companion-client
```

2. Install dependencies using pnpm:
```bash
pnpm install
```

### Development

Start the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

The page auto-updates as you edit the files. You can start editing the page by modifying `src/app/page.tsx`.

### Build

Build the application for production:

```bash
pnpm build
```

### Start Production Server

Start the production server:

```bash
pnpm start
```

### Linting

Run the linter:

```bash
pnpm lint
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── conversations/      # Conversations feature pages
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── layout/           # Layout components (Header, Sidebar)
│   ├── provider/         # Context providers
│   └── ui/               # Reusable UI components
├── hooks/                # Custom React hooks
├── libs/                 # Library configurations
│   ├── next-theme/       # Theme configuration
│   ├── react-query/      # React Query setup
│   └── tailwind/         # Tailwind utilities
└── env/                  # Environment configuration
```

## Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API
- [React Documentation](https://react.dev/) - Learn about React
- [Tailwind CSS Documentation](https://tailwindcss.com/docs) - Learn about Tailwind CSS
- [Radix UI Documentation](https://www.radix-ui.com/docs) - Learn about Radix UI components
