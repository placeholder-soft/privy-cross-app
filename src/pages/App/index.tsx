import { useCrossAppAccounts, usePrivy } from "@privy-io/react-auth";
import { FC } from "react";
import { GIFT_ART_APP_ID } from "../../main.tsx";
import { useNavigate } from "react-router";

const Contract: FC<{ address: string | undefined }> = ({ address }) => {
  const { signMessage } = useCrossAppAccounts();
  const { ready, authenticated } = usePrivy();
  const { linkCrossAppAccount } = useCrossAppAccounts();

  return (
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
      <div className="flex flex-col items-center border border-gray-200 rounded-lg">
        <div className="p-8 text-sm">
          <p>wallet: {user?.wallet?.address}</p>
          <p>Cross Account: {crossEmbeddedWalletAddress}</p>
        </div>
        <div className="divider" />
        <Contract address={crossEmbeddedWalletAddress} />
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
