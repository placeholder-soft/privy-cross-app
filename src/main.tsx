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

const APP_ID = "cm3sfyo5805w5ncgkld7gj7in";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PrivyProvider
      appId={APP_ID}
      config={{
        loginMethods: ["email"],
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
