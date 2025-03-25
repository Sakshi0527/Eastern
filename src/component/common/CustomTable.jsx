import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTable } from "react-table";
import useOutsideClick from "../../hooks/useOutSideClick";
import {
  deleteMultipleUsers,
  getRoles,
  getUsers,
} from "../../redux/user/userSlice";

const Row = ({ row, i }) => {
  return (
    <tr key={i}>
      {row?.cells?.map((cell, index) => {
        return (
          <td key={index} {...cell.getCellProps()}>
            {cell.render("Cell")}
          </td>
        );
      })}
    </tr>
  );
};

export const Pagination = ({
  pagination,
  handlePrevious,
  handleNext,
  handleSizeChange,
  showSizePerPage,
  handlePageDropdown,
  paginationRef,
}) => {
  return (
    <div className="pagenum_content d-flex gap-4">
      <div className="record_page d-flex align-items-center">
        <span style={{ color: "#29b4e6" }}>Rows Per Page:</span>
        <div className="dropdown dropup ms-3">
          <button
            type="button"
            className={`btn dropdown-toggle ${showSizePerPage ? "show" : ""}`}
            onClick={() => handlePageDropdown()}
            style={{ border: "1px solid #29b4e6" }}
          >
            {pagination?.sizePerPage}
          </button>
          <ul
            className={`dropdown-menu table_dropdown ${
              showSizePerPage ? "show page_dropdown" : ""
            }`}
            ref={paginationRef}
            style={{ minWidth: "fit-content" }}
          >
            {pagination?.sizePerPageList?.map((pageSize, index) => {
              return (
                <li
                  key={index}
                  onClick={() => handleSizeChange(pageSize)}
                  className="dropdown-item"
                >
                  <span>{pageSize}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      <div className="pagenate_main d-flex align-items-center">
        <div className="pagenate_show" style={{ color: "#29b4e6" }}>
          {pagination?.totalSize === 0
            ? 0
            : (pagination?.page - 1) * pagination?.sizePerPage + 1}{" "}
          -
          {pagination?.page * pagination?.sizePerPage <= pagination?.totalSize
            ? pagination?.page * pagination?.sizePerPage
            : pagination?.totalSize}{" "}
          of {pagination?.totalSize}
        </div>
        <div className="page_arrows d-flex gap-2 ms-2">
          <div className="arrow_page">
            <button
              disabled={pagination?.page === 1}
              onClick={handlePrevious}
              className="border-0 bg-transparent"
              style={{ color: "#29b4e6" }}
            >
              <i className="fa fa-angle-left"></i>
            </button>
          </div>
          <div className="arrow_page">
            <button
              onClick={handleNext}
              disabled={
                pagination?.page * pagination?.sizePerPage >=
                pagination?.totalSize
              }
              className="border-0 bg-transparent"
              style={{ color: "#29b4e6" }}
            >
              <i className="fa fa-angle-right"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const CustomeTable = ({
  columns = [],
  data = [],
  isSearch = "",
  search = "",
  handleSearch = () => {},
  loading,
  pageOptions,
  setPage,
  sortField,
  sortOrder,
  module = "",
  handleAddUser = () => {},
  hanldeExportUser = () => {},
  handlePagination = () => {},
  handleSortBy = () => {},
}) => {
  const [showSizePerPage, setShowSizePerPage] = useState(false);
  const dispatch = useDispatch();
  const paginationRef = useRef();
  const dropdownRef = useRef();
  const { roles } = useSelector((state) => state.user);
  const [roleData, setRoleData] = useState();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);

  const sortOrders = {
    DESC: "DESC",
    ASC: "ASC",
  };

  const handleSelectAll = () => {
    if (selectedRows.length === rows.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(rows.map((row) => row?.original?.id));
    }
  };
  const handleRowSelection = (rowId) => {
    setSelectedRows((prevSelectedRows) =>
      prevSelectedRows.includes(rowId)
        ? prevSelectedRows.filter((id) => id !== rowId)
        : [...prevSelectedRows, rowId]
    );
  };

  const handleDeleteMultiple = () => {
    if (selectedRows.length === 0) return;
    dispatch(
      deleteMultipleUsers({
        ids: selectedRows,
        cb: () => {
          setSelectedRows([]);
          dispatch(
            getUsers({
              page: 1,
              per_page: 5,
              search: search,
              filter: "",
              sort: "",
              order_by: "",
            })
          );
        },
      })
    );
  };

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data: Array.isArray(data) ? data : [],
      manualSortBy: true,
    });
  const handleSort = (sortBy) => {
    let order = sortOrder === sortOrders.ASC ? sortOrders.DESC : sortOrders.ASC;
    handleSortBy(sortBy, order);
  };
  const handleNext = () => {
    handlePagination({ ...pageOptions, page: pageOptions.page + 1 });
  };
  const handlePrevious = () => {
    handlePagination({ ...pageOptions, page: pageOptions.page - 1 });
  };
  const handleSizeChange = (pageRecord) => {
    handlePagination({ ...pageOptions, sizePerPage: pageRecord });
    setShowSizePerPage(false);
    setPage(1);
  };
  const handlePageDropdown = () => {
    setShowSizePerPage(!showSizePerPage);
  };
  useOutsideClick([paginationRef, dropdownRef], () => {
    setShowSizePerPage(false);
    setIsDropdownOpen(false);
  });


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

  const role = useMemo(() => {
    return roles?.map((item) => {
      return { id: item?.id, name: item?.name };
    });
  }, [roles]);

  const applyFilter = () => {
    const filterData = {
      role_id: [roleData],
    };
    dispatch(
      getUsers({
        page: 1,
        per_page: 10,
        search: search,
        filter: btoa(JSON.stringify(filterData)),
        sort: "",
        order_by: "",
      })
    );
  };
  const resetFilter = () => {
    dispatch(
      getUsers({
        page: 1,
        per_page: 10,
        search: search,
        filter: "",
        sort: "",
        order_by: "",
      })
    );
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        {isSearch ? (
          <div className="position-relative">
            <i className="fa-solid fa-magnifying-glass position-absolute top-50 translate-middle-y ms-3 text-muted"></i>
            <input
              type="text"
              className="form-control ps-5 search-wrapper"
              placeholder="Search"
              value={search}
              onChange={handleSearch}
            />
          </div>
        ) : null}
        <div className="d-flex gap-2 me-3">
          <div className="dropdown">
            <button
              className="btn btn-primary filter filter-btn dropdown-toggle"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <i className="fa-solid fa-filter fa-2xs"></i>
            </button>
            <ul
              className={`dropdown-menu ${isDropdownOpen ? "show" : ""}`}
              style={{ width: "240px" }}
              ref={dropdownRef}
            >
              <select
                name="role_id"
                className="form-control"
                style={{ width: "220px", margin: "10px" }}
                onChange={(e) => setRoleData(e.target.value)}
              >
                <option value="">Select Role</option>
                {role?.map((item, index) => (
                  <option value={item.id} key={index}>
                    {item.name}
                  </option>
                ))}
              </select>
              <div className="row ps-4 d-flex gap-2 mt-4">
                <button
                  onClick={() => {
                    applyFilter();
                    setIsDropdownOpen(false);
                  }}
                  className="filter_wrapper"
                >
                  Apply filter
                </button>
                <button
                  onClick={() => {
                    resetFilter();
                    setIsDropdownOpen(false);
                  }}
                  className="filter_wrapper"
                >
                  Reset filter
                </button>
              </div>
            </ul>
          </div>
          <button
            onClick={handleAddUser}
            className="btn filter"
            style={{ backgroundColor: "#007190", color: "white" }}
          >
            <i className="fa-solid fa-plus"></i>
          </button>
          <button onClick={hanldeExportUser} className="btn filter p-0">
            <i className="fa-solid fa-download"></i>
          </button>
          <button className="btn btn-primary filter filter-btn">
            <i className="fa-solid fa-eye"></i>
          </button>
          {selectedRows.length > 0 && (
            <button
              onClick={handleDeleteMultiple}
              className="btn btn-primary filter filter-btn"
            >
              <i className="fa-solid fa-trash"></i>
            </button>
          )}
        </div>
      </div>
      <div className="table-responsive w-100">
        <table {...getTableProps()} className="table w-100" id="manage_table">
          <thead>
            {headerGroups?.map((headerGroup, i) => (
              <tr
                key={i}
                {...headerGroup.getHeaderGroupProps()}
                className=""
                style={{ backgroundColor: "#008B9B", color: "white" }}
              >
                <th>
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={
                      selectedRows.length === rows.length && rows.length > 0
                    }
                  />
                </th>
                {headerGroup?.headers?.map((column, index) => {
                  const isCaretEnabled = sortField === column.id;
                  const isUpCaretEnabled =
                    isCaretEnabled && sortOrder === sortOrders.ASC;
                  const isDownCaretEnabled =
                    isCaretEnabled && sortOrder === sortOrders?.DESC;
                  return (
                    <th
                      className={column?.disableSortBy ? "cursor_pointer" : ""}
                      key={index}
                      {...column?.getHeaderProps()}
                      onClick={() =>
                        column?.disableSortBy && handleSort(column.id, module)
                      }
                    >
                      {column?.render("Header")}{" "}
                      {column?.disableSortBy && (
                        <>
                          {isCaretEnabled ? (
                            <>
                              {isUpCaretEnabled && (
                                <i className="fa-solid fa-arrow-up"></i>
                              )}

                              {isDownCaretEnabled && (
                                <i className="fa-solid fa-arrow-down"></i>
                              )}
                            </>
                          ) : (
                            <>
                              <i className="fa-solid fa-arrow-up"></i>
                              <i className="fa-solid fa-arrow-down"></i>
                            </>
                          )}
                        </>
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {!loading ? (
              !!rows?.length ? (
                rows?.map((row, index) => {
                  prepareRow(row);
                  return (
                    <tr key={index} {...row.getRowProps()}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedRows.includes(row?.original?.id)}
                          onChange={() => handleRowSelection(row?.original?.id)}
                        />
                      </td>
                      {row.cells.map((cell, i) => (
                        <td key={i} {...cell.getCellProps()}>
                          {cell.render("Cell")}
                        </td>
                      ))}
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={
                      !!rows?.length ? columns.length + 1 : columns.length
                    }
                    className="text-center"
                  >
                    No data available
                  </td>
                </tr>
              )
            ) : (
              <tr>
                <td
                  colSpan={!!rows.length ? columns.length + 1 : columns.length}
                  className="p-0"
                >
                  <div className="linear-loader"></div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="paginate d-flex justify-content-end">
        <Pagination
          pagination={pageOptions}
          handleNext={handleNext}
          handlePrevious={handlePrevious}
          handleSizeChange={handleSizeChange}
          showSizePerPage={showSizePerPage}
          handlePageDropdown={handlePageDropdown}
          paginationRef={paginationRef}
        />
      </div>
    </>
  );
};

export default CustomeTable;
