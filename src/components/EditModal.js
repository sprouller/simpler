import { useState } from "react";
import moment from "moment";
import "moment-timezone";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import { fetchClients } from "../controller/Airtable";

function EditModal({
  modalState,
  sprint,
  clients,
  employees,
  setModalState,
  handleEditSprintAndJob,
  sprints,
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
    setAllClient(getClientsDetails());
  }, [sprint]);

  const getClientsDetails = async () => {
    let existedClient = await fetchClients();
  };

  const getStartDateText = () => {
    return moment.utc(sprint.start).format("DD/MM/YYYY");
  };

  const getEndDateText = () => {
    return moment.utc(sprint.end).format("DD/MM/YYYY");
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

  return (
    <>
      <Modal
        show={modalState === "edit-modal"}
        onHide={() => setModalState("view-modal")}
        centered
        className="edit-event-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>{"Edit"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col>
                <Form.Group className="mb-3" controlId="clientInputEdit">
                  <Form.Label>Client</Form.Label>
                  <Form.Select
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
                  <Form.Label>Sub Brand</Form.Label>
                  <Form.Select
                    onChange={(e) => {
                      setSubBrands(e.target.value);
                    }}
                    value={subBrand}
                    aria-label="Assign to Sub Brand"
                  >
                    <option>Assign to Sub Brand</option>

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
                      setStart(e.target.value);
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
                      setEnd(e.target.value);
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
                    defaultValue={sprint.job.name}
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
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  defaultValue={description}
                  placeholder={description}
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
              const sprintData = {
                sprintId: sprint.id,
                start_date: start,
                end_date: end,
                employeeId,
              };
              const jobData = {
                jobId: sprint.job.id,
                jobName,
                clientId,
                timeAllocated: parseInt(timeAllocated, 10),
              };
              if (start && end && jobName && description)
                handleEditSprintAndJob(sprintData, jobData);
              setStart("");
              setEnd("");
              setJobName("");
              setTimeAllocated(0);
              setDescription("");
            }}
          >
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default EditModal;
