import React, { useEffect, useState } from "react";
import { Col, Form, Modal, ModalBody, ModalHeader, Row } from "react-bootstrap";
import closeIcon from "../images/closeIcon.svg";
import plusIconWhite from "../images/plusIconWhite.svg";
import minusIcon from "../images/minus-white.svg";
import { editClient, editClientToAirtable } from "../controller/Airtable";
import moment from "moment-timezone";

function EditClientModal({ showEditClientModal, editCltModal, clt }) {
  const [client, setClient] = useState(clt.name);
  const [subClient, setSubClient] = useState("");
  const [description, setDescription] = useState(clt.description);
  const [activeBtn, setActiveBtn] = useState(
    clt.client_type === "Retainer" ? true : false
  );
  const [clientType, setClientType] = useState(
    clt?.client_type?.length > 0 ? clt?.client_type : "Project based"
  );
  const [subClientArr, setSubClientArr] = useState(clt.subbrand);
  const [mothTimeAllocation, setMonthTimeAllocation] = useState(
    clt?.month_time_allocation?.length > 0 ? clt?.month_time_allocation : ""
  );
  const [date, setDate] = useState(
    clt?.retainer_add_job_date?.length > 0 ? clt?.retainer_add_job_date : ""
  );
  const [radioVal, setRadioVal] = useState(
    clt?.ratiner_period?.length > 0 ? clt?.ratiner_period : "3 months"
  );
  console.log("clients", clt);
  const handleDelete = (eachClient) => {
    const filterArr = subClientArr.filter((data, index) => data !== eachClient);
    setSubClientArr(filterArr);
  };

  const getStartDateText = (e) => {
    const date = new Date();
    if (e) {
      return moment.utc(e).format("DD/MM/YY");
    }

    return moment.utc(date).format("DD/MM/YY");
  };

  return (
    <>
      <Modal className="scheduleNewJobModal" show={editCltModal}>
        <ModalHeader>
          <h2 className="header__clientPageTitle">{clt?.name}</h2>
          <div
            className="rightPart-header__addResModal"
            style={{ width: "20%" }}
          >
            <button
              className=" btn-newClient-header__clientPage"
              onClick={() => {
                let today = new Date();
                today = moment.utc(today).format("DD/MM/YYYY");

                let subCltArr = [];
                let clientDetails;
                subClientArr.forEach((data) => {
                  clientDetails = {
                    clientType,
                    subClient: subCltArr.push(data),
                    description,
                    client,
                    createdAt: today,
                    // compLogo,
                  };
                });
                clientDetails = {
                  clientType,
                  subClient: subCltArr,
                  description,
                  client,
                  createdAt: today,
                  mothTimeAllocation,
                  date,
                  radioVal,
                  // compLogo,
                };

                let cltId = editClientToAirtable(clientDetails, clt?.id);
                if (cltId) {
                  showEditClientModal(!editCltModal);

                  setClient("");
                  setSubClientArr([]);
                  setDescription("");
                  setClientType("");
                }
              }}
            >
              save
            </button>
            <button
              className="closeIconBtn"
              onClick={() => {
                showEditClientModal(!editCltModal);
              }}
            >
              <img src={closeIcon} alt="close icon" />
            </button>
          </div>
        </ModalHeader>
        <ModalBody>
          <Form>
            <Row className="mb-3">
              <Col>
                <Form.Group>
                  <Form.Label className="fieldTitle__scheduleNewJobModal">
                    Client name
                  </Form.Label>
                  <Form.Control
                    className="commonInpStyleNewJob mt-1"
                    type="text"
                    value={client}
                    onChange={(e) => setClient(e.target.value)}
                    placeholder={"Lorem ipsum"}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="formGroup__CNC">
                  <Form.Label className="fieldTitle__scheduleNewJobModal">
                    Sub client name
                  </Form.Label>
                  <Form.Control
                    className="commonInpStyleNewJob mt-1"
                    type="text"
                    value={subClient}
                    onChange={(e) => setSubClient(e.target.value)}
                    placeholder={"Lorem ipsum"}
                  />
                  <div
                    className="fieldBtnCont__CNC"
                    onClick={() => {
                      subClient?.length > 0 &&
                        setSubClientArr([...subClientArr, subClient]);
                      setSubClient("");
                    }}
                  >
                    <img src={plusIconWhite} alt="plus icon" />
                  </div>
                  <div className="listOutClient__CNC">
                    {subClientArr?.length > 0 &&
                      subClientArr?.map((eachClient, index) => {
                        return (
                          <div className="client_CNC" key={index}>
                            <p>{eachClient}</p>
                            <img
                              src={minusIcon}
                              alt="minus ico"
                              onClick={() => handleDelete(eachClient)}
                            />
                          </div>
                        );
                      })}
                  </div>
                </Form.Group>
              </Col>
            </Row>
            <Row
              className="mx-2 py-3"
              style={{ borderTop: "1px solid #ededed" }}
            >
              <Col className="p-0">
                <Form.Label className="fieldTitle__scheduleNewJobModal">
                  Client type
                </Form.Label>

                <div
                  className="btnGroup-header__clientPage mt-2"
                  style={{ width: "fit-content" }}
                >
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveBtn(false);
                      setClientType("Project based");
                    }}
                    style={
                      activeBtn === false
                        ? { backgroundColor: "#20e29f", fontWeight: "600" }
                        : { backgroundColor: "#d8d2d1" }
                    }
                  >
                    Project based client
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveBtn(true);
                      setClientType("Retainer");
                    }}
                    style={
                      activeBtn === true
                        ? { backgroundColor: "#20e29f", fontWeight: "600" }
                        : { backgroundColor: "#d8d2d1" }
                    }
                  >
                    Retainer client
                  </button>
                </div>
              </Col>
            </Row>
            {activeBtn === true && (
              <>
                <Row
                  className="mx-2 py-3"
                  style={{ borderTop: "1px solid #ededed" }}
                >
                  <Col>
                    <Form.Group className="formGroup__CNC">
                      <Form.Label className="fieldTitle__scheduleNewJobModal">
                        Monthly time allocation
                      </Form.Label>
                      <Form.Control
                        className="commonInpStyleNewJob mt-1"
                        type="text"
                        value={mothTimeAllocation}
                        onChange={(e) => setMonthTimeAllocation(e.target.value)}
                        placeholder={"XX hours"}
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group className="formGroup__CNC">
                      <Form.Label
                        className="fieldTitle__scheduleNewJobModal"
                        style={{ marginRight: "10px", marginBottom: "0" }}
                      >
                        Date added
                      </Form.Label>
                      <Form.Control
                        className="commonInpStyleNewJob"
                        type="text"
                        onFocus={(e) => (e.target.type = "date")}
                        onChange={(e) => {
                          let newStartDate = getStartDateText(e.target.value);
                          setDate(newStartDate);
                        }}
                        defaultValue={clt?.retainer_add_job_date}
                        placeholder={getStartDateText()}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row className="mx-2">
                  <Form.Group className="formGroup__CNC mb-3">
                    <Form.Label className="fieldTitle__scheduleNewJobModal">
                      Period
                    </Form.Label>
                    <div className="d-flex flex-wrap">
                      <button
                        className=" btn-newClient-header__clientPage m-2"
                        style={
                          radioVal === "3 months"
                            ? { background: "#20e29f" }
                            : { background: "#9D9D9D" }
                        }
                        onClick={(e) => {
                          e.preventDefault();
                          setRadioVal("3 months");
                        }}
                      >
                        3 months
                      </button>
                      <button
                        className=" btn-newClient-header__clientPage m-2"
                        style={
                          radioVal === "6 months"
                            ? { background: "#20e29f" }
                            : { background: "#9D9D9D" }
                        }
                        onClick={(e) => {
                          e.preventDefault();
                          setRadioVal("6 months");
                        }}
                      >
                        6 months
                      </button>
                      <button
                        className=" btn-newClient-header__clientPage m-2"
                        style={
                          radioVal === "12 months"
                            ? { background: "#20e29f" }
                            : { background: "#9D9D9D" }
                        }
                        onClick={(e) => {
                          e.preventDefault();
                          setRadioVal("12 months");
                        }}
                      >
                        12 months
                      </button>
                      <button
                        className=" btn-newClient-header__clientPage m-2"
                        style={
                          radioVal === "18 months"
                            ? { background: "#20e29f" }
                            : { background: "#9D9D9D" }
                        }
                        onClick={(e) => {
                          e.preventDefault();
                          setRadioVal("18 months");
                        }}
                      >
                        18 months
                      </button>
                      <button
                        className=" btn-newClient-header__clientPage m-2"
                        style={
                          radioVal === "24 months"
                            ? { background: "#20e29f" }
                            : { background: "#9D9D9D" }
                        }
                        onClick={(e) => {
                          e.preventDefault();
                          setRadioVal("24 months");
                        }}
                      >
                        24 months
                      </button>
                    </div>
                  </Form.Group>
                </Row>
              </>
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
                  onChange={(e) => setDescription(e.target.value)}
                  defaultValue={clt.description}
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

export default EditClientModal;
