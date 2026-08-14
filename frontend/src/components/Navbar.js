import "./Navbar.css";

import { NavLink, Link } from "react-router-dom";
import {
  BsSearch,
  BsHouseDoorFill,
  BsFillPersonFill,
  BsFillCameraFill,
  BsBoxArrowRight,
} from "react-icons/bs";
import { useSelector, useDispatch } from "react-redux";
// hooks
import { useAuth } from "../hooks/useAuth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const { auth } = useAuth();

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.reload();
  };

  return (
    <header className="navbar">
      <div className="navbar__content">
        <Link to="/" className="navbar__brand" aria-label="ReactGram home">
          <span className="navbar__brandIcon">
            <BsFillCameraFill />
          </span>
          <span className="navbar__brandText">ReactGram</span>
        </Link>

        <nav className="navbar__links" aria-label="Main navigation">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `navbar__link${isActive ? " navbar__link--active" : ""}`
            }
          >
            <BsHouseDoorFill />
            <span>Home</span>
          </NavLink>

          {user ? (
            <div className="navbar__user">
              <span className="navbar__userBadge">{user.name}</span>

              <NavLink
                to={`/users/${user._id || "profile"}`}
                className="navbar__userLink"
              >
                <BsFillPersonFill />
                <span>Profile</span>
              </NavLink>
              <NavLink to="/profile" className="navbar__userLink">
                <span className="navbar__brandIcon">
                  <BsFillCameraFill />
                </span>
              </NavLink>

              <button
                type="button"
                onClick={handleLogout}
                className="navbar__logoutLink"
              >
                <BsBoxArrowRight />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `navbar__link${isActive ? " navbar__link--active" : ""}`
                }
              >
                <BsFillPersonFill />
                <span>Sign in</span>
              </NavLink>

              <NavLink
                to="/register"
                className={({ isActive }) =>
                  `navbar__link navbar__link--primary${isActive ? " navbar__link--active" : ""}`
                }
              >
                <BsFillCameraFill />
                <span>Create account</span>
              </NavLink>
            </>
          )}
        </nav>

        {!user && (
          <button className="navbar__search" type="button" aria-label="Search">
            <BsSearch />
          </button>
        )}
      </div>
    </header>
  );
};

export default Navbar;
