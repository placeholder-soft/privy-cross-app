# Privy Cross-App Integration Demo

This project demonstrates how to integrate Privy's cross-app functionality into any application, using Gifted.art as the provider. It showcases how a requestor app can interact with a user's wallet that is connected to Gifted.art, enabling signing and transaction operations through cross-app authentication.

The documentation for Privy's cross-app functionality can be found at [https://docs.privy.io/guide/react/cross-app](https://docs.privy.io/guide/react/cross-app/).

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

## Code Snippet

### Add Gifted.art as a login method

[src/main.tsx](src/main.tsx)

```tsx
<PrivyProvider
  appId="cm3sfyo5805w5ncgkld7gj7in"
  config={{
    loginMethodsAndOrder: {
      primary: [
        `privy:${GIFT_ART_APP_ID}`, // using Gifted.art's account as the login method
      ],
    },
  }}
></PrivyProvider>
```

### Transferring ETH from the user's Gifted.art wallet

[src/pages/App/index.tsx](src/pages/App/index.tsx)

```tsx
const { sendTransaction } = useCrossAppAccounts();
const [amount, setAmount] = useState<string>("");

const handleTransfer = async () => {
  const transactionRequest = {
    to: recipientAddress,
    value: ethers.toBeHex(ethers.parseEther(amount)),
    chainId: 11155111,
  };
  const hash = await sendTransaction(transactionRequest, { address });
};

return (
  <div className="flex gap-4">
    <input
      type="text"
      placeholder="Enter recipient address"
      value={recipientAddress}
      onChange={(e) => setRecipientAddress(e.target.value)}
    />
    <input
      type="number"
      placeholder="ETH amount"
      value={amount}
      onChange={(e) => setAmount(e.target.value)}
      step="0.0001"
      min="0"
    />
    <button onClick={handleTransfer}>Transfer ETH</button>
  </div>
);
```

### Transfer USDC from the user's Gifted.art wallet

Note: For mainnet, use the correct USDC contract address and decimals (e.g. 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913 with 6 decimals on base mainnet)

[src/pages/App/index.tsx](src/pages/App/index.tsx)

```tsx
const { sendTransaction } = useCrossAppAccounts();
const [amount, setAmount] = useState<string>("");
const usdcContractAddress = "0x9e0D7B454676116C123d56ff4d5ed609D75Ad00E"; // USDC contract address

const handleTransferUSDC = async () => {
  const usdcAmount = ethers.parseUnits(amount, 18);
  const transactionRequest = {
    to: usdcContractAddress,
    value: 0,
    data: new ethers.Interface([
      "function transfer(address to, uint256 amount)",
    ]).encodeFunctionData("transfer", [recipientAddress, usdcAmount]),
    chainId: 11155111,
  };

  const hash = await sendTransaction(transactionRequest, { address });
};

return (
  <div className="flex gap-4">
    <input
      type="text"
      placeholder="Enter recipient address"
      value={recipientAddress}
      onChange={(e) => setRecipientAddress(e.target.value)}
    />
    <input
      type="number"
      placeholder="USDC amount"
      value={amount}
      onChange={(e) => setAmount(e.target.value)}
      step="0.000001"
      min="0"
    />
    <button onClick={handleTransferUSDC}>Transfer USDC</button>
  </div>
);
```

### Transfer All ETH from the user's Gifted.art wallet

[src/pages/App/index.tsx](src/pages/App/index.tsx)

```tsx
const PERCENTAGE = 120; // Gas estimate safety margin (120%)

const { sendTransaction } = useCrossAppAccounts();
const [recipientAddress, setRecipientAddress] = useState<string>("");

const getMaxETH = async (address: string) => {
  try {
    const provider = new ethers.JsonRpcProvider(
      "https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY"
    );

    // Get current balance
    const balance = await provider.getBalance(address);

    // Estimate gas for the transfer
    const gasEstimate = await provider.estimateGas({
      from: address,
      to: recipientAddress,
      value: balance,
    });

    // Get current block and fee data
    const [block, feeData] = await Promise.all([
      provider.getBlock("latest"),
      provider.getFeeData(),
    ]);
    if (!block?.baseFeePerGas || !feeData.maxPriorityFeePerGas) {
      throw new Error("Failed to get fee data");
    }

    // Calculate total fee per gas
    const totalFeePerGas = block.baseFeePerGas + feeData.maxPriorityFeePerGas;

    // Calculate total gas cost with safety margin
    const gasLimit = (gasEstimate * BigInt(PERCENTAGE)) / BigInt(100);
    const gasCost = gasLimit * totalFeePerGas;

    // Calculate max amount that can be sent (balance - gas cost)
    const maxAmount = balance - gasCost;

    if (maxAmount <= BigInt(0)) {
      throw new Error("Insufficient balance to cover gas costs");
    }

    return maxAmount;
  } catch (error) {
    console.error("Error calculating max ETH:", error);
    return null;
  }
};

const handleTransferAll = async () => {
  if (!address || !recipientAddress) {
    console.error("Missing address information");
    return;
  }

  try {
    const maxAmount = await getMaxETH(address);
    if (!maxAmount) {
      console.error("Failed to calculate max amount");
      return;
    }

    const transactionRequest = {
      to: recipientAddress,
      value: ethers.toBeHex(maxAmount),
      chainId: 11155111,
    };

    const hash = await sendTransaction(transactionRequest, { address });
  } catch (error) {
    console.error("Transfer all ETH failed:", error);
  }
};

return (
  <div className="flex gap-4">
    <input
      type="text"
      placeholder="Enter recipient address"
      value={recipientAddress}
      onChange={(e) => setRecipientAddress(e.target.value)}
    />
    <button onClick={handleTransferAll}>Transfer All ETH</button>
  </div>
);
```

### Displaying Wallet Balances

[src/pages/App/index.tsx](src/pages/App/index.tsx)

```tsx
const BalanceDisplay: FC<{ address: string | undefined }> = ({ address }) => {
  const [ethBalance, setEthBalance] = useState<string>("");
  const [usdcBalance, setUsdcBalance] = useState<string>("");

  useEffect(() => {
    const fetchBalances = async () => {
      if (!address) return;

      try {
        const provider = new ethers.JsonRpcProvider("https://rpc.sepolia.org");

        // Get ETH balance
        const balance = await provider.getBalance(address);
        setEthBalance(ethers.formatEther(balance));

        // Get USDC balance
        const usdcContract = new ethers.Contract(
          usdcContractAddress,
          ["function balanceOf(address) view returns (uint256)"],
          provider
        );
        const usdcBalance = await usdcContract.balanceOf(address);
        setUsdcBalance(ethers.formatUnits(usdcBalance, 18));
      } catch (error) {
        console.error("Error fetching balances:", error);
      }
    };

    fetchBalances();
    const intervalId = setInterval(fetchBalances, 10000); // Refresh every 10 seconds
    return () => clearInterval(intervalId);
  }, [address]);

  return (
    <div>
      <p>ETH Balance: {ethBalance ? `${ethBalance} ETH` : "Loading..."}</p>
      <p>USDC Balance: {usdcBalance ? `${usdcBalance} USDC` : "Loading..."}</p>
    </div>
  );
};

const App = () => {
  const { user, logout } = usePrivy();
  const crossAccounts = user?.linkedAccounts.find(
    (account) => account.type === "cross_app"
  );
  const crossEmbeddedWalletAddress = crossAccounts?.embeddedWallets[0]?.address;

  return <BalanceDisplay address={crossEmbeddedWalletAddress} />;
};
```

### Requesting a signature from the user's Gifted.art wallet

[src/pages/App/index.tsx](src/pages/App/index.tsx)

```tsx
const { signMessage } = useCrossAppAccounts();
<button
  className="btn"
  onClick={() => signMessage("Hello world", { address: address! })}
>
  Sign a message
</button>;
```

### Linking a Gifted.art account to a Privy account

[src/pages/App/index.tsx](src/pages/App/index.tsx)

```tsx
const { linkCrossAppAccount } = useCrossAppAccounts();
<button
  className="btn"
  onClick={() => linkCrossAppAccount({ appId: GIFT_ART_APP_ID })}
>
  Link your gift account
</button>;
```

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
