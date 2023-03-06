import moment from "moment-timezone";
import React from "react";
import { useState } from "react";
import { Modal, ModalBody, ModalHeader, Col, Row, Form } from "react-bootstrap";
import closeIcon from "../images/closeIcon.svg";
import { addOutOfOfficeData } from "../controller/Airtable";

function OutOfOfficeModal({ showOutOfficeModal, outOfOfficeModal, employees }) {
  const [selectedEmp, setSelectedEmp] = useState("");
  const [start, setstart] = useState("");
  const [end, setend] = useState("");
  const [radioVal, setRadioVal] = useState("");
  const [description, setDescription] = useState("");

  const DateConverter = (e) => {
    if (e) {
      return moment.utc(e).format("DD/MM/YY");
    }
  };

  const handleSave = async () => {
    if (
      start?.length > 0 &&
      end?.length > 0 &&
      radioVal?.length > 0 &&
      selectedEmp?.length > 0
    ) {
      const data = {
        employee: selectedEmp,
        start,
        end,
        item: radioVal,
        description: description?.length > 0 ? description : "",
      };
      const res = await addOutOfOfficeData(data);
      if (res?.length > 0) {
        setRadioVal("");
        setSelectedEmp("");
        setstart("");
        setend("");
        setDescription("");
        showOutOfficeModal(!outOfOfficeModal);
      }
    } else {
      alert("Ensure that all fields are filled out");
    }
  };

  return (
    <Modal show={outOfOfficeModal} className="createNewClient">
      <ModalHeader className="header__CNC">
        <h2 className="header__clientPageTitle">Out of office</h2>
        <div
          className="rightPart-header__addResModal"
          style={{ maxWidth: "20%" }}
        >
          <button
            className=" btn-newClient-header__clientPage"
            onClick={() => handleSave()}
          >
            save
          </button>
          <button
            className="closeIconBtn"
            onClick={() => {
              showOutOfficeModal(!outOfOfficeModal);
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
              <Form.Group controlId="clientInputAdd">
                <Form.Select
                  required
                  className="commonInpStyleNewJob"
                  onChange={(e) => {
                    setSelectedEmp(e.target.value);
                  }}
                  aria-label="Assign to Client"
                >
                  <option>Select employee</option>
                  {employees &&
                    employees?.map((emp) => {
                      return (
                        <option key={emp?.id} value={emp?.firstName}>
                          {emp?.firstName}
                        </option>
                      );
                    })}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          <Row className="mx-2 py-3" style={{ borderTop: "1px solid #ededed" }}>
            <Col className="p-0" style={{ marginRight: "15px" }}>
              <Form.Label className="fieldTitle__scheduleNewJobModal">
                Item
              </Form.Label>
              <Form.Group
                className="mb-1"
                controlId="startInputAdd"
                style={{ display: "flex", alignItems: "center" }}
              >
                <div className="d-flex radio__outOfOffice">
                  <Form.Check
                    inline
                    label="Work from home"
                    name="outOfOfficeRadio"
                    type={"radio"}
                    value={"work from home"}
                    onChange={(e) => setRadioVal(e.target.defaultValue)}
                  />
                  <Form.Check
                    inline
                    label="Holiday"
                    name="outOfOfficeRadio"
                    type={"radio"}
                    value={"Holiday"}
                    onChange={(e) => setRadioVal(e.target.defaultValue)}
                  />
                </div>
              </Form.Group>
            </Col>
          </Row>
          <Row className="mx-2 py-3">
            <Form.Label className="fieldTitle__scheduleNewJobModal">
              Date
            </Form.Label>
            <Col className="p-0" style={{ marginRight: "15px" }}>
              <Form.Group
                className="mb-1"
                controlId="startInputAdd"
                style={{ display: "flex", alignItems: "center" }}
              >
                <Form.Label style={{ marginRight: "10px", marginBottom: "0" }}>
                  From
                </Form.Label>
                <Form.Control
                  className="commonInpStyleNewJob"
                  type="text"
                  onFocus={(e) => (e.target.type = "date")}
                  onChange={(e) => {
                    let newstart = DateConverter(e.target.value);
                    setstart(newstart);
                  }}
                  defaultValue={start}
                  placeholder={"DD/MM/YY"}
                />
              </Form.Group>
            </Col>
            <Col className="p-0">
              <Form.Group
                className="mb-1 "
                controlId="endInputAdd"
                style={{ display: "flex", alignItems: "center" }}
              >
                <Form.Label style={{ marginRight: "10px", marginBottom: "0" }}>
                  To
                </Form.Label>
                <Form.Control
                  className="commonInpStyleNewJob"
                  type="text"
                  onChange={(e) => {
                    let newend = DateConverter(e.target.value);
                    setend(newend);
                  }}
                  onFocus={(e) => (e.target.type = "date")}
                  defaultValue={end}
                  placeholder={"DD/MM/YY"}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row className="mx-2 py-3" style={{ borderTop: "1px solid #ededed" }}>
            <Col className="p-0">
              <Form.Control
                className="commonInpStyleNewJob"
                type="text"
                as="textarea"
                style={{ height: "100px" }}
                onChange={(e) => setDescription(e.target.value)}
                defaultValue={""}
                placeholder={"Description"}
              />
            </Col>
          </Row>
        </Form>
      </ModalBody>
    </Modal>
  );
}

export default OutOfOfficeModal;
