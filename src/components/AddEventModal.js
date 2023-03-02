import { useState } from "react";
import moment from "moment";
import "moment-timezone";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { useEffect } from "react";
import { Col, Row } from "react-bootstrap";

function AddEventModal({
  addEventModalStatus,
  modalState,
  startDate,
  endDate,
  clients,
  employees,
  handleClose,
  handleSave,
  handleScheduleJob,
  sprint,
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
  const [jobCode, setJobCode] = useState("");
  const [counter, setCounter] = useState(1);
  const [subBrand, setSubBrands] = useState("");
  useEffect(() => {
    setStart(getStartDateText());
    setEnd(getEndDateText());
    clientId && setJobCode();
  }, [startDate, endDate]);
  console.log({ startDate });
  console.log({ start });

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

  const createJobCode = (_id) => {
    console.log(sprint, typeof sprint);
    let newFilteredArr = sprint
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
      clients?.forEach((eachClient) => {
        if (eachClient?.id === _id) {
          let generateCode = `${eachClient?.name
            ?.substring(0, 3)
            ?.toUpperCase()}001`;
          setJobCode(generateCode);
        }
      });
    }
  };
  addEventModalStatus && console.log("render");
  return (
    <>
      <Modal
        show={modalState === "add-modal"}
        onHide={handleClose}
        centered
        className="add-event-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>{"Schedule A Job"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col>
                <Form.Group className="mb-3" controlId="clientInputAdd">
                  <Form.Label>Client</Form.Label>
                  <Form.Select
                    required
                    onChange={(e) => {
                      setClientId(e.target.value);
                      createJobCode(e.target.value);
                    }}
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
                  <Form.Label>Sub Brand</Form.Label>
                  <Form.Select
                    value={subBrand}
                    onChange={(e) => {
                      setSubBrands(e.target.value);
                    }}
                    aria-label="Assign to Sub Brand"
                  >
                    <option>Assign to Sub Brand</option>;
                    {clientId &&
                      clients?.map((clientData, index) => {
                        if (clientData?.subbrand?.length > 0) {
                          if (clientData.id === clientId) {
                            return clientData?.subbrand?.map(
                              (subData, index) => {
                                return (
                                  <option key={index} value={subData}>
                                    {subData}
                                  </option>
                                );
                              }
                            );
                          }
                        } else {
                          return (
                            <option key={index} value="None">
                              None
                            </option>
                          );
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
                    type="text"
                    onFocus={(e) => (e.target.type = "date")}
                    onChange={(e) => {
                      let newStartDate = getStartDateText(e.target.value);
                      setStart(newStartDate);
                    }}
                    defaultValue={getStartDateText()}
                    placeholder={getStartDateText()}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3" controlId="endDateInputAdd">
                  <Form.Label>End Date</Form.Label>
                  <Form.Control
                    type="text"
                    onChange={(e) => {
                      let newEndDate = getStartDateText(e.target.value);
                      setEnd(newEndDate);
                    }}
                    onFocus={(e) => (e.target.type = "date")}
                    defaultValue={getEndDateText()}
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
                    type="text"
                    onChange={(e) => setJobName(e.target.value)}
                    defaultValue={""}
                    placeholder={"Job Name"}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group className="mb-3" controlId="timeAllocatedInputAdd">
                  <Form.Label> Estimated Time Allocated</Form.Label>
                  <Form.Control
                    type="number"
                    defaultValue={0}
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
                    defaultValue={""}
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
                  type="text"
                  as="textarea"
                  style={{ height: "100px" }}
                  onChange={(e) => setDescription(e.target.value)}
                  defaultValue={""}
                  placeholder={"Description"}
                />
              </Form.Group>
            </Row>
            <Row>
              <Col>
                <Form.Group className="mb-3" controlId="thirdPartyItemInputAdd">
                  <Form.Label>Third Party Item</Form.Label>
                  <Form.Control
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
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="success"
            onClick={() => {
              const sprint = {
                start: moment(
                  `${start.replace("/", "").trim()}`,
                  "DDMMYY"
                ).format("yyyy[-]MM[-]DD"),
                end: moment(`${end.replace("/", "").trim()}`, "DDMMYY").format(
                  "yyyy[-]MM[-]DD"
                ),
                employeeId,
              };
              const job = {
                jobName,
                clientId,
                timeAllocated: parseInt(timeAllocated, 10),
                jobCode,
                description,
                subBrand,
              };
              if (jobName && jobCode && description && start && end)
                handleScheduleJob(job, sprint);
              setStart("");
              setEnd("");
              setJobName("");
              setTimeAllocated(0);
              setDescription("");
              setJobCode("");
            }}
          >
            Add Job
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default AddEventModal;
