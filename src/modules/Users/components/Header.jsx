import React, { useState, useRef } from 'react';
import { FaUserNinja } from 'react-icons/fa';
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import useOutsideClick from '../../../hooks/useOutSideClick';
import axiosApi from '../../../services/Api';
import Cookies, { cookieKeys } from "../../../services/cookies";
import { setAuthorized } from '../../../redux/authentication/authSlice';
import UserListing from './UserListing';

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const username = localStorage.getItem('username');
  const profilePic = localStorage.getItem('profile_pic');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useOutsideClick([dropdownRef], () => setIsDropdownOpen(false));

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleLogout = async () => {
    try {
      await axiosApi.get('/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.clear();
      Cookies.remove(cookieKeys.Token);
      dispatch(setAuthorized(false));
      navigate('/login');
    }
  };

  return (
    <>
    <header className="header">
      <div className="header-left">
        <span className="header-text">User Management</span>
      </div>

      <div className="header-right" ref={dropdownRef} onClick={toggleDropdown}>
        <span className="greeting" >
          Hi, <strong>{username}</strong>
        </span>
        <div className="avatar">
          {profilePic ? (<img src={profilePic} alt="Profile" />)
          : (
          <FaUserNinja size={20} color="white" />)}
        </div>

        {isDropdownOpen && (
          <div className="dropdown">
            <div className="dropdown__item" onClick={handleLogout}>
              Sign out
            </div>
          </div>
        )}
      </div>
    </header>

    </>
  );
};

export default Header;
