import { Route } from "react-router";
import { LoginPage } from "../pages/Login";
import { AppPage } from "../pages/App";

export const createRoutes = (): JSX.Element => {
  return (
    <Route>
      <Route path="/" element={<LoginPage />} />
      <Route path="/app" element={<AppPage />} />
    </Route>
  );
};
