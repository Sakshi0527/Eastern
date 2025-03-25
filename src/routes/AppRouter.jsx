import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Suspense } from "react";
import routesConfig from "./routesConfig";
import RequiredAuth from "utils/RequiredAuth";
import Loader from "../component/common/Loader";

const AppRouter = () => {
  return (
    <Router>
      <Suspense fallback={<Loader/>}>
        <Routes>
          {routesConfig.public.map(({ path, element }, idx) => (
            <Route key={idx} path={path} element={element} />
          ))}
          {routesConfig.private.map(({ path, element }, idx) => (
            <Route
              key={idx}
              path={path}
              element={<RequiredAuth>{element}</RequiredAuth>}
            />
          ))}
        </Routes>
      </Suspense>
    </Router>
  );
};

export default AppRouter;
