import React, { useEffect, useState } from "react";
import { Form, Link } from "react-router-dom";
import { fetchClients } from "../controller/Airtable";
import refreshIcon from "../images/refreshIcon.svg";
import plusIconWhite from "../images/plusIconWhite.svg";
import { Col, Modal, ModalBody, ModalHeader, Row } from "react-bootstrap";
import AddResourceModal from "./AddResourceModal";
import EmpProfile from "./EmpProfile";

function CompProfile({ handleLogOut, sprints, clients, cred, empData }) {
  const [parseCred, setParseCred] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSpecificClt, setIsSpecificCltSet] = useState(false);
  const [specificClt, setSpecificClt] = useState({});
  const [jobRelatedToEmp, setJobRelatedToEmp] = useState([]);
  const [showResourceForm, setShowResourceForm] = useState(false);
  const [showEmpProfile, setShowEmpProfile] = useState(false);
  const [empId, setEmpId] = useState("");
  const [viewedEmp, setViewedEmp] = useState({});
  console.log(sprints);
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
      console.log("filtered", filteredData, sprints);
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

  console.log(empId);
  return (
    <>
      {/*
      // logoutBtn
      <button
        // className="button__signIn btn-newClient-header__clientPage"
        onClick={handleLogOut}
      ></button> */}
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
          <div className="refreshIcon-header__clientPage">
            <img
              src={refreshIcon}
              alt="refresh icon"
              onClick={() => getSpecificClt()}
            />
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
                          src="https://image.cnbcfm.com/api/v1/image/106930629-1629399630371-gettyimages-494691340-87856868.jpeg?v=1629399760&w=740&h=416&ffmt=webp&vtcrop=y"
                          alt="empImage"
                        />
                        <div className="details-emp-empCont__CompProfile">
                          <p style={{ fontWeight: "600" }}>
                            {data?.employee?.firstName}
                          </p>
                          <p>{data?.job?.name}</p>
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
          />
        )}
      </>
    </>
  );
}

export default CompProfile;
