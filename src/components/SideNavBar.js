import React from "react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import calenderSvgGreen from "../images/calender-green.svg";
import clientSvgGreen from "../images/persons-green.svg";
import calenderSvgGray from "../images/calender-gray.svg";
import clientSvgGray from "../images/persons-gray.svg";
import leftArrowSvg from "../images/leftArrow.svg";
import rightArrowSvg from "../images/rightArrow.svg";
import logo from "../images/holla-icon.svg";
import loginSvg from "../images/loginSvg.svg";
import mobileLogo from "../images/holla-mobile-logo.svg";

const Navbar = ({ userDetails }) => {
  const [hover, setHover] = useState(false);
  const location = useLocation();
  const [cred, setCred] = useState({});

  const handleCredDetails = () => {
    setCred(localStorage?.getItem("userCred"));
  };
  useEffect(() => {
    handleCredDetails();
  }, [userDetails]);

  return (
    <nav
      className="side-nav-bar"
      onMouseEnter={() => setHover(true)}
      style={hover ? { width: "250px" } : { width: "82px" }}
    >
      <div className="headerTop-content__container">
        <Link className="logo__sideBar" to="/">
          {hover ? (
            <img className="logo-with-hover" src={logo} alt="holo logo" />
          ) : (
            <img
              className="logo-without-hover"
              src={mobileLogo}
              alt="holo logo"
            />
          )}
        </Link>
        <ul>
          <li>
            <Link
              to="/client"
              style={
                location.pathname === "/client"
                  ? {
                      color: " #20e29f",
                      backgroundColor: "#f5f5f5",
                    }
                  : { color: "#858686", backgroundColor: "transparent" }
              }
              className={`${
                location.pathname === "/client" ? "active-link" : ""
              }${hover === true ? " showArrow" : ""}`}
            >
              {location.pathname === "/client" ? (
                <img src={clientSvgGreen} alt="client svg icon" />
              ) : (
                <img src={clientSvgGray} alt="client svg icon" />
              )}

              {hover && <p>Clients</p>}
            </Link>
          </li>
          <li>
            <Link
              to="/"
              style={
                location.pathname === "/"
                  ? {
                      color: " #20e29f",
                      backgroundColor: "#f5f5f5",
                    }
                  : { color: "#858686", backgroundColor: "transparent" }
              }
              className={`${location.pathname === "/" ? "active-link" : ""}${
                hover === true ? " showArrow" : ""
              }`}
            >
              {location.pathname === "/" ? (
                <img src={calenderSvgGreen} alt="client svg icon" />
              ) : (
                <img src={calenderSvgGray} alt="client svg icon" />
              )}
              {hover && <p>Scheduling</p>}
            </Link>
          </li>
        </ul>
      </div>
      <div>
        <div
          className="headerBottom-content__container"
          onClick={() => setHover(!hover)}
        >
          <div className="image-headerBottom__container">
            {hover ? (
              <img src={leftArrowSvg} alt="left Arrow" />
            ) : (
              <img src={rightArrowSvg} alt="right Arrow" />
            )}
          </div>
        </div>
        <div className="userDetailsCont__sideBar">
          <Link to="/signin" style={{ width: "fit-content" }}>
            {Object?.keys(cred)?.length > 1 ? (
              <div className="userDetails__sideBar">
                <p>{JSON.parse(cred)?.email?.slice(0, 1)}</p>
              </div>
            ) : (
              <img
                className="loginSvgIcon"
                src={loginSvg}
                alt="login svg icon"
              />
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
