# Password Manager

A secure, modern password manager built with Next.js, featuring user authentication, encrypted password storage, and an intuitive dashboard interface.

## Preview

<div align="center">
  <img src="./app/public/screenshots/dashboard.png" alt="Dashboard Preview" width="600"/>
  <p><em>Dashboard View</em></p>
</div>

<div align="center">
  <img src="./app/public/screenshots/login.png" alt="Login Preview" width="600"/>
  <p><em>Login Page</em></p>
</div>

<div align="center">
  <img src="./app/public/screenshots/register.png" alt="Register Preview" width="600"/>
  <p><em>Register Page</em></p>
</div>

## Features

- 🔐 Secure user authentication with NextAuth.js
- 🗄️ Encrypted password storage using PostgreSQL
- 📱 Responsive dashboard interface
- 🎨 Modern UI with Tailwind CSS
- 🔄 Real-time password management
- 🔍 Search and filter capabilities

## Tech Stack

- [Next.js 14](https://nextjs.org/)
- [PostgreSQL](https://www.postgresql.org/)
- [Prisma](https://www.prisma.io/)
- [NextAuth.js](https://next-auth.js.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TypeScript](https://www.typescriptlang.org/)

## Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm or yarn

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/YourUsername/password-manager.git
cd password-manager
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up your environment variables:
Create a `.env` file in the root directory with the following:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/password_manager?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key" # Generate at https://auth-secret-gen.vercel.app/
```

4. Set up the database:
```bash
npx prisma generate
npx prisma db push
```

5. Run the development server:
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
password-manager/
├── app/
│   ├── api/           # API routes
│   ├── dashboard/     # Dashboard pages
│   ├── login/         # Authentication pages
│   └── types/         # TypeScript definitions
├── components/        # Reusable UI components
├── lib/              # Utility functions
├── prisma/           # Database schema
└── public/           # Static assets
    └── screenshots/  # Application screenshots
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Deployment

The easiest way to deploy this app is to use the [Vercel Platform](https://vercel.com/new).

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YourUsername/password-manager)

## Support

If you find this project helpful, please give it a ⭐️ on GitHub!
