import React, { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchCred } from "../controller/Airtable";
const SignIn = ({ setUserDetails }) => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [cred, setCred] = useState([]);
  const [currUser, setCurrUser] = useState({});
  const navigate = useNavigate();

  const handleSignIn = (e) => {
    e.preventDefault();

    if (email && pass) {
      cred.forEach((data) => {
        if (data.email === email && data.password === pass) {
          setSuccess("Valid credentials");
          localStorage.setItem(
            "userCred",
            JSON.stringify({
              email: email,
              pass: pass,
              type: data.type,
            })
          );
          setEmail("");
          setPass("");
          setSuccess("");
          setUserDetails(true);
          navigate("/");
        } else {
          setError("Enter valid credentials");
        }
      });
    }
  };

  const handleLogOut = () => {
    localStorage.setItem("userCred", JSON.stringify(""));
    setCurrUser(JSON.parse(localStorage.getItem("userCred")));
    setUserDetails(false);
    navigate("/");
  };

  useEffect(() => {
    setCurrUser(JSON.parse(localStorage.getItem("userCred")));
  }, [email, pass]);

  useEffect(() => {
    fetchCred().then((eachCred) => {
      setCred(eachCred);
    });
  }, []);

  console.log("outer =>", error);
  console.log("curr", currUser);
  return (
    <div className="my-calendar signIn">
      {Object.keys(currUser)?.length > 0 ? (
        <div className="loggedInDetailsCont__signIn">
          <p>{currUser?.email}</p>
          <button
            className="button__signIn btn-newClient-header__clientPage"
            onClick={handleLogOut}
          >
            logout
          </button>
        </div>
      ) : (
        <form onSubmit={(e) => handleSignIn(e)}>
          {success?.length > 0 ? (
            <p className="success-message__signIn">{success}</p>
          ) : (
            <p className="error-message__signIn">{error}</p>
          )}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="email"
            placeholder="Email"
          />

          <input
            type="password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            className="password"
            placeholder="Password"
          />

          <button
            type="submit"
            className="button__signIn btn-newClient-header__clientPage"
          >
            Sign in
          </button>
        </form>
      )}
    </div>
  );
};

export default SignIn;
