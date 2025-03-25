import React, { useEffect } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import Cookies, { cookieKeys } from "../../../services/cookies";
import { RouteConstants } from "../../../routes/RouteConstants";
import { setAuthorized } from "../../../redux/authentication/authSlice";
import axiosApi from "../../../services/Api";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email format")
        .required("Email is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    }),
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        const response = await axiosApi.post("/login", values);

        if (response.data && response.data.data.authorization) {
          const token = response.data.data.authorization;
          localStorage.setItem("token", token );
          localStorage.setItem("username", response.data.data.name );
          localStorage.setItem("profile_pic", response.data.data.profile );
          Cookies.set(cookieKeys.Token, token);
          dispatch(setAuthorized(true));
          navigate(RouteConstants.USERS);
        }
      } catch (error) {
        setErrors({ api: error.response?.data?.message || "Login failed" });
      } finally {
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    document.body.style.background = "#fff";
    return () => (document.body.style.background = "");
  }, []);

  const token = Cookies.get(cookieKeys.Token) || localStorage.getItem("token");
  if (token) {
    return <Navigate to={RouteConstants.USERS} replace />;
  }
  return (
    <div className="container-fluid height-vh">
      <div className="row h-100">
        <div className="col-12 col-md-4 purple-bg d-flex flex-row-auto">
          <div className="d-flex flex-column h-100">
            <div className="p-4">
              <h1 className="logo-text">EASTERN</h1>
            </div>
            <div className="flex-grow-1 d-flex align-items-center p-4">
              <h2>Welcome to Eastern Techno Solutions!</h2>
            </div>
            <div className="p-4">
              <p className="copy">&copy; 2025 Eastern Techno Solutions</p>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-8">
          <div className="login-wrapper">
            <div className="login-form-wrapper">
              <h2>Sign In</h2>
              <p className="subtitle">Enter your username and password</p>

              <form onSubmit={formik.handleSubmit}>
                <div className="form-group">
                  <label htmlFor="email">Email*</label>
                  <input
                    type="text"
                    name="email"
                    className="form-control"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.email && formik.errors.email ? (
                    <div className="text-danger">{formik.errors.email}</div>
                  ) : null}
                </div>
                <div className="form-group">
                  <label htmlFor="password">Password*</label>
                  <input
                    type="password"
                    name="password"
                    className="form-control"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.password && formik.errors.password ? (
                    <div className="text-danger">{formik.errors.password}</div>
                  ) : null}
                </div>

                {formik.errors.api && (
                  <div className="text-danger">{formik.errors.api}</div>
                )}

                <div className="text-end mb-4">
                  <Link to="#" className="forgot-link">
                    Forgot Password?
                  </Link>
                </div>

                <button
                  type="submit"
                  className="submit-wrapper w-100"
                  disabled={formik.isSubmitting}
                >
                  {formik.isSubmitting ? "Logging in..." : "Submit"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
