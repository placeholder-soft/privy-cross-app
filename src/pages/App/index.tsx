import { useCrossAppAccounts, usePrivy } from "@privy-io/react-auth";
import { ethers } from "ethers";
import { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { env } from "../../env.ts";

const usdcContractAddress = "0x9e0D7B454676116C123d56ff4d5ed609D75Ad00E";
const PERCENTAGE = 120; // Gas estimate safety margin (120%)

const Info: FC<{ address: string | undefined }> = ({ address }) => {
  const { signMessage } = useCrossAppAccounts();
  const { ready, authenticated } = usePrivy();
  const { linkCrossAppAccount } = useCrossAppAccounts();

  return (
    <>
      <div className="p-8 flex gap-6 flex-row">
        <button
          className="btn"
          onClick={() => signMessage("Hello world", { address: address! })}
          disabled={!address}
        >
          Sign a message
        </button>
        <button
          className="btn"
          onClick={() => linkCrossAppAccount({ appId: env.VITE_PRIVY_APP_ID })}
          disabled={!ready || !authenticated}
        >
          Link your gift account
        </button>
      </div>
    </>
  );
};

const TransferButton: FC<{ address: string | undefined }> = ({ address }) => {
  const { sendTransaction } = useCrossAppAccounts();
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const [recipientAddress, setRecipientAddress] = useState<string>("");
  const [amount, setAmount] = useState<string>("");

  const handleTransfer = async () => {
    if (!address) {
      console.error("No cross-app wallet address found");
      return;
    }

    try {
      const transactionRequest = {
        to: recipientAddress,
        value: ethers.toBeHex(ethers.parseEther(amount)),
        chainId: 11155111,
      };
      const hash = await sendTransaction(transactionRequest, { address });
      setTransactionHash(hash);
    } catch (error) {
      console.error("Transaction failed:", error);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4">
        <input
          type="text"
          placeholder="Enter recipient address"
          value={recipientAddress}
          onChange={(e) => setRecipientAddress(e.target.value)}
          className="input border-gray-200"
        />
        <input
          type="number"
          placeholder="ETH amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="input border-gray-200 w-32"
          step="0.0001"
          min="0"
        />
        <button
          className="btn"
          onClick={handleTransfer}
          disabled={
            !address || !recipientAddress || !amount || parseFloat(amount) <= 0
          }
        >
          Transfer ETH
        </button>
      </div>
      {transactionHash && <p>Transaction Hash: {transactionHash}</p>}
    </div>
  );
};

const TransferUSDCButton: FC<{ address: string | undefined }> = ({
  address,
}) => {
  const { sendTransaction } = useCrossAppAccounts();
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const [recipientAddress, setRecipientAddress] = useState<string>("");
  const [amount, setAmount] = useState<string>("");

  const handleTransferUSDC = async () => {
    if (!address) {
      console.error("No cross-app wallet address found");
      return;
    }

    try {
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
      setTransactionHash(hash);
    } catch (error) {
      console.error("USDC Transaction failed:", error);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4">
        <input
          type="text"
          placeholder="Enter recipient address"
          value={recipientAddress}
          onChange={(e) => setRecipientAddress(e.target.value)}
          className="input border-gray-200"
        />
        <input
          type="number"
          placeholder="USDC amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="input border-gray-200 w-32"
          step="0.000001"
          min="0"
        />
        <button
          className="btn"
          onClick={handleTransferUSDC}
          disabled={
            !address || !recipientAddress || !amount || parseFloat(amount) <= 0
          }
        >
          Transfer USDC
        </button>
      </div>
      {transactionHash && <p>Transaction Hash: {transactionHash}</p>}
    </div>
  );
};

const TransferAllETHButton: FC<{ address: string | undefined }> = ({
  address,
}) => {
  const { sendTransaction } = useCrossAppAccounts();
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const [recipientAddress, setRecipientAddress] = useState<string>("");

  const getMaxETH = async (address: string) => {
    try {
      const provider = new ethers.JsonRpcProvider(
        "https://eth-sepolia.g.alchemy.com/v2/nQMfPn6lvIFxE6U_Wo9Ia4P8GiTvA1lA"
      );

      // Get current balance
      const balance = await provider.getBalance(address);

      // Estimate gas for the transfer
      const gasEstimate = await provider.estimateGas({
        from: address,
        to: recipientAddress,
        value: balance,
      });

      // Get current fee data
      const feeData = await provider.getFeeData();
      if (!feeData?.maxFeePerGas || !feeData.maxPriorityFeePerGas) {
        throw new Error("Failed to get fee data");
      }

      // Calculate total fee per gas
      const totalFeePerGas =
        feeData.maxFeePerGas + feeData.maxPriorityFeePerGas;

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
      setTransactionHash(hash);
    } catch (error) {
      console.error("Transfer all ETH failed:", error);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4">
        <input
          type="text"
          placeholder="Enter recipient address"
          value={recipientAddress}
          onChange={(e) => setRecipientAddress(e.target.value)}
          className="input border-gray-200"
        />
        <button
          className="btn"
          onClick={handleTransferAll}
          disabled={!address || !recipientAddress}
        >
          Transfer All ETH
        </button>
      </div>
      {transactionHash && <p>Transaction Hash: {transactionHash}</p>}
    </div>
  );
};

const BalanceDisplay: FC<{ address: string | undefined }> = ({ address }) => {
  const [ethBalance, setEthBalance] = useState<string>("");
  const [usdcBalance, setUsdcBalance] = useState<string>("");

  useEffect(() => {
    const fetchBalances = async () => {
      if (!address) return;

      try {
        const provider = new ethers.JsonRpcProvider(
          "https://eth-sepolia.g.alchemy.com/v2/nQMfPn6lvIFxE6U_Wo9Ia4P8GiTvA1lA"
        );
        const balance = await provider.getBalance(address);
        setEthBalance(ethers.formatEther(balance));

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

    // 设置定时刷新余额
    const intervalId = setInterval(fetchBalances, 10000); // 每10秒刷新一次

    return () => clearInterval(intervalId); // 清理定时器
  }, [address]);

  return (
    <div className="text-sm">
      <p>ETH Balance: {ethBalance ? `${ethBalance} ETH` : "Loading..."}</p>
      <p>USDC Balance: {usdcBalance ? `${usdcBalance} USDC` : "Loading..."}</p>
    </div>
  );
};

export const AppPage = () => {
  const navigate = useNavigate();
  const { user, logout } = usePrivy();
  const crossAccounts = user?.linkedAccounts.find(
    (account) => account.type === "cross_app"
  );
  const crossEmbeddedWallet = crossAccounts?.embeddedWallets[0];
  const crossEmbeddedWalletAddress = crossEmbeddedWallet?.address;

  return (
    <div className="h-screen flex flex-col justify-center items-center text-lg">
      <div className="flex flex-col items-center border border-gray-200 rounded-lg p-12">
        <div className="p-8 pb-0 text-sm">
          <p>wallet: {user?.wallet?.address}</p>
          <p>Cross Account: {crossEmbeddedWalletAddress}</p>
          <div className="divider" />
          <BalanceDisplay address={crossEmbeddedWalletAddress} />
        </div>
        <div className="divider" />
        <Info address={crossEmbeddedWalletAddress} />
        <div className="flex flex-col gap-4">
          <TransferButton address={crossEmbeddedWalletAddress} />
          <TransferAllETHButton address={crossEmbeddedWalletAddress} />
          <TransferUSDCButton address={crossEmbeddedWalletAddress} />
        </div>
      </div>
      <div
        className="absolute right-10 top-10 btn"
        onClick={async () => {
          await logout();
          localStorage.clear();
          navigate("/login");
        }}
      >
        Logout
      </div>
    </div>
  );
};
