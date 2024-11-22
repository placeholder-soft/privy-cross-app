import { useCrossAppAccounts, usePrivy } from "@privy-io/react-auth";
import { FC, useState } from "react";
import { GIFT_ART_APP_ID } from "../../main.tsx";
import { useNavigate } from "react-router";
import { ethers } from "ethers";

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
          onClick={() => linkCrossAppAccount({ appId: GIFT_ART_APP_ID })}
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

  const handleTransfer = async () => {
    if (!address) {
      console.error("No cross-app wallet address found");
      return;
    }

    try {
      const transactionRequest = {
        // type your address
        to: "0xB7d030F7c6406446e703E73B3d1dd8611A2D87b6",
        value: ethers.toBeHex(ethers.parseEther("0.1")),
        chainId: 11155111,
      };
      const hash = await sendTransaction(transactionRequest, { address });
      setTransactionHash(hash);
    } catch (error) {
      console.error("Transaction failed:", error);
    }
  };

  return (
    <div className="flex gap-4">
      <button className="btn" onClick={handleTransfer} disabled={!address}>
        Transfer 0.1 ETH
      </button>
      {transactionHash && <p>Transaction Hash: {transactionHash}</p>}
    </div>
  );
};

export const AppPage = () => {
  const navigate = useNavigate();
  const { user } = usePrivy();
  const crossAccounts = user?.linkedAccounts.find(
    (account) => account.type === "cross_app",
  );
  const crossEmbeddedWalletAddress = crossAccounts?.embeddedWallets[0]?.address;

  return (
    <div className="h-screen flex flex-col justify-center items-center text-lg">
      <div className="flex flex-col items-center border border-gray-200 rounded-lg pb-12">
        <div className="p-8 pb-0 text-sm">
          <p>wallet: {user?.wallet?.address}</p>
          <p>Cross Account: {crossEmbeddedWalletAddress}</p>
        </div>
        <div className="divider" />
        <Info address={crossEmbeddedWalletAddress} />
        <TransferButton address={crossEmbeddedWalletAddress} />
      </div>
      <div
        className="absolute right-10 top-10 btn"
        onClick={() => {
          localStorage.clear();
          navigate("/login");
        }}
      >
        Logout
      </div>
    </div>
  );
};
