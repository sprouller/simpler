import React, { useState } from "react";
import closeIcon from "../images/closeIcon.svg";
import plusIconWhite from "../images/plusIconWhite.svg";
import minusIcon from "../images/minus-white.svg";
import { Col, Form, Modal, ModalBody, ModalHeader, Row } from "react-bootstrap";
import { addNewClient } from "../controller/Airtable";

function CreateNewClient({ show, setShow }) {
  const [activeBtn, setActiveBtn] = useState(false);
  const [clientType, setClientType] = useState("Project based");
  const [subClientArr, setSubClientArr] = useState([]);
  const [client, setClient] = useState("");
  const [subClient, setSubClient] = useState("");
  const [description, setDescription] = useState("");
  const [compLogo, setCompLogo] = useState({});

  const handleDelete = (eachClient) => {
    const filterArr = subClientArr.filter((data, index) => data !== eachClient);
    setSubClientArr(filterArr);
  };

  return (
    <Modal show={show} className="createNewClient">
      <ModalHeader className="header__CNC">
        <h2 className="header__clientPageTitle">New Client</h2>
        <div className="btnCont-header__CNC">
          <button
            className="btn-newClient-header__clientPage m-2"
            style={{ background: "#9D9D9D" }}
          >
            Archive
          </button>
          <button
            className="btn-newClient-header__clientPage m-3"
            onClick={() => {
              // today = moment.utc(today).format("DD/MM/YYYY");

              const clientDetails = {
                clientType,
                // subClientArr,
                description,
                client,
                // createdAt: new Date(),
                // compLogo,
              };
              if (subClientArr && description && clientType && client)
                addNewClient(clientDetails);
              setCompLogo({});
              setClient("");
              setSubClientArr([]);
              setDescription("");
              setClientType("");
              setShow(!show);
            }}
          >
            save
          </button>
          <button className="closeIconBtn" onClick={() => setShow(!show)}>
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
          <Row className="mx-2 py-3" style={{ borderTop: "1px solid #ededed" }}>
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
            {/* <Col className="p-0">
              <Form.Group className="formGroup__CNC">
                <Form.Label className="fieldTitle__scheduleNewJobModal">
                  Logo url
                </Form.Label>
                <Form.Control
                  className="commonInpStyleNewJob mt-1"
                  type="file"
                  style={{ padding: "6px 10px" }}
                  placeholder={"Lorem ipsum"}
                  accept="image/*"
                  onChange={(event) => {
                    setCompLogo(event.target.files[0]);
                  }}
                />
              </Form.Group>
            </Col> */}
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

export default CreateNewClient;
