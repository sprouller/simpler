import React, { useState } from "react";
import { Col, Form, Modal, ModalBody, ModalHeader, Row } from "react-bootstrap";
import closeIcon from "../images/closeIcon.svg";
import plusIconWhite from "../images/plusIconWhite.svg";
import minusIcon from "../images/minus-white.svg";
import { editClient } from "../controller/Airtable";
import moment from "moment-timezone";

function EditClientModal({ showEditClientModal, editCltModal, clt }) {
  const [client, setClient] = useState(clt.name);
  const [subClient, setSubClient] = useState("");
  const [description, setDescription] = useState(clt.description);
  const [activeBtn, setActiveBtn] = useState(
    clt.client_type === "Retainer" ? true : false
  );
  const [clientType, setClientType] = useState("");
  const [subClientArr, setSubClientArr] = useState(clt.subbrand);

  const handleDelete = (eachClient) => {
    const filterArr = subClientArr.filter((data, index) => data !== eachClient);
    setSubClientArr(filterArr);
  };

  console.log("client", clt, description);

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

                if (subClientArr && description && clientType && client) {
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
                    // compLogo,
                  };

                  let cltId = editClient(clientDetails, clt?.id);
                  if (cltId) {
                    showEditClientModal(!editCltModal);

                    setClient("");
                    setSubClientArr([]);
                    setDescription("");
                    setClientType("");
                  }
                } else {
                  alert("Make sure you will fill all the fields");
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
                      subClient.length > 0 &&
                        setSubClientArr([...subClientArr, subClient]);
                      setSubClient("");
                    }}
                  >
                    <img src={plusIconWhite} alt="plus icon" />
                  </div>
                  <div className="listOutClient__CNC">
                    {subClientArr.length > 0 &&
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
