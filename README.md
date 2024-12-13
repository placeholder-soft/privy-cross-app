# Privy Cross-App Integration Demo

This project demonstrates how to integrate Privy's cross-app functionality into any application, using Gifted.art as the provider. It showcases how a requestor app can interact with a user's wallet that is connected to Gifted.art, enabling signing and transaction operations through cross-app authentication.

## Overview

This demo shows how any application can:

- Integrate with Privy for authentication
- Connect to a user's Gifted.art account
- Request signing operations from the user's wallet connected to Gifted.art
- Initiate transactions using the tokens in the user's Gifted.art-connected wallet

## Provider's App IDs

| Environment | Website URL                  | Gifted.art App ID           |
| ----------- | ---------------------------- | --------------------------- |
| Test        | `https://staging.gifted.art` | `clt8w3guc082a12djsayai4py` |
| Production  | `https://gifted.art`         | `clrraxjm604jjl60fwgcg5dru` |

## Getting Started

### Prerequisites

- Node.js and pnpm installed on your machine

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
pnpm start
```

## Project Structure

- **src/main.tsx**: Entry point of the application, configures the `PrivyProvider` and routing
- **src/pages/App/index.tsx**: Main application page demonstrating cross-app integration features:
  - Signing message requests
  - Transaction requests
  - Cross-app account linking with Gifted.art
- **src/pages/Login/index.tsx**: Authentication page using Privy's login system

## How It Works

1. Users authenticate using Privy in your application
2. Users can link their Gifted.art account through Privy's cross-app functionality
3. Your application can then:
   - Request message signatures from the user's wallet connected to Gifted.art
   - Initiate transactions using tokens in the user's Gifted.art wallet
   - Access other wallet-related functionality through the cross-app integration

This template provides a foundation for building applications that leverage Privy's cross-app capabilities with Gifted.art as the provider platform.
