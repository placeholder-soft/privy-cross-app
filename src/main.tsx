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

export const GIFT_ART_APP_ID = 'clrraxjm604jjl60fwgcg5dru'

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PrivyProvider
      appId='cm3sfyo5805w5ncgkld7gj7in'
      config={{
        loginMethodsAndOrder: {
          primary: ['email', `privy:${GIFT_ART_APP_ID}`],
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
