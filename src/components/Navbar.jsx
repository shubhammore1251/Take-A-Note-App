import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/action/authaction";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.auth?.user);
 
  const handleLogOut = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-warning">
        <div className="container">
          <div className="d-flex nav-brand-div">
            <a className="navbar-brand" href="/">
              <img
                src="weblogo.png"
                height="50"
                alt="Take A Note"
                loading="lazy"
                style={{ marginTop: "-1px" }}
              />
              <span className="brand-name mt-2">Take'A'Note</span>
            </a>

            <img
              src={user?.photoURL}
              className="user-icon d-none"
              alt="user-icon"
            />
          </div>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div
            className="collapse navbar-collapse nav-menu"
            id="navbarSupportedContent"
          >
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-link">
                <Link className="nav-link" aria-current="page" to="/">
                  Notes
                </Link>
              </li>
              <li className="nav-link">
                <Link className="nav-link" to="/addanote">
                  Add-Note
                </Link>
              </li>
            </ul>

            <div className="d-flex button-group ms-5">
              <img src={user?.photoURL} className="user-icon" alt="user-icon" />
              <button
                type="button"
                className="btn log-btn ms-4 mt-2 p-1"
                onClick={handleLogOut}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
