import React, { useEffect, useState } from "react";
import { Col, Modal, ModalBody, ModalHeader, Row, Form } from "react-bootstrap";
import closeIcon from "../images/closeIcon.svg";
import employeeSvg from "../images/employeeSvg.svg";
import cake from "../images/cake.png";
import cal from "../images/cal.png";
import call from "../images/call.png";
import start from "../images/start.png";
import location from "../images/location.png";
import AddResourceModal from "./AddResourceModal";

function EmpProfile({
  setShowEmpProfile,
  showEmpProfile,
  empId,
  empData,
  showResourceForm,
  setShowResourceForm,

  handleSelectedEmp,
}) {
  const [activeBtn, setActiveBtn] = useState(false);
  const [ourEmp, setOurEmp] = useState([]);

  const handlEmpDetails = () => {
    const filteredData = empData?.filter((data) => data?.id === empId);
    setOurEmp(filteredData[0]);
    handleSelectedEmp(filteredData[0]);
  };
  useEffect(() => {
    handlEmpDetails();
  }, []);
  console.log("OurEmp", ourEmp);
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
                handleSelectedEmp(ourEmp);
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
                      src={employeeSvg}
                      alt="empImage"
                      className="personImage"
                      style={{ backgroundColor: `${ourEmp?.colour}80` }}
                    />
                    <div>
                      <h2>{ourEmp?.firstName ? ourEmp?.firstName : "NAME"}</h2>
                      <h5>{ourEmp?.title ? ourEmp?.title : "TITLE"}</h5>
                      <div className="Cont__empProfile">
                        <div className="commonCont-personCont__empProfile">
                          <div className="common-personCont__empProfile">
                            <img src={call} alt="call" />
                            <p>{ourEmp?.number ? ourEmp?.number : "Contact"}</p>
                          </div>
                          <div className="common-personCont__empProfile">
                            <img src={start} alt="start" />
                            <p>
                              {ourEmp?.startedDate
                                ? ourEmp?.startedDate
                                : "DD/MM/YY"}
                            </p>
                          </div>
                        </div>
                        <div className="commonCont-personCont__empProfile">
                          <div className="common-personCont__empProfile">
                            <img src={cake} alt="call" />
                            <p>
                              {ourEmp?.dateOfBirth
                                ? ourEmp?.dateOfBirth
                                : "DD/MM/YY"}
                            </p>
                          </div>
                          <div className="common-personCont__empProfile">
                            <img src={cal} alt="start" />
                            <p> {ourEmp?.holiday ? ourEmp?.holiday : "days"}</p>
                          </div>
                        </div>

                        <div className="commonCont-personCont__empProfile">
                          <div className="common-personCont__empProfile">
                            <img src={location} alt="call" />
                            <p>
                              {ourEmp?.address ? ourEmp?.address : "address"}
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
      {showResourceForm && <AddResourceModal handleData={() => ourEmp} />}
    </>
  );
}

export default EmpProfile;
