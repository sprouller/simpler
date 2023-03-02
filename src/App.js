import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import "./Responsive.css";

import MyCalendar from "./components/MyCalendar";
import SideNavBar from "./components/SideNavBar";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ClientPage from "./components/ClientPage";
import SpecificClient from "./components/SpecificClient";
import SignIn from "./components/SignIn";
import { useEffect } from "react";

function App() {
  //set theme by navbar and reflect it in app style
  const [myStyle, setMyStyle] = useState({
    "--event-bg-color": "#1164EE",
    "--theme-color": "#5082FF",
    "--today-bg-color": "#c2d2fb",
  });
  const toggleStyle = () => {
    if (myStyle["--theme-color"] === "#5082FF") {
      setMyStyle({
        "--event-bg-color": "#ff6b6b",
        "--theme-color": "#fa5b5b",
        "--today-bg-color": "#ffcaca",
      });
    }
    if (myStyle["--theme-color"] === "#fa5b5b") {
      setMyStyle({
        "--event-bg-color": "#1164EE",
        "--theme-color": "#5082FF",
      });
    }
  };

  const [userDetails, setUserDetails] = useState(false);

  return (
    <BrowserRouter>
      <div className="app" style={myStyle}>
        <SideNavBar userDetails={userDetails} />
        <Routes>
          <Route
            path="/"
            element={<MyCalendar className="p-4" style={myStyle} />}
          />

          <Route path="/client" element={<ClientPage />} />
          <Route path="/client/:id" element={<SpecificClient />} />
          <Route
            path="/signin"
            element={
              <SignIn
                setUserDetails={setUserDetails}
                userDetails={userDetails}
              />
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
