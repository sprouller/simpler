import React, { useState, useEffect } from "react";
import closeIcon from "../images/closeIcon.svg";
import { Col, Form, Modal, ModalBody, ModalHeader, Row } from "react-bootstrap";
import moment from "moment";
import "moment-timezone";

function ScheduleNewJob({
  showScheduleJobModal,
  setShowScheduleJobModal,
  clients,
  sprint,
  startDate,
  endDate,
  employees,
  handleScheduleJob,
}) {
  const [activeBtn, setActiveBtn] = useState(false);
  const [clientId, setClientId] = useState("");
  const [subBrand, setSubBrands] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [jobCode, setJobCode] = useState("");
  const [jobName, setJobName] = useState("");
  const [timeAllocated, setTimeAllocated] = useState(0);
  const [employeeId, setEmployeeId] = useState("");
  const [description, setDescription] = useState("");
  const [thirdPartyItem, setThirdPartyItem] = useState("");
  const [thirdPartyCost, setThirdPartyCost] = useState(0);
  const [isLiveJob, setIsLiveJob] = useState(true);

  useEffect(() => {
    setStart(getStartDateText());
    setEnd(getEndDateText());
    clientId && setJobCode();
  }, [startDate, endDate]);

  console.log("start....xyz", startDate, "bcb", endDate);

  const getStartDateText = (e) => {
    const date = new Date();
    if (e) {
      return moment.utc(e).format("DD/MM/YY");
    }
    return moment.utc(date).format("DD/MM/YY");
  };

  const getEndDateText = (e) => {
    const date = new Date();
    if (e) {
      return moment.utc(e).format("DD/MM/YY");
    }
    return moment.utc(date).format("DD/MM/YY");
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

  return (
    <>
      <Modal show={showScheduleJobModal} className="scheduleNewJobModal">
        <ModalHeader>
          <h2 className="header__clientPageTitle">Schedule a job</h2>
          <div className="btnCont__scheduleNewJobModal">
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
                const sprint = {
                  start: moment(
                    `${start.replace("/", "").trim()}`,
                    "DDMMYY"
                  ).format("yyyy[-]MM[-]DD"),
                  end: moment(
                    `${end.replace("/", "").trim()}`,
                    "DDMMYY"
                  ).format("yyyy[-]MM[-]DD"),
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
                if (start && end && jobName && jobCode && description)
                  handleScheduleJob(job, sprint);
                setStart("");
                setEnd("");
                setJobName("");
                setTimeAllocated(0);
                setDescription("");
                setJobCode("");
                setShowScheduleJobModal(!showScheduleJobModal);
              }}
            >
              save
            </button>
            <button
              className="closeIconBtn"
              onClick={() => setShowScheduleJobModal(!showScheduleJobModal)}
            >
              <img src={closeIcon} alt="close icon" />
            </button>
          </div>
        </ModalHeader>
        {isLiveJob ? (
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
              <Row
                className="mx-2 py-3"
                style={{ borderTop: "1px solid #ededed" }}
              >
                <Form.Label className="fieldTitle__scheduleNewJobModal">
                  Date
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
                      From
                    </Form.Label>
                    <Form.Control
                      className="commonInpStyleNewJob"
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
                <Col className="p-0">
                  <Form.Group
                    className="mb-1 "
                    controlId="endDateInputAdd"
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    <Form.Label
                      style={{ marginRight: "10px", marginBottom: "0" }}
                    >
                      To
                    </Form.Label>
                    <Form.Control
                      className="commonInpStyleNewJob"
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
                <Col className="p-0" style={{ marginRight: "15px" }}>
                  <Form.Group className="mb-1" controlId="startDateInputAdd">
                    <Form.Label
                      style={{ marginBottom: "3px", fontWeight: "600" }}
                    >
                      Estimated time allocated
                    </Form.Label>
                    <Form.Control
                      className="commonInpStyleNewJob"
                      type="number"
                      defaultValue={0}
                      onChange={(e) => setTimeAllocated(e.target.value)}
                      placeholder={"5"}
                      min={0}
                    />
                  </Form.Group>
                </Col>
                <Col className="p-0">
                  <Form.Group className="mb-1 " controlId="endDateInputAdd">
                    <Form.Label
                      style={{ marginBottom: "3px", fontWeight: "600" }}
                    >
                      Assign to Designer(s)
                    </Form.Label>
                    <Form.Select
                      className="commonInpStyleNewJob"
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
              <Row
                className="mx-2 py-3"
                style={{ borderTop: "1px solid #ededed" }}
              >
                <Form.Label
                  className="fieldTitle__scheduleNewJobModal"
                  style={{ marginBottom: "15px" }}
                >
                  Third party costs
                </Form.Label>
                <Col className="p-0">
                  <Form.Group
                    className="mb-1 "
                    controlId="endDateInputAdd"
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    <Form.Label
                      style={{ marginRight: "10px", marginBottom: "0" }}
                    >
                      Item
                    </Form.Label>
                    <Form.Control
                      className="commonInpStyleNewJob"
                      type="text"
                      onChange={(e) => setThirdPartyItem(e.target.value)}
                      defaultValue={""}
                      placeholder={"Third Party Item"}
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
                      style={{
                        marginRight: "10px",
                        marginBottom: "0",
                        whiteSpace: "pre",
                        marginLeft: "10px",
                      }}
                    >
                      Cost £
                    </Form.Label>
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
              <Row
                className="mx-2 py-3"
                style={{ borderTop: "1px solid #ededed" }}
              >
                <Form.Label className="fieldTitle__scheduleNewJobModal">
                  Date
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
                      From
                    </Form.Label>
                    <Form.Control
                      className="commonInpStyleNewJob"
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
                <Col className="p-0">
                  <Form.Group
                    className="mb-1 "
                    controlId="endDateInputAdd"
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    <Form.Label
                      style={{ marginRight: "10px", marginBottom: "0" }}
                    >
                      To
                    </Form.Label>
                    <Form.Control
                      className="commonInpStyleNewJob"
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

export default ScheduleNewJob;
