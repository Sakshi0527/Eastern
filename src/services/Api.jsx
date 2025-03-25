import axios from "axios";
import { RouteConstants } from "routes/RouteConstants";
import Cookies, { cookieKeys } from "./cookies";
import { clearLocal } from "./localstorage";
const API_URL = import.meta.env.VITE_API_URL;

class Axios {
    constructor(baseURL) {
      this.axios = axios.create({
        baseURL,
      });
  
      this.axios.interceptors.request.use(this._requestMiddleware);
      this.axios.interceptors.response.use(
        this._responseMiddleware,
        this._responseErr
      );
    }
  
    _requestMiddleware = req => {
      const token = Cookies.get(cookieKeys.Token);
      if (!!token)
        req.headers.authorization = token.startsWith("Bearer ")
          ? token
          : "Bearer " + token;
      return req;
    };
  
    _responseMiddleware = response => {
      if (response?.data?.data?.authorization) {
        Cookies.set(cookieKeys.Token, response.data.data.authorization);
      }
      return response;
    };
  
    _responseErr = error => {
      if (
        (error?.response?.data?.message)?.toString()?.toLowerCase() ===
        "permission reverted"
      ) {
        window.location.replace("/");
      }
      if (error?.response?.status === 401) {
        window.location.replace(`${RouteConstants?.login}`);
        Cookies.clear();
        clearLocal();
        return Promise.reject(error);
      }
      return Promise.reject(error);
    };
  }

const axiosApi = new Axios(API_URL).axios
    
export default axiosApi