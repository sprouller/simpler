import React, { useEffect, useState } from "react";
import { Col, Modal, ModalBody, ModalHeader, Row, Form } from "react-bootstrap";
import closeIcon from "../images/closeIcon.svg";
import cake from "../images/cake.png";
import cal from "../images/cal.png";
import call from "../images/call.png";
import start from "../images/start.png";
import location from "../images/location.png";
import AddResourceModal from "./AddResourceModal";

export let ourEmpData = {};

function EmpProfile({
  setShowEmpProfile,
  showEmpProfile,
  empId,
  empData,
  showResourceForm,
  setShowResourceForm,
  setViewedEmp,
}) {
  const [activeBtn, setActiveBtn] = useState(false);
  const [ourEmp, setOurEmp] = useState([]);

  const handlEmpDetails = () => {
    const filteredData = empData?.filter((data) => data?.id === empId);
    setOurEmp(filteredData[0]);
  };
  useEffect(() => {
    handlEmpDetails();
  }, []);
  console.log(ourEmp);
  return (
    <>
      <Modal show={showEmpProfile} className="createNewClient">
        <ModalHeader className="header__CNC">
          <h2 className="header__clientPageTitle">Employee information</h2>

          <div
            className="colorCont__addResModal d-flex"
            style={{ width: "35%", justifyContent: "space-between" }}
          >
            <button
              className=" btn-newClient-header__clientPage"
              style={{ backgroundColor: "#9d9d9d" }}
              onClick={() => {
                setShowResourceForm(!showResourceForm);
                ourEmpData = ourEmp;
                // localStorage.setItem("empDetails", JSON.stringify(ourEmp));
                // setShowEmpProfile(!showEmpProfile);
              }}
            >
              edit
            </button>
            <button className=" btn-newClient-header__clientPage">save</button>
            <button
              className="closeIconBtn"
              onClick={() => setShowEmpProfile(!showEmpProfile)}
            >
              <img src={closeIcon} alt="close icon" />
            </button>
          </div>
        </ModalHeader>
        <ModalBody>
          <Form onSubmit={(e) => e.preventDefault()}>
            <Row className="mb-3">
              <Col>
                <div
                  className="btnGroup-header__clientPage"
                  style={{ width: "fit-content" }}
                >
                  <button
                    onClick={() => setActiveBtn(false)}
                    style={
                      activeBtn === false
                        ? { backgroundColor: "#20e29f", fontWeight: "600" }
                        : { backgroundColor: "#d8d2d1" }
                    }
                  >
                    Job information
                  </button>
                  <button
                    onClick={() => setActiveBtn(true)}
                    style={
                      activeBtn === true
                        ? { backgroundColor: "#20e29f", fontWeight: "600" }
                        : { backgroundColor: "#d8d2d1" }
                    }
                  >
                    Time tracking
                  </button>
                </div>
              </Col>
            </Row>
            <>
              {!activeBtn ? (
                <div className="personCont__empProfile">
                  <div className="profile-personCont__empProfile">
                    <img
                      src="https://image.cnbcfm.com/api/v1/image/106930629-1629399630371-gettyimages-494691340-87856868.jpeg?v=1629399760&w=740&h=416&ffmt=webp&vtcrop=y"
                      alt="empImage"
                      className="personImage"
                    />
                    <div>
                      <h2>
                        {ourEmp?.firstName ? ourEmp?.firstName : "Jack ford"}
                      </h2>
                      <h5>{ourEmp?.title ? ourEmp?.title : "title"}</h5>
                      <div className="Cont__empProfile">
                        <div className="commonCont-personCont__empProfile">
                          <div className="common-personCont__empProfile">
                            <img src={call} alt="call" />
                            <p>
                              {ourEmp?.number ? ourEmp?.number : "9999999999"}
                            </p>
                          </div>
                          <div className="common-personCont__empProfile">
                            <img src={start} alt="start" />
                            <p>
                              {ourEmp?.startedDate
                                ? ourEmp?.startedDate
                                : "18/12/23"}
                            </p>
                          </div>
                        </div>
                        <div className="commonCont-personCont__empProfile">
                          <div className="common-personCont__empProfile">
                            <img src={cake} alt="call" />
                            <p>
                              {ourEmp?.dateOfBirth
                                ? ourEmp?.dateOfBirth
                                : "18/12/23"}
                            </p>
                          </div>
                          <div className="common-personCont__empProfile">
                            <img src={cal} alt="start" />
                            <p>
                              {" "}
                              {ourEmp?.holiday ? ourEmp?.holiday : "XX days"}
                            </p>
                          </div>
                        </div>

                        <div className="commonCont-personCont__empProfile">
                          <div className="common-personCont__empProfile">
                            <img src={location} alt="call" />
                            <p>
                              {ourEmp?.address
                                ? ourEmp?.address
                                : " 1w4dBoxworks Clocktower Yard Temple Gate Bristol BS1 6QH"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="disCont-personCont__empProfile">
                    <p>
                      {ourEmp?.description
                        ? ourEmp?.description
                        : "description"}
                    </p>
                  </div>
                </div>
              ) : (
                ""
              )}
            </>
          </Form>
        </ModalBody>
      </Modal>
      {showResourceForm && <AddResourceModal ourEmp={ourEmp} />}
    </>
  );
}

export default EmpProfile;
