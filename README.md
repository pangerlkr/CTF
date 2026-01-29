# CTF - Capture The Flag Platform

A modern, interactive Capture The Flag (CTF) platform built with React, TypeScript, and Supabase. This application provides a secure environment for hosting cybersecurity challenges and managing competition leaderboards.

## Features

- **React 18** - Modern UI framework with hooks and functional components
- **TypeScript** - Type-safe development with full TypeScript support
- **Vite** - Lightning-fast build tool and development server
- **TailwindCSS** - Utility-first CSS framework for responsive design
- **Supabase** - Backend infrastructure with PostgreSQL database
- **Lucide Icons** - Beautiful, consistent icon library
- **Database Migrations** - Managed database schema with Supabase migrations

## Project Structure

```
CTF/
├── public/               # Static assets and logos
├── src/                  # Source code
│   └── components/       # React components
├── supabase/             # Database migrations and configuration
│   └── migrations/       # SQL migration files
├── package.json          # Project dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── vite.config.ts        # Vite configuration
├── tailwind.config.js    # TailwindCSS configuration
└── README.md            # This file
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn package manager
- Supabase account (for database)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/pangerlkr/CTF.git
cd CTF
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the project root with your Supabase credentials:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run the development server:
```bash
npm run dev
```

The application will start at `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint to check code quality
- `npm run typecheck` - Run TypeScript type checking

## Technology Stack

### Frontend
- **React** - UI library
- **TypeScript** - Language
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **Lucide React** - Icons

### Backend & Database
- **Supabase** - Backend-as-a-Service
- **PostgreSQL** - Database
- **RESTful API** - Via Supabase

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **TypeScript ESLint** - TypeScript linting

## Database

Database migrations are stored in `supabase/migrations/`. To apply migrations:

1. Push migrations to Supabase:
```bash
npx supabase db push
```

2. Pull latest schema from Supabase:
```bash
npx supabase db pull
```

## Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for bugs and feature requests.

## License

This project is open source and available under the MIT License.

## Author

**pangerlkr** - [GitHub Profile](https://github.com/pangerlkr)

## Support

For support, please open an issue in the [GitHub repository](https://github.com/pangerlkr/CTF/issues).
