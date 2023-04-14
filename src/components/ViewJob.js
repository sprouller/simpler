import React, { useEffect, useState } from "react";
import { Col, Form, Modal, Row, Stack } from "react-bootstrap";
import closeIcon from "../images/closeIcon.svg";
import {
  addWorkItemToAirtable,
  deleteWorkItemFromTable,
  fetchSprints,
  fetchWorkItemsByJobId,
} from "../controller/Airtable";
import plusIconWhite from "../images/plusIconWhite.svg";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import moment from "moment-timezone";
import CloseButton from "react-bootstrap/CloseButton";
import "react-circular-progressbar/dist/styles.css";

function ViewJob({ setIsJobOpen, isJobModalOpen, job, sprint, employee }) {
  const [fltSprint, setFltSprint] = useState(null);
  const [isLiveJob, setIsLiveJob] = useState(true);
  const [activeBtn, setActiveBtn] = useState(false);
  const [workItems, setworkItems] = useState([]);
  const [date, setDate] = useState();
  const [hours, setHours] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const filterEmp = async () => {
    let dataArr = [];
    await sprint.map((data) => {
      if (data.job.id === job.id) {
        return dataArr.push(data);
      }
    });
    console.log();
    setFltSprint(dataArr[0]);
    setLoaded(true);
  };
  const getUTCDate = (date) => {
    return moment.utc(date).format("DD/MM/YYYY");
  };
  const todaysDate = () => {
    let date = new Date();
    let todayDate = moment(date).format("YYYY-MM-DD");
    setDate(todayDate);
  };

  const handleAddWorkItem = async (sprintId, date, hours) => {
    try {
      await addWorkItemToAirtable(sprintId, date, hours);
      const workItems = await fetchWorkItemsByJobId(fltSprint.job.id);
      setworkItems(workItems);

      setHours(0); // not working
    } catch (error) {
      console.log({ error });
    }
  };

  const handleDeleteWorkItem = async (workItemId) => {
    await deleteWorkItemFromTable(workItemId);
    fetchWorkItemsByJobId(fltSprint.job.id).then((workItems) => {
      setworkItems(workItems);
    });
  };

  useEffect(() => {
    setTimeout(() => {
      filterEmp();
      todaysDate();
      fetchWorkItemsByJobId(fltSprint?.job?.id).then((workItems) => {
        setworkItems(workItems);
      });
    }, 200);
  }, [activeBtn === true]);

  return (
    <>
      {loaded && (
        <Modal show={isJobModalOpen} centered className="edit-event-modal">
          <Modal.Header>
            <Modal.Title style={{ marginRight: "200px" }}>
              {fltSprint?.job?.name}
            </Modal.Title>
            <button
              className="closeIconBtn"
              onClick={() => {
                setIsJobOpen(!isJobModalOpen);
              }}
            >
              <img src={closeIcon} alt="close icon" />
            </button>
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
                        <p>{fltSprint?.job?.client.name}</p>
                      </Stack>
                    </Col>
                    <Col>
                      <Stack direction="horizontal" gap={2}>
                        <strong>Job Code:</strong>
                        <p>{fltSprint?.job?.job_code}</p>
                      </Stack>
                    </Col>
                  </Row>
                  <Row className="mb-2">
                    <Col>
                      <Stack direction="horizontal" gap={2}>
                        <strong>Sub Brand: </strong>
                        <p>{fltSprint?.job?.subBrand}</p>
                      </Stack>
                    </Col>
                    <Col>
                      <Stack direction="horizontal" gap={2}>
                        <strong>Job Name:</strong>
                        <p>{fltSprint?.job?.name}</p>
                      </Stack>
                    </Col>
                  </Row>
                  <hr></hr>
                  <Row className="mb-2">
                    <Col>
                      <Stack direction="horizontal" gap={2}>
                        <strong>Date From: </strong>
                        <p>{fltSprint?.start}</p>
                      </Stack>
                    </Col>
                    <Col>
                      <Stack direction="horizontal" gap={2}>
                        <strong>Date To:</strong>
                        <p>{fltSprint?.end}</p>
                      </Stack>
                    </Col>
                  </Row>
                  <Row className="mb-2">
                    <Col>
                      <Stack direction="horizontal" gap={2}>
                        <strong>Time Allocated: </strong>
                        <p>{fltSprint?.job?.timeAllocated} hours</p>
                      </Stack>
                    </Col>
                    <Col>
                      <Stack direction="horizontal" gap={2}>
                        <strong>Employee:</strong>
                        <p>{fltSprint?.employee?.firstName}</p>
                      </Stack>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <p>{fltSprint?.job?.description}</p>
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
                          <Form.Control
                            className="commonInpStyleNewJob"
                            type="text"
                            defaultValue={fltSprint?.employee?.firstName}
                          />
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
                              handleAddWorkItem(fltSprint.id, date, hours);
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
                        {fltSprint?.job?.timeAllocated} hours
                      </p>
                      <div className="progressCont">
                        <p>Time remaining</p>
                        <p>
                          {parseInt(fltSprint?.job?.timeAllocated) -
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
                          maxValue={fltSprint?.job?.timeAllocated}
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
                            {/* <strong>{workItem?.employee?.firstName}: </strong> */}
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
      )}
    </>
  );
}

export default ViewJob;
