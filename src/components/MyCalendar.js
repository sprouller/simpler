import { Calendar, momentLocalizer } from "react-big-calendar";
import { createContext, useState } from "react";
import moment from "moment";
import AddEventModal from "./AddEventModal";
import ViewSprintModal from "./ViewSprintModal";
import EditModal from "./EditModal";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import { Container, Row } from "react-bootstrap";
import { useEffect } from "react";
import plusIconWhite from "../images/plusIconWhite.svg";
import refreshIcon from "../images/refreshIcon.svg";

import {
  addJobAndSprintToAirtable,
  addSprintToExistingJobInTable,
  deleteJobFromTable,
  deleteSprintFromTable,
  editJobInTable,
  editSprintInTable,
  fetchClients,
  fetchEmployees,
  fetchOutOfOffice,
  fetchSprints,
} from "../controller/Airtable";
import LeftCalendarSec from "./LeftCalendarSec";
import ScheduleNewJob from "./ScheduleNewJob";
import { useCallback } from "react";
import OutOfOfficeModal from "./OutOfOfficeModal";

moment.tz.setDefault("Etc/GMT");
const localizer = momentLocalizer(moment);
localizer.segmentOffset = 0;

const DnDCalendar = withDragAndDrop(Calendar);

const monthsArr = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
moment.locale("ko", {
  week: {
    dow: 1,
    doy: 1,
  },
});
// react BasicCalendar component
const BasicCalendar = ({ handleClient }) => {
  const [sprints, setSprints] = useState([]);
  const [clients, setClients] = useState([]);
  const [employees, setEmployees] = useState([]);

  //states for creating event
  const [modalState, setModalState] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  //state for on select event
  const [sprintId, setSprintId] = useState("");
  const [altKeyDown, setAltKeyDown] = useState(false);
  const [dates, setDates] = useState({ firstDay: null, lastDay: null });
  console.log("This months Dates", dates);
  // calender view
  const [currentView, setCurrentView] = useState("month");
  const [filteredSprint, setFilteredSprint] = useState([]);
  const [showScheduleJobModal, setShowScheduleJobModal] = useState(false);
  const [logedUser, setLoggedUser] = useState({});
  const [selectedMonth, setSelectedMonth] = useState(moment().format("MMMM"));
  //outofoffice
  const [outOfficeModal, showOutOfficeModal] = useState(false);
  const [outOfOfficeData, setOutOfOfficeData] = useState([]);
  const [filteredOutOfOfficeData, setFilteredOutOfOfficeData] = useState([]);
  const [eventFltClicked, setIsEventFltClicked] = useState(false);
  const [fourWeekDate, setFourWeekDate] = useState({
    startWDate: null,
    endWDate: null,
  });
  useEffect(() => {
    fetchSprints().then((sprintsFromAirtable) => {
      setSprints(sprintsFromAirtable);
    });
    fetchClients().then((clientsFromAirtable) => {
      setClients(clientsFromAirtable);
    });
    fetchEmployees().then((employeesFromAirtable) => {
      setEmployees(employeesFromAirtable);
    });
    fetchOutOfOffice()
      .then((outData) => setOutOfOfficeData(outData))
      .catch((e) => console.log(e));
    // localStorage.getItem()
    // setLoggedUser(JSON.parse(localStorage?.getItem("userCred")));
    currentMonthsDates();
    console.log("localizer", localizer);
  }, []);

  // useEffect(() => {

  // }, [startDate, endDate]);

  console.log({ Sprint: sprints });
  console.log({ employees });
  console.log({ clients });

  // Attach event listeners to the window object to listen for keydown and keyup events
  window.addEventListener("keydown", handleKeyDown);
  window.addEventListener("keyup", handleKeyUp);

  // Event handler for keydown events
  function handleKeyDown(event) {
    // If the shift key is pressed, update the state
    if (event.key === "Alt") {
      setAltKeyDown(true);
    }
  }

  // Event handler for keyup events
  function handleKeyUp(event) {
    console.log({ event });
    // If the shift key is released, update the state
    if (event.key === "Alt") {
      setAltKeyDown(false);
    }
  }

  const handleClose = () => {
    setModalState("close");
  };

  const handleScheduleJob = async (job, sprint) => {
    console.log("handleScheduleJob");
    console.log({ sprint, job });
    await addJobAndSprintToAirtable(job, sprint);
    fetchSprints().then((sprintsFromAirtable) => {
      setSprints(sprintsFromAirtable);
      setModalState("close");
    });
  };

  const handleEditSprintAndJob = async (sprintData, jobData) => {
    console.log("EditJobData", sprintData, jobData);
    await editSprintInTable(sprintData);
    await editJobInTable(jobData);
    fetchSprints().then((sprintsFromAirtable) => {
      setSprints(sprintsFromAirtable);
      setModalState("view-modal");
    });
  };

  const handleDeleteSprint = async (sprintId) => {
    let jobId = selectedSprint.job.id;
    let shouldDeleteJob = false;
    if (sprints.filter((sprint) => sprint.job.id === jobId).length <= 1) {
      alert(
        "This is the last sprint in the job. Deleting this sprint also deletes the job."
      );
      shouldDeleteJob = true;
    }
    try {
      await deleteSprintFromTable(sprintId);
      if (shouldDeleteJob) {
        await deleteJobFromTable(jobId);
      }
      fetchSprints().then(async (sprintsFromAirtable) => {
        setSprints(sprintsFromAirtable);
        setModalState("close");
      });
    } catch (error) {
      console.error(error);
    }
  };

  // handles when a day is clicked (without event)
  const handleSlotSelectEvent = (slotInfo) => {
    // setStartDate(new Date(slotInfo.start));
    // setEndDate(new Date(slotInfo.end - 1));
    let dragStartDate = new Date(slotInfo?.start);
    let microSecondDate = new Date(Date.parse(slotInfo?.end));
    microSecondDate = microSecondDate.setDate(microSecondDate.getDate() - 1);
    let dragEndDate = new Date(microSecondDate);
    setStartDate(dragStartDate);
    setEndDate(dragEndDate);
    // setShowScheduleJobModal(!showScheduleJobModal);
    setModalState("add-modal");
  };

  //move event handler
  const moveEventHandler = async ({ event: sprint, start, end }) => {
    // let sprint = event;

    let sprintId = sprint.id;
    console.log({ sprint });
    let endDate = new Date(end);
    let minusOneEnd = new Date(end);
    minusOneEnd.setDate(endDate.getDate() - 1);
    // minusOneEnd.setDate(endDate.getDate() - 1);
    let sprintData = {
      sprintId,
      start_date: start,
      end_date: minusOneEnd,
      employeeId: sprint.employee.id,
    };
    try {
      if (altKeyDown) {
        console.log("dnd sprint duplicate!");
        await addSprintToExistingJobInTable(sprintData, sprint.job.id);
      } else {
        console.log("dnd sprint edit!");
        const tempSprints = sprints.filter((sprint) => sprint.id !== sprintId);
        setSprints(tempSprints);
        await editSprintInTable(sprintData);
      }
    } catch (error) {
      console.error(error);
    }
    fetchSprints().then(async (sprintsFromAirtable) => {
      setSprints(sprintsFromAirtable);
    });
  };

  //resize event handler
  // const resizeEventHandler = ({ event, start, end }) => {
  //   let updatedEvents = [];
  //   updatedEvents = events.filter((e) => {
  //     return e.id !== event.id;
  //   });
  //   setEvents([
  //     ...updatedEvents,
  //     {
  //       id: `${event.id}`,
  //       title: `${event.title}`,
  //       start: new Date(`${start}`),
  //       end: new Date(`${end}`),
  //     },
  //   ]);
  // };

  //on select event handler
  const handleOnSelectEvent = (e) => {
    console.log({ e });
    setStartDate(new Date(`${e.start}`));
    setEndDate(new Date(`${e.end}`));
    setSprintId(e.id);
    setModalState("view-modal");
  };

  const selectedSprint =
    sprints.length &&
    sprints.find((sprint) => {
      return sprint.id === sprintId;
    });

  console.log({ selectedSprint });

  const eventBg = (event) => {
    if (event?.item === "Holiday") {
      return "#ff5733";
    } else if (event?.item === "work from home") {
      return "#097969";
    } else {
      return event?.employee?.colour;
    }
  };

  const handleEventStyles = (event) => {
    let style;
    if (event?.item?.length > 0) {
      style = {
        backgroundColor: eventBg(event),
        borderRadius: "10px",
        color: "#fff",
        border: "0px",
        display: "block",
        width: "96.6%",
        marginLeft: "5px",
        hover: {
          visbility: "hidden",
        },
      };
    } else {
      if (
        event?.employee?.firstName === undefined ||
        event?.employee?.firstName?.length === 0
      ) {
        style = {
          display: "none",
        };
      } else {
        style = {
          backgroundColor: event?.employee?.colour,
          borderRadius: "10px",
          color: "#fff",
          border: "0px",
          display: "block",
          width: "96.6%",
          marginLeft: "5px",
          hover: {
            visbility: "hidden",
          },
        };
      }
    }
    return {
      style: style,
    };
  };

  const handleResizeEvent = async (event, start, end) => {
    console.log("event", event, startDate, endDate);
    let microSecondDate = new Date(Date.parse(end));
    microSecondDate = microSecondDate.setDate(microSecondDate.getDate() - 1);
    let dragEndDate = new Date(microSecondDate);
    console.log(".......Resize", event);

    setStartDate(event?.start);
    setEndDate(dragEndDate);
    const sprintData = {
      sprintId: event?.event?.id,
      start_date: start,
      end_date: dragEndDate,
      employeeId: event?.event?.employee?.id,
    };
    const res = await editSprintInTable(sprintData);
    fetchSprints().then((sprintsFromAirtable) => {
      setSprints(sprintsFromAirtable);
    });
    console.log(".......Res......", res);
  };
  const handleScheduleNewJobModal = () => {
    setShowScheduleJobModal(!showScheduleJobModal);
  };

  const handleOutOfOffice = () => {
    showOutOfficeModal(!outOfficeModal);
  };

  function getMonthStartAndEndDates(monthName, year) {
    const date = moment(`${monthName} ${year}`, "MMMM YYYY");
    let newStrDate = date.startOf("month").toDate();
    let newEndDate = date.endOf("month").toDate();
    return [newStrDate, newEndDate];
  }

  function currentMonthsDates(targetMonth) {
    if (targetMonth?.length > 0) {
      const [newStrDate, newEndDate] = getMonthStartAndEndDates(
        targetMonth,
        moment().format("YYYY")
      );
      setDates({
        firstDay: newStrDate,
        lastDay: newEndDate,
      });
    }
  }
  const handleRangeChange = (start, end) => {
    start = fourWeekDate.startWDate;
    end = fourWeekDate.endWDate;
    return { start, end };
  };
  const handleUtilData = (typeOfUtil) => {
    console.log("type", typeOfUtil);
    if (typeOfUtil) {
      let filteredData = outOfOfficeData?.filter((outData) => {
        return typeOfUtil?.name === outData?.item;
      });

      filteredData?.forEach((fltData) => {
        const isInclude = fltData?.start?.includes("GMT");
        if (isInclude === false) {
          const startDate = moment(fltData?.start, "DD/MM/YY").toDate();
          const fullStartDate = moment(startDate).format(
            "ddd, Do MMM YYYY h:mm:ss"
          );
          const endDate = moment(fltData?.end, "DD/MM/YY").toDate();
          const fullEndDate = moment(endDate).format(
            "ddd, Do MMM YYYY h:mm:ss"
          );
          console.log("form", isInclude, fullStartDate, fullEndDate);
          fltData.start = `${fullStartDate} GMT`;
          fltData.end = `${fullEndDate} GMT`;
        }
      });

      setFilteredOutOfOfficeData(filteredData);
    }
  };

  const handleNavigate = (e) => {
    console.log("event", e);
    return fourWeekDate.endWDate;
  };

  console.log("filter", filteredOutOfOfficeData, eventFltClicked);
  console.log("currentView", currentView);

  return (
    <div className="my-calendar">
      {/* <div> */}
      {/* Display a message indicating whether the shift key is being held down or not */}
      {/* <p>Alt key is {altKeyDown ? "down" : "up"}</p>
      </div> */}
      <Container className="calenderTopBar">
        <Row className="container-calenderTopBar">
          <div className="leftPart-calenderTopBar">
            <div>
              <p className="header__clientPageTitle">Scheduling</p>
            </div>
            <div>
              <select
                className="monthSelect-calenderTopBar"
                onChange={(e) => {
                  currentMonthsDates(e.target.value);
                  setSelectedMonth(e.target.value);
                  setFilteredOutOfOfficeData([]);
                }}
                // defaultValue={}
                value={selectedMonth}
                // onClick={() => setCurrentView("month")}
              >
                {monthsArr.map((data) => {
                  return <option value={data}> {data}</option>;
                })}
              </select>

              <button
                className="btnScheduler-calenderTopBar"
                onClick={() => {
                  setFilteredOutOfOfficeData([]);
                }}
              >
                {moment().format("YYYY")}
              </button>
              <button
                className="btnScheduler-calenderTopBar"
                onClick={() => {
                  setCurrentView("month");
                  setSelectedMonth(moment().format("MMMM"));
                  currentMonthsDates(moment().format("MMMM"));
                  setFilteredOutOfOfficeData([]);
                }}
              >
                Month
              </button>

              <button
                className="btnScheduler-calenderTopBar"
                onClick={() => {
                  // setCurrentView("4 weeks");
                  const today = new Date();
                  const fourWeeksLater = moment(today).add(4, "weeks").toDate();
                  console.log("four week Later", fourWeeksLater);
                  setFourWeekDate({
                    startWDate: today,
                    endWDate: fourWeeksLater,
                  });
                  setCurrentView("month");
                  handleNavigate();
                  // handleRangeChange(today, fourWeeksLater);
                  setFilteredOutOfOfficeData([]);
                }}
              >
                4 Weeks
              </button>
              <button
                className="btnScheduler-calenderTopBar"
                onClick={() => {
                  setCurrentView("week");
                  setFilteredOutOfOfficeData([]);
                }}
              >
                Week
              </button>
              <button
                className="btnScheduler-calenderTopBar"
                onClick={() => {
                  setCurrentView("day");
                  setFilteredOutOfOfficeData([]);
                }}
              >
                Day
              </button>
            </div>
          </div>
          <div className="rightPart-calenderTopBar">
            <button
              className="btn-newClient-header__clientPage"
              style={{ marginLeft: "0px" }}
              // onClick={() => showOutOfficeModal(!outOfficeModal)}
              onClick={handleOutOfOffice}
            >
              <img src={plusIconWhite} alt="plus icon white" />
              Out of office
            </button>
            <button
              className="btn-newClient-header__clientPage"
              onClick={handleScheduleNewJobModal}
            >
              <img src={plusIconWhite} alt="plus icon white" />
              New job
            </button>
            <div
              className="refreshIcon-header__clientPage"
              onClick={() => setFilteredSprint([])}
            >
              <img src={refreshIcon} alt="refresh icon" />
            </div>
          </div>
        </Row>
      </Container>
      <div className="mainCalenderContainer">
        <LeftCalendarSec
          employees={[...employees]}
          currSprint={sprints}
          setFilteredSprint={setFilteredSprint}
          handleUtilData={handleUtilData}
          setIsEventFltClicked={setIsEventFltClicked}
          setFilteredOutOfOfficeData={setFilteredOutOfOfficeData}
        />

        <DnDCalendar
          localizer={localizer}
          events={
            eventFltClicked === false
              ? sprints
              : filteredOutOfOfficeData?.length > 0
              ? filteredOutOfOfficeData
              : filteredSprint
          }
          showAllEvents={true}
          components={{
            month: {
              event: (props) => {
                return (
                  <>
                    {typeof props?.event?.employee === "object" ? (
                      <div className="cellEvent__myCalendar">
                        <span>
                          {props?.event?.job?.client?.name?.length
                            ? props?.event?.job?.client?.name
                            : "XXXX"}
                        </span>{" "}
                        |
                        <span>
                          {props?.event?.job?.job_code?.length > 0
                            ? ` ${props?.event?.job?.job_code}`
                            : " none"}{" "}
                        </span>
                        |{" "}
                        <span>
                          {" "}
                          {props?.event?.employee?.firstName?.length > 0
                            ? props?.event?.employee?.firstName
                            : "XXXX"}
                        </span>
                      </div>
                    ) : (
                      <div className="cellEvent__myCalendar">
                        <span>
                          Employee :{" "}
                          {props?.event?.employee?.length
                            ? props?.event?.employee
                            : "XXXX"}
                        </span>{" "}
                        |
                        <span>
                          {" "}
                          {props?.event?.item?.length > 0
                            ? `${props?.event?.item}`
                            : " none"}{" "}
                        </span>
                        |{" "}
                        <span>
                          {" "}
                          description :{" "}
                          {props?.event?.description?.length
                            ? props?.event?.description
                            : "XXXX"}
                        </span>
                      </div>
                    )}
                  </>
                );
              },
              dateHeader: (props) => {
                // console.log("propsoos", props.date);
                const date = moment(props.date);
                return (
                  <div className="cellOptions__myCalendar">
                    <p className="day-cellOptions__myCalendar">
                      {date.format("dddd")}
                    </p>
                    <p className="date-cellOptions__myCalendar">
                      {props.label}
                    </p>
                  </div>
                );
              },
            },
          }}
          view={currentView}
          date={(dates.firstDay, dates.lastDay)}
          showMultiDayTimes
          defaultView={"month"}
          startAccessor={(e) => {
            let startDate = new Date(e.start);
            return startDate;
            // if (!e) return "start";
            // console.log({ e });
            // let startDate = new Date(e.start);
            // console.log({ startDate });
            // return startDate;
          }}
          endAccessor={(e) => {
            let addOneDay = new Date(e.end);
            // addOneDay.setDate(addOneDay.getDate() - 1);
            addOneDay.setDate(addOneDay.getDate() + 1);
            return addOneDay;
            //return endDate;
            // if (!e) return "end";
            // const addOneDay = new Date();
            // let endDate = new Date(e.end);
            // addOneDay.setDate(endDate.getDate() + 1);
            // return addOneDay;
          }}
          min={dates.firstDay}
          max={dates.lastDay}
          selectable
          // onRangeChange={(e) => {
          //   handleRangeChange(e.start, e.end);
          // }}
          onSelectSlot={handleSlotSelectEvent}
          onSelectEvent={handleOnSelectEvent}
          onEventDrop={moveEventHandler}
          resizable
          onNavigate={handleNavigate}
          onEventResize={(e) => {
            handleResizeEvent(e, e?.start, e?.end);
          }}
          longPressThreshold={10}
          eventPropGetter={handleEventStyles}
        />
      </div>
      <AddEventModal
        modalState={modalState}
        startDate={startDate}
        endDate={endDate}
        clients={clients}
        employees={employees}
        handleClose={handleClose}
        handleScheduleJob={handleScheduleJob}
        sprint={sprints}
      />
      <ViewSprintModal
        modalState={modalState}
        sprint={selectedSprint}
        employees={employees}
        setModalState={setModalState}
        handleClose={handleClose}
        handleDeleteSprint={handleDeleteSprint}
        logedUser={logedUser}
      />

      <EditModal
        modalState={modalState}
        sprint={selectedSprint}
        sprints={sprints}
        startDate={startDate}
        endDate={endDate}
        clients={clients}
        employees={employees}
        setModalState={setModalState}
        handleClose={handleClose}
        handleEditSprintAndJob={handleEditSprintAndJob}
        handleDeleteSprint={handleDeleteSprint}
      />
      <ScheduleNewJob
        showScheduleJobModal={showScheduleJobModal}
        setShowScheduleJobModal={setShowScheduleJobModal}
        clients={clients}
        sprint={sprints}
        startDate={startDate}
        endDate={endDate}
        employees={employees}
        handleScheduleJob={handleScheduleJob}
      />
      <OutOfOfficeModal
        showOutOfficeModal={showOutOfficeModal}
        outOfOfficeModal={outOfficeModal}
        employees={employees}
        setSh
      />
    </div>
  );
};

export default BasicCalendar;
