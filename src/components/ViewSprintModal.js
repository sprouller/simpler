import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Stack from "react-bootstrap/Stack";
import CloseButton from "react-bootstrap/CloseButton";
import { useEffect } from "react";
import { Alert } from "react-bootstrap";
import {
  addWorkItemToAirtable,
  deleteWorkItemFromTable,
  fetchWorkItemsByJobId,
} from "../controller/Airtable";
import closeIcon from "../images/closeIcon.svg";
import plusIconWhite from "../images/plusIconWhite.svg";
import progressBar from "../images/progressBar.svg";
import moment from "moment-timezone";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

function ViewSprintModal({
  modalState,
  handleClose,
  sprint,
  setModalState,
  employees,
  handleDeleteSprint,
}) {
  const [date, setDate] = useState();
  const [hours, setHours] = useState(0);
  const [employee, setEmployee] = useState(
    (sprint && sprint.employee.id) || ""
  );
  const [workItems, setworkItems] = useState([]);
  const [isLiveJob, setIsLiveJob] = useState(true);
  const [activeBtn, setActiveBtn] = useState(false);

  const todaysDate = () => {
    let date = new Date();
    let todayDate = moment(date).format("YYYY-MM-DD");
    setDate(todayDate);
  };

  useEffect(() => {
    if (!sprint) return;
    console.log({ sprint });
    setEmployee((sprint && sprint.employee.id) || "");
    todaysDate();
    fetchWorkItemsByJobId(sprint.job.id).then((workItems) => {
      console.log({ workItems });
      setworkItems(workItems);
    });
  }, [sprint]);
  console.log("work", workItems);

  const getUTCDate = (date) => {
    return moment.utc(date).format("DD/MM/YYYY");
  };

  if (!sprint) {
    console.log("no sprint!");
    return (
      <>
        <Modal>No Sprint Data</Modal>
      </>
    );
  }
  const handleAddWorkItem = async (sprintId, date, hours) => {
    console.log("handleAddWorkItem");
    console.log({ sprintId, date, hours });
    try {
      console.log("dat", date);
      await addWorkItemToAirtable(sprintId, date, hours);
      const workItems = await fetchWorkItemsByJobId(sprint.job.id);
      setworkItems(workItems);
      setHours(0); // not working
    } catch (error) {
      console.log({ error });
    }
  };

  const handleDeleteWorkItem = async (workItemId) => {
    console.log("handleDeleteWorkItem");
    console.log({ workItemId });
    await deleteWorkItemFromTable(workItemId);
    fetchWorkItemsByJobId(sprint.job.id).then((workItems) => {
      setworkItems(workItems);
    });
  };

  return (
    <>
      <Modal
        show={modalState === "view-modal"}
        // onHide={handleClose}
        // onHide={() => setIsJobOpen(!isJobModalOpen)}
        className="view-sprint-modal scheduleNewJobModal"
      >
        <Modal.Header>
          <Modal.Title className="header__clientPageTitle">
            {sprint.job.name}
          </Modal.Title>
          <div>
            <button
              className=" btn-newClient-header__clientPage"
              onClick={() => setModalState("edit-modal")}
              style={{ marginRight: "20px" }}
            >
              Edit
            </button>
            <button
              className=" btn-newClient-header__clientPage"
              style={{ backgroundColor: "red", marginRight: "20px" }}
              onClick={() => handleDeleteSprint(sprint.id)}
            >
              <i className="fi fi-rr-trash"></i>
            </button>
            <button
              className="closeIconBtn"
              onClick={() => {
                handleClose();
              }}
            >
              <img src={closeIcon} alt="close icon" />
            </button>
          </div>
        </Modal.Header>
        <Modal.Body>
          <div
            className="btnGroup-header__clientPage"
            style={{ width: "fit-content" }}
          >
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
              Job Information
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
              Time Tracking
            </button>
          </div>
          <div className="viewSprint-inner-modal">
            {isLiveJob ? (
              <Form onSubmit={(e) => e.preventDefault()}>
                <Row className="mb-2">
                  <Col>
                    <Stack direction="horizontal" gap={2}>
                      <strong>Client: </strong>
                      <p>{sprint.job.client.name}</p>
                    </Stack>
                  </Col>
                  <Col>
                    <Stack direction="horizontal" gap={2}>
                      <strong>Job Code:</strong>
                      <p>{sprint?.job?.job_code}</p>
                    </Stack>
                  </Col>
                </Row>
                <Row className="mb-2">
                  <Col>
                    <Stack direction="horizontal" gap={2}>
                      <strong>Sub Brand: </strong>
                      <p>{sprint?.job?.subBrand}</p>
                    </Stack>
                  </Col>
                  <Col>
                    <Stack direction="horizontal" gap={2}>
                      <strong>Job Name:</strong>
                      <p>{sprint?.job?.name}</p>
                    </Stack>
                  </Col>
                </Row>
                <hr></hr>
                <Row className="mb-2">
                  <Col>
                    <Stack direction="horizontal" gap={2}>
                      <strong>Date From: </strong>
                      <p>{sprint?.start}</p>
                    </Stack>
                  </Col>
                  <Col>
                    <Stack direction="horizontal" gap={2}>
                      <strong>Date To:</strong>
                      <p>{sprint?.end}</p>
                    </Stack>
                  </Col>
                </Row>
                <Row className="mb-2">
                  <Col>
                    <Stack direction="horizontal" gap={2}>
                      <strong>Time Allocated: </strong>
                      <p>{sprint?.job?.timeAllocated} hours</p>
                    </Stack>
                  </Col>
                  <Col>
                    <Stack direction="horizontal" gap={2}>
                      <strong>Employee:</strong>
                      <p>{sprint?.employee?.firstName}</p>
                    </Stack>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <p>{sprint?.job?.description}</p>
                  </Col>
                </Row>
              </Form>
            ) : (
              <Form onSubmit={(e) => e.preventDefault()}>
                <Row>
                  <Col>
                    <Form
                      className="detailsForm-viewSprint"
                      onSubmit={(e) => e.preventDefault()}
                    >
                      <Form.Group
                        className="mb-2 inputContainer"
                        controlId="addTimeFormEmployee"
                      >
                        <Form.Label className="mb-0">
                          <strong>Name</strong>
                        </Form.Label>
                        <Form.Select
                          className="commonInpStyleNewJob"
                          disabled
                          defaultValue={sprint.employee.id}
                          onChange={(e) => {
                            setEmployee(e.target.value);
                          }}
                          aria-label="Select Employee"
                        >
                          {employees &&
                            employees.map((employee) => {
                              return (
                                <option key={employee?.id} value={employee?.id}>
                                  {`${employee?.firstName} ${employee?.surname}`}
                                </option>
                              );
                            })}
                        </Form.Select>
                      </Form.Group>
                      <Form.Group
                        className="mb-2 inputContainer"
                        controlId="addTimeFormDate"
                      >
                        <Form.Label className="mb-0">
                          <strong>Date </strong>
                        </Form.Label>
                        <Form.Control
                          className="commonInpStyleNewJob"
                          type="text"
                          onFocus={(e) => (e.target.type = "date")}
                          onChange={(e) => {
                            console.log("date", e.target.value);
                            setDate(e.target.value);
                          }}
                          defaultValue={moment(date).format("DD/MM/YYYY")}
                          placeholder={"DD/MM/YY"}
                        />
                      </Form.Group>
                      <Form.Group
                        className="mb-2 inputContainer"
                        controlId="addTimeFormHours"
                      >
                        <Form.Label className="mb-0">
                          <strong>Hours </strong>
                        </Form.Label>
                        <Form.Control
                          className="commonInpStyleNewJob"
                          type="number"
                          defaultValue={hours}
                          onChange={(e) => {
                            let h = parseInt(e.target.value, 10);
                            setHours(h);
                          }}
                          value={hours}
                          placeholder={"0"}
                          min={0}
                        />

                        <button
                          className="addHours"
                          onClick={(e) => {
                            e.preventDefault();
                            handleAddWorkItem(sprint.id, date, hours);
                          }}
                        >
                          <img src={plusIconWhite} alt="plus icon" />
                        </button>
                      </Form.Group>
                    </Form>
                  </Col>

                  <Col>
                    <p style={{ textAlign: "center" }}>
                      <strong>Estimated Time : </strong>
                      {sprint?.job?.timeAllocated} hours
                    </p>
                    <div className="progressCont">
                      <p>Time remaining</p>
                      <p>
                        {parseInt(sprint?.job?.timeAllocated) -
                          parseInt(
                            workItems.reduce((acc, val) => {
                              return acc + val.hours;
                            }, 0)
                          )}
                      </p>
                      <p>Hours</p>
                      <CircularProgressbar
                        value={parseInt(
                          workItems.reduce((acc, val) => {
                            return acc + val.hours;
                          }, 0)
                        )}
                        maxValue={sprint?.job?.timeAllocated}
                        strokeWidth={18}
                      />
                    </div>
                  </Col>
                </Row>
                <hr></hr>
                <Row>
                  {workItems &&
                    workItems.map((workItem) => {
                      return (
                        <Stack
                          key={workItem.id}
                          className="mb-2"
                          direction="horizontal"
                          gap={4}
                        >
                          <strong>{workItem?.employee?.firstName}: </strong>
                          <p>{getUTCDate(workItem?.dateOfWork)}</p>
                          <p>{workItem.hours} hours</p>
                          <CloseButton
                            onClick={() => handleDeleteWorkItem(workItem?.id)}
                          />
                        </Stack>
                      );
                    })}
                </Row>
              </Form>
            )}
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default ViewSprintModal;
