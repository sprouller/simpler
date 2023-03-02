import React, { useEffect, useState } from "react";
import { Col, Modal, ModalBody, ModalHeader, Row, Form } from "react-bootstrap";
import { addNewEmployee } from "../controller/Airtable";
import closeIcon from "../images/closeIcon.svg";
import { ourEmpData } from "./EmpProfile";

function AddResourceModal({
  showResourceForm,
  setShowResourceForm,
  viewedEmp,
}) {
  const [color, setColor] = useState("");
  const [activeBtn, setActiveBtn] = useState(false);
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [num, setNum] = useState(null);
  const [startedDate, setStartedDate] = useState(null);
  const [address, setAddress] = useState("");
  const [dob, setDob] = useState("");
  const [holiday, setHoliday] = useState("");
  const [des, setDes] = useState("");

  const handleSave = () => {
    const resourceData = {
      name,
      des,
      color,
      title,
      num,
      startedDate,
      address,
      dob,
      holiday,
    };
    const utilityData = {
      name,
      des,
      color,
    };

    if (name?.length > 0 && des?.length > 0 && color?.length > 0)
      activeBtn
        ? addNewEmployee(utilityData, activeBtn)
        : addNewEmployee(resourceData, activeBtn);
  };

  useEffect(() => {
    if (!ourEmpData) return;
    setColor(ourEmpData?.colour ? ourEmpData?.colour : "");
    setName(ourEmpData?.firstName ? ourEmpData?.firstName : "");
    setTitle(ourEmpData?.title ? ourEmpData?.title : "");
    setNum(ourEmpData?.number ? ourEmpData?.number : "");
    setStartedDate(ourEmpData?.startedDate ? ourEmpData?.startedDate : "");
    setAddress(ourEmpData?.address ? ourEmpData?.address : "");
    setDob(ourEmpData?.dateOfBirth ? ourEmpData?.dateOfBirth : "");
    setHoliday(ourEmpData?.holiday ? ourEmpData?.holiday : "");
    setDes(ourEmpData?.description ? ourEmpData?.description : "");
  }, []);

  return (
    <>
      <Modal show={showResourceForm} className="createNewClient">
        <ModalHeader className="header__CNC">
          <h2 className="header__clientPageTitle">Add resource</h2>
          <div className="rightPart-header__addResModal">
            <div className="colorCont__addResModal d-flex">
              <p>Calendar colour</p>
              <input
                className="colorInp__addResModal"
                type="color"
                defaultValue={color}
                onChange={(e) => setColor(e.target.value)}
              />
            </div>
            <button
              className=" btn-newClient-header__clientPage"
              onClick={() => {
                handleSave();
                setShowResourceForm(!showResourceForm);
              }}
            >
              save
            </button>
            <button
              className="closeIconBtn"
              onClick={() => {
                setShowResourceForm(!showResourceForm);
              }}
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
                    Add employee
                  </button>
                  <button
                    onClick={() => setActiveBtn(true)}
                    style={
                      activeBtn === true
                        ? { backgroundColor: "#20e29f", fontWeight: "600" }
                        : { backgroundColor: "#d8d2d1" }
                    }
                  >
                    Add utility
                  </button>
                </div>
              </Col>
            </Row>
            {!activeBtn ? (
              <>
                <Row className="mx-2 py-3">
                  <Col className="p-0" style={{ marginRight: "15px" }}>
                    <Form.Group
                      className="mb-1"
                      controlId="startDateInputAdd"
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      <Form.Label
                        style={{ marginRight: "10px", marginBottom: "0" }}
                      >
                        Name
                      </Form.Label>
                      <Form.Control
                        className="commonInpStyleNewJob"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={"Lorem ipsum"}
                      />
                    </Form.Group>
                  </Col>
                  <Col className="p-0">
                    <Form.Group
                      className="mb-1 "
                      controlId="endDateInputAdd"
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      <Form.Label
                        style={{ marginRight: "10px", marginBottom: "0" }}
                      >
                        Title
                      </Form.Label>
                      <Form.Control
                        className="commonInpStyleNewJob"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder={"Title"}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row
                  className="mx-2 py-3"
                  style={{ borderTop: "1px solid #ededed" }}
                >
                  <Col className="p-0" style={{ marginRight: "15px" }}>
                    <Form.Label className="fieldTitle__scheduleNewJobModal">
                      Mobile Number
                    </Form.Label>
                    <Form.Group
                      className="mb-1"
                      controlId="startDateInputAdd"
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      <Form.Control
                        className="commonInpStyleNewJob"
                        type="number"
                        value={num}
                        onChange={(e) => setNum(e.target.value)}
                        placeholder={"07798874601"}
                      />
                    </Form.Group>
                  </Col>
                  <Col className="p-0">
                    <Form.Label className="fieldTitle__scheduleNewJobModal">
                      Started
                    </Form.Label>
                    <Form.Group
                      className="mb-1 "
                      controlId="endDateInputAdd"
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      <Form.Control
                        className="commonInpStyleNewJob"
                        type="text"
                        value={startedDate}
                        onChange={(e) => {
                          setStartedDate(e.target.value);
                        }}
                        onFocus={(e) => (e.target.type = "date")}
                        placeholder="DD/MM/YY"
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row
                  className="mx-2 py-3"
                  style={{ borderTop: "1px solid #ededed" }}
                >
                  <Col className="p-0" style={{ marginRight: "15px" }}>
                    <Form.Label className="fieldTitle__scheduleNewJobModal">
                      Address
                    </Form.Label>
                    <Form.Group
                      className="mb-1"
                      controlId="startDateInputAdd"
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      <Form.Control
                        className="commonInpStyleNewJob"
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder={
                          "14 Boxworks, Clocktower Yard, Temple Gate, Bristol, BS1 6QH"
                        }
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row
                  className="mx-2 py-3"
                  style={{ borderTop: "1px solid #ededed" }}
                >
                  <Col className="p-0" style={{ marginRight: "15px" }}>
                    <Form.Label className="fieldTitle__scheduleNewJobModal">
                      Date of birth
                    </Form.Label>
                    <Form.Group
                      className="mb-1 "
                      controlId="endDateInputAdd"
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      <Form.Control
                        className="commonInpStyleNewJob"
                        type="text"
                        value={dob}
                        onChange={(e) => {
                          setDob(e.target.value);
                        }}
                        onFocus={(e) => (e.target.type = "date")}
                        placeholder="DD/MM/YY"
                      />
                    </Form.Group>
                  </Col>
                  <Col className="p-0">
                    <Form.Label className="fieldTitle__scheduleNewJobModal">
                      Holiday entitlement
                    </Form.Label>
                    <Form.Group
                      className="mb-1"
                      controlId="startDateInputAdd"
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      <Form.Control
                        className="commonInpStyleNewJob"
                        type="number"
                        value={holiday}
                        onChange={(e) => setHoliday(e.target.value)}
                        placeholder={"XX days"}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </>
            ) : (
              <Row className="mx-2 py-3">
                <Col className="p-0" style={{ marginRight: "15px" }}>
                  <Form.Group
                    className="mb-1"
                    controlId="startDateInputAdd"
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    <Form.Label
                      style={{ marginRight: "10px", marginBottom: "0" }}
                    >
                      Name
                    </Form.Label>
                    <Form.Control
                      className="commonInpStyleNewJob"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={"Lorem ipsum"}
                    />
                  </Form.Group>
                </Col>
              </Row>
            )}
            <Row
              className="mx-2 py-3"
              style={{ borderTop: "1px solid #ededed" }}
            >
              <Col className="p-0">
                <Form.Control
                  className="commonInpStyleNewJob"
                  type="text"
                  as="textarea"
                  style={{ height: "100px" }}
                  value={des}
                  onChange={(e) => setDes(e.target.value)}
                  placeholder={"Description"}
                />
              </Col>
            </Row>
          </Form>
        </ModalBody>
      </Modal>
    </>
  );
}

export default AddResourceModal;
