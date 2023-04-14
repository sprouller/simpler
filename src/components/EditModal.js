import { useState } from "react";
import moment from "moment";
import "moment-timezone";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { useEffect } from "react";
import { Col, ModalBody, Row } from "react-bootstrap";
import { fetchClients } from "../controller/Airtable";

function EditModal({
  modalState,
  sprint,
  clients,
  employees,
  setModalState,
  handleEditSprintAndJob,
  sprints,
  startDate,
  endDate,
  handleDeleteSprint,
}) {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [jobName, setJobName] = useState("");
  const [clientId, setClientId] = useState("");
  const [timeAllocated, setTimeAllocated] = useState(0);
  const [employeeId, setEmployeeId] = useState("");
  const [description, setDescription] = useState("");
  const [thirdPartyItem, setThirdPartyItem] = useState("");
  const [thirdPartyCost, setThirdPartyCost] = useState(0);
  const [allClient, setAllClient] = useState([]);
  const [subBrand, setSubBrands] = useState("");
  const [jobCode, setJobCode] = useState("");
  const [activeBtn, setActiveBtn] = useState(false);
  const [isLiveJob, setIsLiveJob] = useState(true);

  useEffect(() => {
    if (!sprint) return;
    setStart(getStartDateText());
    setEnd(getEndDateText());
    setJobName(sprint?.job?.name);
    setJobCode(sprint?.job?.job_code);
    setClientId(sprint?.job?.client?.id);
    setTimeAllocated(sprint?.job?.timeAllocated);
    setEmployeeId(sprint?.employee?.id);
    setSubBrands(sprint?.job?.subBrand);
    setDescription(sprint?.job?.description);
    // setAllClient(getClientsDetails());
  }, [sprint]);

  const getStartDateText = (e) => {
    if (e) {
      return moment.utc(e).format("DD/MM/YY");
    }
    return moment.utc(startDate).format("DD/MM/YY");
  };

  const getEndDateText = (e) => {
    if (e) {
      return moment.utc(e).format("DD/MM/YY");
    }
    return moment.utc(endDate).format("DD/MM/YY");
  };

  console.log({ clients });

  if (!sprint) {
    console.log("no sprint!");
    return (
      <>
        <Modal>No Sprint Data</Modal>
      </>
    );
  }

  const ParseStartDate = (datedInp) => {
    const format = "DD/MM/YYYY";
    const timezone = "GMT";

    const date = moment.tz(datedInp, format, timezone).toDate();
    return date;
  };
  const ParseEndDate = (datedInp) => {
    const format = "DD/MM/YYYY";
    const timezone = "GMT";

    const date = moment.tz(datedInp, format, timezone).toDate();
    return date;
  };

  const createJobCode = (_id) => {
    let newFilteredArr = sprints
      ?.filter((allData) => {
        return allData?.job?.client?.id === _id;
      })
      .map((newData) => {
        return newData;
      });

    if (newFilteredArr?.length > 0) {
      newFilteredArr?.forEach((data) => {
        let clientName = data?.job?.client?.name
          ?.substring(0, 3)
          ?.toUpperCase();
        if (newFilteredArr?.length < 9) {
          setJobCode(`${clientName}00${newFilteredArr?.length + 1}`);
        } else if (newFilteredArr?.length < 99) {
          setJobCode(`${clientName}0${newFilteredArr?.length + 1}`);
        } else {
          setJobCode(`${clientName}${newFilteredArr?.length + 1}`);
        }
      });
    } else {
      //   clients?.forEach((eachClient) => {
      //     if (eachClient?.id === _id) {
      //       let generateCode = `${eachClient?.name
      //         ?.substring(0, 3)
      //         ?.toUpperCase()}001`;
      //       setJobCode(generateCode);
      //     }
      //   });
    }
  };

  console.log("xyz", start, end);
  console.log("Modal State", modalState);
  return (
    <>
      <Modal
        show={modalState === "edit-modal"}
        onHide={() => setModalState("")}
        centered
        className="edit-event-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title style={{ marginRight: "200px" }}>{"Edit"}</Modal.Title>
          {/* <button
            className=" btn-newClient-header__clientPage"
            style={{ backgroundColor: "red", marginRight: "20px" }}
            onClick={() => handleDeleteSprint(sprint.id)}
          >
            <i className="fi fi-rr-trash"></i>
          </button> */}
          <div className="btnGroup-header__clientPage">
            <button
              onClick={() => {
                setActiveBtn(false);
                setIsLiveJob(true);
              }}
              style={
                activeBtn === false
                  ? { backgroundColor: "#20e29f", fontWeight: "600" }
                  : { backgroundColor: "#d8d2d1" }
              }
            >
              Live job
            </button>
            <button
              onClick={() => {
                setActiveBtn(true);
                setIsLiveJob(false);
              }}
              style={
                activeBtn === true
                  ? { backgroundColor: "#20e29f", fontWeight: "600" }
                  : { backgroundColor: "#d8d2d1" }
              }
            >
              Pencilled
            </button>
          </div>
          <button
            className="btn-newClient-header__clientPage"
            style={{ marginLeft: "0px" }}
            onClick={() => {
              let parsedStartDate = ParseStartDate(start);
              let parsedEndDate = ParseEndDate(end);
              console.log("Pares", parsedEndDate, parsedStartDate);
              // console.log("Dated", parsedEndDate, parsedStartDate);
              const sprintData = {
                sprintId: sprint.id,
                start_date: parsedStartDate,
                end_date: parsedEndDate,
                employeeId,
              };
              const jobData = {
                jobId: sprint.job.id,
                jobName,
                clientId,
                timeAllocated: parseInt(timeAllocated, 10),
              };

              handleEditSprintAndJob(sprintData, jobData);
              // setModalState(!modalState);
              setStart("");
              setEnd("");
              setJobName("");
              setTimeAllocated(0);
              setDescription("");
            }}
          >
            Save
          </button>
        </Modal.Header>
        {isLiveJob ? (
          <ModalBody>
            <Form>
              <Row>
                <Col>
                  <Form.Group className="mb-3" controlId="clientInputEdit">
                    <Form.Select
                      className="commonInpStyleNewJob"
                      required
                      onChange={(e) => {
                        setClientId(e.target.value);
                        createJobCode(e.target.value);
                      }}
                      defaultValue={sprint.job.client.id}
                      aria-label="Assign to Client"
                    >
                      <option>Select Client</option>
                      {clients &&
                        clients?.map((client) => {
                          return (
                            <option key={client?.id} value={client?.id}>
                              {client?.name}
                            </option>
                          );
                        })}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-3" controlId="subBrandInputAdd">
                    <Form.Select
                      className="commonInpStyleNewJob"
                      onChange={(e) => {
                        setSubBrands(e.target.value);
                      }}
                      value={subBrand}
                      aria-label="Assign to Sub Brand"
                    >
                      <option>Assign to Sub Brand</option>

                      {clientId &&
                        clients?.map((clientData, index) => {
                          if (clientData.id === clientId) {
                            console.log("cltData", clientData);
                            if (clientData?.subbrand?.length > 0) {
                              return clientData?.subbrand?.map(
                                (subData, index) => {
                                  return (
                                    <option key={index} value={subData}>
                                      {subData}
                                    </option>
                                  );
                                }
                              );
                            } else {
                              return (
                                <option key={index} value="No subbrand">
                                  No subbrand
                                </option>
                              );
                            }
                          }
                        })}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group className="mb-3" controlId="startDateInputAdd">
                    <Form.Label>Start Date</Form.Label>
                    <Form.Control
                      className="commonInpStyleNewJob"
                      type="text"
                      onFocus={(e) => (e.target.type = "date")}
                      onChange={(e) => {
                        let newStartDate = getStartDateText(e.target.value);
                        setStart(newStartDate);
                      }}
                      // defaultValue={getStartDateText()}
                      placeholder={getStartDateText()}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-3" controlId="endDateInputAdd">
                    <Form.Label>End Date</Form.Label>
                    <Form.Control
                      className="commonInpStyleNewJob"
                      type="text"
                      onFocus={(e) => (e.target.type = "date")}
                      onChange={(e) => {
                        let newEndDate = getEndDateText(e.target.value);
                        setEnd(newEndDate);
                      }}
                      // defaultValue={getEndDateText()}
                      placeholder={getEndDateText()}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group className="mb-3" controlId="jobCodeInputAdd">
                    <Form.Label>Job Code</Form.Label>
                    <Form.Control
                      className="commonInpStyleNewJob"
                      type="text"
                      value={jobCode}
                      onChange={(e) => setJobCode(e.target.value)}
                      placeholder={"DIAXXXX"}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-3" controlId="jobNameInputAdd">
                    <Form.Label>Job Name</Form.Label>
                    <Form.Control
                      className="commonInpStyleNewJob"
                      type="text"
                      onChange={(e) => setJobName(e.target.value)}
                      defaultValue={sprint.job.name}
                      placeholder={"Job Name"}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group
                    className="mb-3"
                    controlId="timeAllocatedInputAdd"
                  >
                    <Form.Label> Estimated Time Allocated</Form.Label>
                    <Form.Control
                      className="commonInpStyleNewJob"
                      type="number"
                      defaultValue={sprint.job.timeAllocated}
                      onChange={(e) => setTimeAllocated(e.target.value)}
                      placeholder={"5"}
                      min={0}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group
                    className="mb-3"
                    controlId="exampleForm.ControlInput3"
                  >
                    <Form.Label>Assign to Employee</Form.Label>
                    <Form.Select
                      defaultValue={sprint.employee.id}
                      className="commonInpStyleNewJob"
                      onChange={(e) => {
                        setEmployeeId(e.target.value);
                      }}
                      aria-label="Select Employee"
                    >
                      <option>Select Employee</option>
                      {employees &&
                        employees.map((employee) => {
                          return (
                            <option key={employee.id} value={employee.id}>
                              {`${employee.firstName} ${employee.surname}`}
                            </option>
                          );
                        })}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Form.Group className="mb-3" controlId="descriptionInputAdd">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    className="commonInpStyleNewJob"
                    type="text"
                    as="textarea"
                    style={{ height: "100px" }}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    defaultValue={description}
                    placeholder={description}
                  />
                </Form.Group>
              </Row>
              <Row>
                <Col>
                  <Form.Group
                    className="mb-3"
                    controlId="thirdPartyItemInputAdd"
                  >
                    <Form.Label>Third Party Item</Form.Label>
                    <Form.Control
                      className="commonInpStyleNewJob"
                      type="text"
                      onChange={(e) => setThirdPartyItem(e.target.value)}
                      defaultValue={""}
                      placeholder={"Third Party Item"}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-3" controlId="thirdPartyCost">
                    <Form.Label>Cost £</Form.Label>
                    <Form.Control
                      className="commonInpStyleNewJob"
                      type="number"
                      onChange={(e) => setThirdPartyCost(e.target.value)}
                      defaultValue={""}
                      step={0.01}
                      min={0}
                      placeholder={"XX.XX"}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Form>
          </ModalBody>
        ) : (
          <ModalBody>
            <Form>
              <Row className="mx-2">
                <Col className="p-0" style={{ marginRight: "15px" }}>
                  <Form.Group
                    className="mb-3 selectClt__scheduleNewJobModal"
                    controlId="clientInputEdit"
                  >
                    <Form.Select
                      className="commonInpStyleNewJob"
                      required
                      onChange={(e) => {
                        setClientId(e.target.value);
                        createJobCode(e.target.value);
                      }}
                      defaultValue={sprint?.job?.client?.id}
                      aria-label="Assign to Client"
                    >
                      <option>Select Client</option>
                      {clients &&
                        clients?.map((client) => {
                          return (
                            <option key={client?.id} value={client?.id}>
                              {client?.name}
                            </option>
                          );
                        })}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col className="p-0">
                  <Form.Group className="mb-3" controlId="subBrandInputAdd">
                    <Form.Select
                      className="commonInpStyleNewJob"
                      value={subBrand}
                      onChange={(e) => {
                        setSubBrands(e.target.value);
                      }}
                      aria-label="Assign to Sub Brand"
                    >
                      <option>Assign to Sub Brand</option>;
                      {clientId &&
                        clients?.map((clientData, index) => {
                          if (clientData.id === clientId) {
                            console.log("cltData", clientData);
                            if (clientData?.subbrand?.length > 0) {
                              return clientData?.subbrand?.map(
                                (subData, index) => {
                                  return (
                                    <option key={index} value={subData}>
                                      {subData}
                                    </option>
                                  );
                                }
                              );
                            } else {
                              return (
                                <option key={index} value="No subbrand">
                                  No subbrand
                                </option>
                              );
                            }
                          }
                        })}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              <Row
                className="mx-2 py-3"
                style={{ borderTop: "1px solid #ededed" }}
              >
                <Form.Label className="fieldTitle__scheduleNewJobModal">
                  Date
                </Form.Label>
                <Col>
                  <Form.Group className="mb-3" controlId="startDateInputAdd">
                    <Form.Label>Start Date</Form.Label>
                    <Form.Control
                      className="commonInpStyleNewJob"
                      type="text"
                      onFocus={(e) => (e.target.type = "date")}
                      onChange={(e) => {
                        let newStartDate = getStartDateText(e.target.value);
                        setStart(newStartDate);
                      }}
                      // defaultValue={getStartDateText()}
                      placeholder={getStartDateText()}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-3" controlId="endDateInputAdd">
                    <Form.Label>End Date</Form.Label>
                    <Form.Control
                      className="commonInpStyleNewJob"
                      type="text"
                      onChange={(e) => {
                        let newEndDate = getStartDateText(e.target.value);
                        setEnd(newEndDate);
                      }}
                      onFocus={(e) => (e.target.type = "date")}
                      // defaultValue={getEndDateText()}
                      placeholder={getEndDateText()}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row
                className="mx-2 py-3"
                style={{ borderTop: "1px solid #ededed" }}
              >
                <Form.Label className="fieldTitle__scheduleNewJobModal">
                  Job
                </Form.Label>
                <Col className="p-0" style={{ marginRight: "15px" }}>
                  <Form.Group
                    className="mb-1"
                    controlId="startDateInputAdd"
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    <Form.Label
                      style={{ marginRight: "10px", marginBottom: "0" }}
                    >
                      Code
                    </Form.Label>
                    <Form.Control
                      className="commonInpStyleNewJob"
                      type="text"
                      value={jobCode}
                      onChange={(e) => setJobCode(e.target.value)}
                      placeholder={"DIAXXXX"}
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
                      Name
                    </Form.Label>
                    <Form.Control
                      className="commonInpStyleNewJob"
                      type="text"
                      onChange={(e) => setJobName(e.target.value)}
                      defaultValue={""}
                      placeholder={"Lorem ipsum"}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row
                className="mx-2 py-3"
                style={{ borderTop: "1px solid #ededed" }}
              >
                <Form.Label className="fieldTitle__scheduleNewJobModal">
                  Assign to Designer(s)
                </Form.Label>
                <Form.Select
                  className="commonInpStyleNewJob mt-2"
                  defaultValue={""}
                  onChange={(e) => {
                    setEmployeeId(e.target.value);
                  }}
                  aria-label="Select Employee"
                >
                  <option>Select designer</option>
                  {employees &&
                    employees.map((person) => {
                      return (
                        <option key={person.id} value={person.id}>
                          {`${person.firstName} ${person.surname}`}
                        </option>
                      );
                    })}
                </Form.Select>
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
                    defaultValue={""}
                    placeholder={"Description"}
                  />
                </Col>
              </Row>
            </Form>
          </ModalBody>
        )}
      </Modal>
    </>
  );
}

export default EditModal;
