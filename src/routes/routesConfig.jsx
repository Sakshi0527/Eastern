import { lazy } from "react";
import { RouteConstants } from "./RouteConstants";

const NavigateToHome = lazy(() => import( "../component/common/NavigateToHome"))
const NavigateToLogin = lazy(() => import( "../component/common/NavigateToLogin"))
const Login = lazy(() => import("../modules/Auth/pages/Login"));
const Users = lazy(() => import("../modules/Users/pages/index"));
const AddEditUser = lazy(() => import("../modules/Users/pages/AddEdituser"));


const routesConfig = {
  public: [
    {
      path: RouteConstants.LOGIN,
      element: <Login/>
    },
    {
      path: RouteConstants.NOT_FOND,
      element: <NavigateToLogin/>
    }
  ],
  private: [
    {
      path: RouteConstants.USERS,
      element: <Users />
    },
    {
      path: RouteConstants.ADD_USER,
      element: <AddEditUser />
    },
    {
      path: `${RouteConstants.EDIT_USER}/:id`,
      element: <AddEditUser />
    },
    {
      path: RouteConstants.NOT_FOND,
      element: <NavigateToHome />
    }
  ]
};

export default routesConfig;
