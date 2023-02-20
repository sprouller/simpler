import { Calendar, momentLocalizer } from "react-big-calendar";
import { useState } from "react";
import moment from "moment";
import moment_timezone from "moment-timezone";
import AddEventModal from "./AddEventModal";
import ViewSprintModal from "./ViewSprintModal";
import EditModal from "./EditModal";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import { Container, Row } from "react-bootstrap";
import { useEffect } from "react";
import plusIconWhite from "../images/plusIconWhite.svg";
import refreshIcon from "../images/refreshIcon.svg";
import eyeIcon from "../images/eye.svg";

import {
  addJobAndSprintToAirtable,
  addSprintToExistingJobInTable,
  deleteJobFromTable,
  deleteSprintFromTable,
  editJobInTable,
  editSprintInTable,
  fetchClients,
  fetchEmployees,
  fetchSprints,
} from "../controller/Airtable";
import LeftCalendarSec from "./LeftCalendarSec";
import ScheduleNewJob from "./ScheduleNewJob";

moment.tz.setDefault("Etc/GMT");
const localizer = momentLocalizer(moment);
localizer.segmentOffset = 0;

const DnDCalendar = withDragAndDrop(Calendar);

// react BasicCalendar component
const BasicCalendar = () => {
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
  console.log("date.....", startDate, endDate);

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
    currentMonthsDates();
    console.log("localizer", localizer);
  }, []);

  // useEffect(() => {

  // }, [startDate, endDate]);

  console.log({ sprints });
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
  const hanldeOnSelectEvent = (e) => {
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

  const handleEventStyles = (event) => {
    const style = {
      backgroundColor: event?.employee?.colour,
      borderRadius: "10px",
      color: "white",
      border: "0px",
      display: "block",
      hover: {
        visbility: "hidden",
      },
    };
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
  function currentMonthsDates() {
    var date = new Date();
    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    const dateTime1 = moment(firstDay).format("YYYY-MM-DD");
    const dateTime2 = moment(lastDay).format("YYYY-MM-DD");
    setDates({
      firstDay: dateTime1,
      lastDay: dateTime2,
    });
  }

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
              <button
                className="btnScheduler-calenderTopBar"
                onClick={() => setCurrentView("year")}
              >
                {moment().format("MMMM")}
              </button>
              <button
                className="btnScheduler-calenderTopBar"
                onClick={() => setCurrentView("year")}
              >
                Year
              </button>
              <button
                className="btnScheduler-calenderTopBar"
                onClick={() => setCurrentView("month")}
              >
                Month
              </button>
              <button
                className="btnScheduler-calenderTopBar"
                onClick={() => setCurrentView("4 weeks")}
              >
                4 Week
              </button>
              <button
                className="btnScheduler-calenderTopBar"
                onClick={() => setCurrentView("week")}
              >
                Week
              </button>
              <button
                className="btnScheduler-calenderTopBar"
                onClick={() => setCurrentView("day")}
              >
                Day
              </button>
            </div>
          </div>
          <div className="rightPart-calenderTopBar">
            <button
              className="btn-newClient-header__clientPage"
              style={{ marginLeft: "0px" }}
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
        />

        <DnDCalendar
          localizer={localizer}
          events={filteredSprint?.length > 0 ? filteredSprint : sprints}
          // min={dates.firstDay}
          // max={dates.lastDay}
          // views={["month", "week"]}
          view={currentView}
          date={new Date()}
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
          // allDayAccessor="allDay"
          selectable
          onSelectSlot={handleSlotSelectEvent}
          onSelectEvent={hanldeOnSelectEvent}
          onEventDrop={moveEventHandler}
          resizable
          onEventResize={(e) => {
            handleResizeEvent(e, e?.start, e?.end);
          }}
          // onEventResize={resizeEventHandler}
          // onSelecting={slot => false}
          longPressThreshold={10}
          eventPropGetter={handleEventStyles}
          // resizableAccessor
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
    </div>
  );
};

export default BasicCalendar;
