# Privy Cross App - Gift Art Platform

This project is a template for building a React application using TypeScript and Vite, specifically designed for a Gift Art Platform. It includes hot module replacement (HMR) and some ESLint rules to ensure code quality. The platform integrates with Privy for authentication and cross-app accounts, providing a seamless user experience.

## Features

- **React**: A JavaScript library for building user interfaces, enabling the creation of dynamic and interactive web applications.
- **TypeScript**: A typed superset of JavaScript that compiles to plain JavaScript, offering enhanced code quality and developer productivity.
- **Vite**: A build tool that provides a fast development environment with instant server start and lightning-fast HMR.
- **ESLint**: A tool for identifying and fixing problems in JavaScript code, ensuring consistent code quality and style.
- **Privy Integration**: Utilizes Privy for secure authentication and management of cross-app accounts, enhancing user security and convenience.
  - **Cross-App Accounts**: Allows users to link their accounts across different applications, providing a unified experience. This is particularly useful for users who want to manage their digital assets or identities across multiple platforms.
  - **Embedded Wallets**: Privy supports the creation of embedded wallets, which can be automatically generated for users without existing wallets. This feature simplifies the onboarding process and enhances user engagement.
- **React Router**: For handling routing in the application, allowing for smooth navigation between different pages.
- **Tailwind CSS**: A utility-first CSS framework for styling, enabling rapid UI development with a modern design.

## Getting Started

### Prerequisites

- Node.js and npm (or pnpm) installed on your machine.

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

### Running the Application

To start the development server, run:

```bash
pnpm dev
```

This will start the Vite development server and open the application in your default web browser.

### Building for Production

To build the application for production, run:

```bash
pnpm build
```

This will create an optimized build of the application in the `dist` directory.

## Project Structure

- **src/main.tsx**: The entry point of the application. It sets up the React application with the `PrivyProvider` and `RouterProvider`.
- **src/pages/App/index.tsx**: The main application page, which includes components for signing messages and linking cross-app accounts.
- **src/pages/Login/index.tsx**: The login page, which uses Privy's login functionality to authenticate users.
- **src/routes/routeDefs.tsx**: Defines the routes for the application using React Router, managing navigation and access control.
- **src/styles/index.css**: The main stylesheet, utilizing Tailwind CSS for responsive and modern design.
- **src/assets/react.svg**: An SVG asset used in the application, representing the React logo.

## Expanding the ESLint Configuration

For production applications, consider expanding the ESLint configuration to enable type-aware lint rules. See the comments in the `eslint.config.js` file for more details.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Vite](https://vitejs.dev/)
- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Privy](https://privy.io/)
