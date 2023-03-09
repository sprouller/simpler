import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import refreshIcon from "../images/refreshIcon.svg";
import empSvg from "../images/employeeSvg.svg";
import plusIconWhite from "../images/plusIconWhite.svg";
import AddResourceModal from "./AddResourceModal";
import EmpProfile from "./EmpProfile";

function CompProfile({ sprints, clients, cred, empData }) {
  const [parseCred, setParseCred] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSpecificClt, setIsSpecificCltSet] = useState(false);
  const [specificClt, setSpecificClt] = useState({});
  const [jobRelatedToEmp, setJobRelatedToEmp] = useState([]);
  const [showResourceForm, setShowResourceForm] = useState(false);
  const [showEmpProfile, setShowEmpProfile] = useState(false);
  const [empId, setEmpId] = useState("");
  const [viewedEmp, setViewedEmp] = useState({});
  const navigate = useNavigate();

  const getSpecificClt = () => {
    // setIsLoaded(!isLoaded);
    isLoaded === true &&
      clients?.forEach((clt) => {
        if (clt?.id === parseCred?.clientDetails[0]) {
          setSpecificClt(clt);
          setIsSpecificCltSet(true);
        }
      });
  };

  const getEmpDetails = () => {
    if (isSpecificClt === true) {
      let filteredData = sprints.filter((data) => {
        if (data?.job?.client?.id === specificClt?.id) {
          return { jobData: data?.job?.id, empData: data?.employee };
        }
      });
      setJobRelatedToEmp(filteredData);
    }
  };

  useEffect(() => {
    setParseCred(JSON?.parse(cred));
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    getSpecificClt();
  }, [isLoaded]);

  useEffect(() => {
    isSpecificClt === true && getEmpDetails();
  }, [isSpecificClt]);

  const handleEmpClick = (data) => {
    setEmpId(data?.employee?.id);
    setShowEmpProfile(!showEmpProfile);
  };

  const handleSelectedEmp = (data) => {
    setViewedEmp(data);
  };

  return (
    <>
      <div className="clientPage compProfile">
        <div className="header__clientPage header__compProfile">
          <div className="d-flex" style={{ alignItems: "center" }}>
            <Link to="/signin" style={{ width: "fit-content" }}>
              {Object.keys(parseCred)?.length > 0 && (
                <div className="userDetails__sideBar">
                  <p>{parseCred?.email?.slice(0, 1)}</p>
                </div>
              )}
            </Link>
            <p className="header__clientPageTitle">{specificClt?.name}</p>
          </div>
          <div className="d-flex">
            <button
              className="button__signIn btn-newClient-header__clientPage signOutBtn__compProfile"
              onClick={() => {
                localStorage.setItem("userCred", "");
                // window.location.reload();
                navigate(0);
              }}
            >
              Sign out
            </button>
            <div className="refreshIcon-header__clientPage">
              <img
                src={refreshIcon}
                alt="refresh icon"
                onClick={() => getSpecificClt()}
              />
            </div>
          </div>
        </div>
        <div
          className="detailsContainer__clientPage"
          style={{ marginRight: "0", marginTop: "10px" }}
        >
          <div className="projectBased-detailsContainer__clientPage commonContainer-detailsContainer__clientPage">
            <p>Performance tracker</p>
          </div>
          <div
            className="d-flex retainerBased-detailsContainer__clientPage "
            style={{ width: "50%" }}
          >
            <div
              className="d-flex "
              style={{ width: "100%", flexDirection: "column" }}
            >
              <div
                className=" commonContainer-detailsContainer__clientPage"
                style={{
                  width: "100%",
                  overflow: "hidden",
                  height: "62vh",
                }}
              >
                <div
                  className="d-flex"
                  style={{
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <p>Employees</p>
                  <button
                    onClick={() => setShowResourceForm(!showResourceForm)}
                    className="btn-newClient-header__clientPage"
                  >
                    <img src={plusIconWhite} alt="plus icon white" />
                    Add resources
                  </button>
                </div>
                <div className="d-flex empCont__CompProfile">
                  {jobRelatedToEmp?.map((data) => {
                    return (
                      <div
                        className="emp-empCont__CompProfile"
                        onClick={() => handleEmpClick(data)}
                        key={data?.id}
                      >
                        <img
                          src={empSvg}
                          alt="empImage"
                          style={{
                            backgroundColor: `${data?.employee?.colour}80`,
                          }}
                        />
                        <div className="details-emp-empCont__CompProfile">
                          <p style={{ fontWeight: "600" }}>
                            {data?.employee?.firstName?.length > 0
                              ? data?.employee?.firstName
                              : "NAMXXX"}
                          </p>
                          <p>
                            {data?.job?.name?.length
                              ? data?.job?.name
                              : "Job name"}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div
                className=" commonContainer-detailsContainer__clientPage mt-3"
                style={{ height: "15vh", width: "100%" }}
              >
                <div
                  className="d-flex"
                  style={{
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <p>Company information</p>
                  <button className="btn-newClient-header__clientPage">
                    Edit information
                  </button>
                </div>
                <div className="d-flex">
                  {specificClt?.address ? (
                    <p
                      style={{
                        fontSize: "12px",
                        width: "50%",
                      }}
                    >
                      {specificClt?.address}
                    </p>
                  ) : (
                    <p
                      style={{
                        fontSize: "12px",
                        width: "50%",
                      }}
                    >
                      Address not available
                    </p>
                  )}
                  {parseCred?.email ? (
                    <p
                      style={{
                        fontSize: "12px",
                        width: "50%",
                        textAlign: "end",
                      }}
                    >
                      {parseCred?.email}
                    </p>
                  ) : (
                    <p
                      style={{
                        fontSize: "12px",
                        width: "50%",
                        textAlign: "end",
                      }}
                    >
                      email not available
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* add resource modal */}
      <>
        {showResourceForm && (
          <AddResourceModal
            setShowResourceForm={setShowResourceForm}
            showResourceForm={showResourceForm}
            viewedEmp={viewedEmp}
            setViewedEmp={setViewedEmp}
          />
        )}
        {showEmpProfile && (
          <EmpProfile
            showEmpProfile={showEmpProfile}
            empId={empId}
            empData={empData}
            setShowEmpProfile={setShowEmpProfile}
            setShowResourceForm={setShowResourceForm}
            showResourceForm={showResourceForm}
            setViewedEmp={setViewedEmp}
            handleSelectedEmp={handleSelectedEmp}
          />
        )}
      </>
    </>
  );
}

export default CompProfile;
