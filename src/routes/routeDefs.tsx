import { Navigate, Outlet, Route, useLocation } from "react-router";
import { LoginPage } from "../pages/Login";
import { AppPage } from "../pages/App";
import { usePrivy } from "@privy-io/react-auth";
import { FC } from "react";

export const AuthControl: FC = () => {
  const { ready, authenticated, user } = usePrivy();
  const location = useLocation();
  
  if (!ready || !authenticated || !user?.wallet?.address) {
    return <Navigate to={`/login${location.search}`} replace state={{ location }} />;
  }

  return <Outlet />;
};

export const createRoutes = (): JSX.Element => {
  return (
    <Route>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<AuthControl />}>
        <Route path="/" element={<AppPage />} />
        <Route path="/app" element={<AppPage />} />
      </Route>
    </Route>
  );
};
