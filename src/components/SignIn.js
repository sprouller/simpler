import React, { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchCred,
  fetchSprints,
  fetchClients,
  fetchEmployees,
} from "../controller/Airtable";
import CompProfile from "./CompProfile";
const SignIn = ({ setUserDetails, userDetails, allClt }) => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [cred, setCred] = useState([]);
  const [client, setAllClt] = useState(null);
  const [currUser, setCurrUser] = useState({});
  const [sprints, setSprints] = useState([]);
  const [empData, setEmpData] = useState([]);
  const navigate = useNavigate();
  console.log("signinAllclt", allClt);
  // const userEmail = JSON.parse(localStorage.getItem("userCred"))?.email;

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
              type: data?.type,
              clientDetails: data?.clientDetails,
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
    localStorage.setItem("userCred", "");
    setCurrUser(localStorage.getItem("userCred"));
    setUserDetails(false);
    navigate("/");
  };

  useEffect(() => {
    setCurrUser(localStorage.getItem("userCred"));
    fetchSprints()
      .then((data) => setSprints(data))
      .catch((e) => console.log(e));
    fetchCred()
      .then((eachCred) => {
        setCred(eachCred);
      })
      .catch((e) => console.log("cred not available"));

    fetchEmployees()
      .then((eachCred) => {
        setEmpData(eachCred);
      })
      .catch((e) => console.log("cred not available"));

    fetchClients().then((clientsFromAirtable) => {
      setAllClt(clientsFromAirtable);
      // setLoaded(!loaded);
    });
  }, []);
  console.log(sprints);

  console.log("curruser", currUser);

  return (
    <div className="my-calendar signIn">
      {Object?.keys(currUser)?.length > 0 ? (
        <>
          {sprints?.length > 0 && client && (
            <CompProfile
              sprints={sprints}
              userDetails={userDetails}
              handleLogOut={handleLogOut}
              clients={client}
              cred={currUser}
              empData={empData}
            />
          )}
        </>
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
