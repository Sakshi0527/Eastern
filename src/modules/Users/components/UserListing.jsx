import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CustomeTable from "../../../component/common/CustomTable";
import { getUsers, userExport } from "../../../redux/user/userSlice";
import { RouteConstants } from "../../../routes/RouteConstants";
import axiosApi from "../../../services/Api";
import ViewUserDetails from "../modals/ViewUserDetailsModal";
import useDebounce from "../../../hooks/useDebounce";
import  Cookies,{ cookieKeys } from "../../../services/cookies";
import axios from "axios";
import Loader from "../../../component/common/Loader";

const API_URL = import.meta.env.VITE_API_URL;

const UserListing = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { users, userloading, error, userCount } = useSelector(
    (state) => state.user
  );
  const [showModal, setShowModal] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [page, setPage] = useState(1);
  const [sizePerPage, setSizePerPage] = useState(5);
  const [sort, setSort] = useState("name");
  const [order_by, setOrder_by] = useState("ASC");
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500); 

  useEffect(() => {
    dispatch(
      getUsers({
        page: page,
        per_page: sizePerPage,
        search: debouncedSearch,
        filter: "",
        sort: sort,
        order_by: order_by,
      })
    );
  }, [dispatch, order_by, page, sizePerPage, sort, debouncedSearch]);

  const fetchUserDetails = async (id) => {
    try {
      const response = await axiosApi.get(`/users/${id}`);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching user details:", error);
      return null;
    }
  };
  
  const handleView = async (id) => {
    setLoadingDetails(true);
    setShowModal(true);
    const data = await fetchUserDetails(id);
    setUserDetails(data);
    setLoadingDetails(false);
  };
  

  const handleAddUser = () => {
    navigate(RouteConstants.ADD_USER);
  }
  const hanldeExportUser = async () => {
    try {
      const resultAction = await dispatch(
        userExport({
          page: 1,
          per_page: 10,
          search: debouncedSearch,
          filter: "",
          sort: "name",
          order_by: "asc",
        })
      );
  
      if (userExport.fulfilled.match(resultAction)) {
        const blob = new Blob([resultAction.payload], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
  
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'users.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } else {
        console.error("Export failed:", resultAction.payload);
      }
    } catch (error) {
      console.error("An error occurred during export:", error);
    }
  };
  
  const handleDelete = async (id) => {
    try {
     await axiosApi.delete(`/users/${id}`);
    
      dispatch(
        getUsers({
          page: 1,
          per_page: 10,
          search: debouncedSearch,
          filter: "",
          sort: "name",
          order_by: "asc",
        })
      );
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const columns = [
    {
      id: "name",
      Header: "Name",
      disableSortBy: true,
      accessor: (row) => <span>{row?.name}</span>,
    },
    {
      id: "email",
      Header: "Email",
      disableSortBy: true,
      accessor: (row) => <span>{row?.email}</span>,
    },
    {
      id: "role",
      Header: "Role",
      disableSortBy: false,
      accessor: (row) => <span>{row?.role?.name}</span>,
    },
    {
      id: "dob",
      Header: "Dob",
      disableSortBy: false,
      accessor: (row) => <span>{row?.dob}</span>,
    },
    {
      id: "gender",
      Header: "Gender",
      disableSortBy: false,
      accessor: (row) => <span>{row?.gender_text}</span>,
    },
    {
      id: "status",
      Header: "Status",
      disableSortBy: false,
      accessor: (row) => <span>{row?.status_text}</span>,
    },
    {
      id: "action",
      Header: "Action",
      disableSortBy: false,
      accessor: (row) => (
        <div className="d-flex gap-3">
          <div onClick={() => handleView(row.id)}>
            <i
              className="fa-solid fa-eye"
              style={{ color: "#0000008a", cursor: "pointer" }}
            ></i>
          </div>
          <div onClick={() => handleEdit(row.id)}>
            <i
              className="fa-solid fa-pencil"
              style={{ color: "#0000008a" , cursor :"pointer" }}
            ></i>
          </div>
          <div onClick={() => handleDelete(row.id)}>
            <i className="fa-solid fa-trash" style={{ color: "#0000008a" , cursor :"pointer" }}></i>
          </div>
        </div>
      ),
    },
  ];
  
  const handleEdit = async (id) => {
    const data = await fetchUserDetails(id);
    if (data) {
      navigate(`${RouteConstants.EDIT_USER}/${id}`, {
        state: { userDetail: data }
      });
    }
  };
  
  const pageOptions = useMemo(
    () => ({
      page: page,
      sizePerPage: sizePerPage,
      totalSize: userCount,
      sizePerPageList: [5, 10, 20, 50],
    }),
    [page, sizePerPage, userCount]
  );

  const handlePagination = ({ page, sizePerPage }) => {
    setPage(page);
    setSizePerPage(sizePerPage);
  };

  const handleSort = (sort, order_by) => {
    setSort(sort);
    setPage(1);
    setOrder_by(order_by);
  };
  
  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  return (
    <div className="user-page">
      <div className="user-container">
        <div className="tabs">
          <button className="tab active">Listing</button>
          <button className="tab">Import</button>
          <button className="tab">Import Zip</button>
        </div>
        
          <CustomeTable 
            columns={columns} 
            data={users || []} 
            module="Users" 
            handleAddUser={handleAddUser} 
            hanldeExportUser={hanldeExportUser}
            pageOptions={pageOptions}
            handlePagination={handlePagination}
            setPage={setPage}
            handleSortBy={handleSort}
            sortField={sort}
            sortOrder={order_by}
            isSearch={true}
            search={search}
            handleSearch={handleSearch}
            loading={userloading}
            />

        <ViewUserDetails
          show={showModal}
          onHide={() => setShowModal(false)}
          userDetails={userDetails}
          loading={loadingDetails}
        />
      </div>
    </div>
  );
};

export default UserListing;
