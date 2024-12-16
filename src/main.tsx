import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.css";
import { PrivyProvider } from "@privy-io/react-auth";
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import { createRoutes } from "./routes/routeDefs.tsx";

export const GIFT_ART_APP_ID = 'clt8w3guc082a12djsayai4py'

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PrivyProvider
      appId='cm3sfyo5805w5ncgkld7gj7in'
      config={{
        loginMethodsAndOrder: {
          primary: [
            // 'email', // use email as login method, uncomment to enable
            `privy:${GIFT_ART_APP_ID}`, // using Gifted.art's account as the login method
          ],
        },
        appearance: {
          theme: "light",
          accentColor: "#676FFF",
          logo: "/logo.png",
        },
        embeddedWallets: {
          createOnLogin: "users-without-wallets",
        },
      }}
    >
      <RouterProvider
        router={createBrowserRouter(createRoutesFromElements(createRoutes()))}
      />
    </PrivyProvider>
  </StrictMode>,
);
