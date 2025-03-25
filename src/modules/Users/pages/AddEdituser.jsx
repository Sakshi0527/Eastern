import React, { useEffect, useMemo, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { getRoles, addUser, updateUser } from "../../../redux/user/userSlice";
import Header from "../components/Header";
import { RouteConstants } from "../../../routes/RouteConstants";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axiosApi from "../../../services/Api";

const AddEditUser = () => {
  const dispatch = useDispatch();
  const { roles, addloading } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const [userData, setUserData] = useState(location.state?.userDetail || null);


  useEffect(() => {
    if (!userData && id) {
      axiosApi.get(`/users/${id}`)
        .then(res => setUserData(res.data.data))
        .catch(err => console.error("Error loading user:", err));
    }
  }, [id, userData]);



  useEffect(() => {
    dispatch(
      getRoles({
        page: 1,
        per_page: 10,
        search: "",
        filter: "",
        sort: "",
        order_by: "",
      })
    );
  }, [dispatch]);

  const roleOptions = useMemo(() => {
    return roles?.map((item) => ({ id: item?.id, name: item?.name }));
  }, [roles]);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: id
      ? Yup.string()
      : Yup.string().required("Password is required").min(6, "Password must be at least 6 characters"),
    role: Yup.string().required("Role is required"),
   dob: Yup.date()
    .typeError("Invalid date format") 
    .max(new Date(), "Date of Birth cannot be in the future")
    .required("Date of Birth is required"),
    gender: Yup.string().required("Gender is required"),
    profile: Yup.mixed().required("Profile picture is required"),
    userGalleries: Yup.mixed()
      .test("required", "User galleries must be required", (files) => {
        if (id) return true;
        return files && files.length > 0;
      })
      .test("fileSize", "Maximum 5 files allowed", (files) => !files || files.length <= 5),

    userPictures: Yup.mixed()
      .test("required", "User pictures must be required", (files) => {
        if (id) return true;
        return files && files.length > 0;
      })
      .test("fileSize", "Maximum 5 files allowed", (files) => !files || files.length <= 5),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: userData?.name || '',
      email: userData?.email || '',
      password: userData?.password || "",
      role: userData?.role_id || "",
      dob: userData?.dob || "",
      gender: userData?.gender !== undefined ? Number(userData.gender) : '',
      profile: userData?.profile_thumbnail || "",
      profilePreview: userData?.profile_thumbnail || '',
      status: Number(userData?.status) || 0,
      userGalleries: [],
      userGalleriesPreview: userData?.user_galleries || [],
      userPictures: [],
      userPicturesPreview: userData?.user_pictures || [],
    },
    validationSchema,
    onSubmit: (values) => {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("email", values.email);
      formData.append("password", values.password);
      formData.append("role_id", values.role);
      formData.append("dob", values.dob);
      formData.append("gender", values.gender);
      formData.append("status", values.status ? 1 : 0);



      if (!id && values.profile) {
        formData.append("profile", values.profile);
      }

      if (values.userGalleries.length > 0) {
        Array.from(values.userGalleries).forEach((file) => {
          formData.append("user_galleries[]", file);
        });
      }

      if (values.userPictures.length > 0) {
        Array.from(values.userPictures).forEach((file) => {
          formData.append("user_pictures[]", file);
        });
      }

      if (id) {
        dispatch(updateUser({
          id,
          data: formData,
          cb: () => {
            navigate(RouteConstants.USERS);
          },
        }));
      } else {
        dispatch(addUser({
          payload: formData,
          cb: () => {
            navigate(RouteConstants.USERS);
          },
        }));
      }
    },
  });

  const handleCancel = () => {
    navigate(RouteConstants.USERS);
  };


  return (
    <>
      <Header />
      <div className="user-page add-edit-user-wrapper">
        <div className="user-container">
          <h2>{id ? "Update Admin User" : "Create Admin User"}</h2>
          <form onSubmit={formik.handleSubmit}>
            <div className="form-group">
              <div className="input-field">
                <label>Name*</label>
                <input
                  type="text"
                  name="name"
                  {...formik.getFieldProps("name")}
                />
                {formik.touched.name && formik.errors.name && (
                  <div className="text-danger">{formik.errors.name}</div>
                )}
              </div>
              <div className="input-field">
                <label>Email*</label>
                <input
                  type="email"
                  name="email"
                  readOnly={!!id}
                  disabled={id ? true : false}
                  {...formik.getFieldProps("email")}
                />
                {formik.touched.email && formik.errors.email && (
                  <div className="text-danger">{formik.errors.email}</div>
                )}
              </div>
            </div>

            <div className="form-group">
              {!id && (
                <div className="input-field">
                  <label>Password*</label>
                  <input
                    type="password"
                    name="password"
                    {...formik.getFieldProps("password")}
                  />
                  {formik.touched.password && formik.errors.password && (
                    <div className="text-danger">{formik.errors.password}</div>
                  )}
                </div>
              )}

              <div className="input-field">
                <label>Role*</label>
                <select name="role" {...formik.getFieldProps("role")}>
                  <option value="">Select Role</option>
                  {roleOptions?.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
                {formik.touched.role && formik.errors.role && (
                  <div className="text-danger">{formik.errors.role}</div>
                )}
              </div>
            </div>

            <div className="form-group">
              <div className="input-field">
                <label>DOB*</label>
                <input
                  type="date"
                  name="dob"
                  {...formik.getFieldProps("dob")}
                />
                {formik.touched.dob && formik.errors.dob && (
                  <div className="text-danger">{formik.errors.dob}</div>
                )}
              </div>
              <div className="input-field">
                <label>Profile*</label>
                {/* {formik.values.profilePreview && (
                  <div className="image-preview">
                    <img src={formik.values.profilePreview} alt="Profile" height="60" />
                  </div>
                )} */}
                <input
                  type="file"
                  name="profile"
                  className="ps-0"
                  onChange={(event) =>
                    formik.setFieldValue("profile", event.currentTarget.files[0])
                  }
                />
                {formik.touched.profile && formik.errors.profile && (
                  <div className="text-danger">{formik.errors.profile}</div>
                )}
              </div>

            </div>

            <div className="row-12 form-group-1">
              <div className="gender col-md-6">
                <label className="font-weight-bold">Gender*</label>
                <label>
                  <input
                    type="radio"
                    name="gender"
                    value={0}
                    checked={formik.values.gender === 0}
                    onChange={() => formik.setFieldValue("gender", 0)}
                  />{" "}
                  Female
                </label>
                <label>
                  <input
                    type="radio"
                    name="gender"
                    value={1}
                    checked={formik.values.gender === 1}
                    onChange={() => formik.setFieldValue("gender", 1)}
                  />{" "}
                  Male
                </label>
                {formik.touched.gender && formik.errors.gender && (
                  <div className="text-danger">{formik.errors.gender}</div>
                )}
              </div>

              <div className="status col-md-6 ms-4">
                <label>Status*</label>
                <label className="switch">
                  <input
                    type="checkbox"
                    name="status"
                    checked={formik.values.status === 1}
                    onChange={() =>
                      formik.setFieldValue(
                        "status",
                        formik.values.status === 1 ? 0 : 1
                      )
                    }
                  />
                  <span className="slider"></span>
                </label>
              </div>
            </div>

            <div className="form-group">
              <div className="input-field">
                <label>User Galleries</label>
                {/* <div className="image-preview-multiple">
                  {formik.values.userGalleriesPreview.map((item, index) => (
                    <img
                      key={index}
                      src={item.gallery_thumbnail}
                      alt="Gallery"
                      height="60"
                    />
                  ))}
                </div> */}
                <input
                  type="file"
                  name="userGalleries"
                  className="ps-0"
                  multiple
                  onChange={(event) =>
                    formik.setFieldValue("userGalleries", event.currentTarget.files)
                  }
                />
                {formik.touched.userGalleries && formik.errors.userGalleries && (
                  <div className="text-danger">{formik.errors.userGalleries}</div>
                )}
              </div>

              <div className="input-field">
                <label>User Pictures</label>
                {/* <div className="image-preview-multiple">
                  {formik.values.userPicturesPreview.map((item, index) => (
                    <img
                      key={index}
                      src={item.thumbnail}
                      alt="Gallery"
                      height="60"
                    />
                  ))}
                </div> */}

                <input
                  type="file"
                  name="userPictures"
                  className="ps-0"
                  multiple
                  onChange={(event) =>
                    formik.setFieldValue("userPictures", event.currentTarget.files)
                  }
                />

                {formik.touched.userPictures && formik.errors.userPictures && (
                  <div className="text-danger">{formik.errors.userPictures}</div>
                )}
              </div>

            </div>

            <div className="button-group">
              <button type="submit" className="submit" disabled={addloading}>
                {
                  `${id ? 'Update' : 'Submit'}`
                }
              </button>
              <button onClick={handleCancel} type="button" className="cancel">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddEditUser;
