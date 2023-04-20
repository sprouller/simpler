import moment from "moment-timezone";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  fetchClients,
  fetchJobs,
  fetchWorkItemsByJobId,
} from "../controller/Airtable";
import flower from "../images/flower-green.svg";
import pdf from "../images/pdf.svg";
import refreshIcon from "../images/refreshIcon.svg";
import searchIcon from "../images/searchIcon.svg";
import EditClientModal from "./EditClientModal";
import Loader from "./Loader";
import SingleJob from "./SingleJob";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

export const monthsArr = [
  { index: 1, name: "January" },
  { index: 2, name: "February" },
  { index: 3, name: "March" },
  { index: 4, name: "April" },
  { index: 5, name: "May" },
  { index: 6, name: "June" },
  { index: 7, name: "July" },
  { index: 8, name: "August" },
  { index: 9, name: "September" },
  { index: 10, name: "October" },
  { index: 11, name: "November" },
  { index: 12, name: "December" },
];

function SpecificClient({ sprint }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [clt, setClt] = useState([]);
  const [jobWithClt, setJobWithClt] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [editCltModal, showEditClientModal] = useState(false);
  const [searchJob, setSearchJob] = useState("");
  const [filterJobs, setFiltersJob] = useState([]);
  const [thirdPartySearch, setThirdPartySearch] = useState("");
  const [filterThirdJobs, setFiltersThirdJob] = useState([]);
  const [allJobs, setAllJobs] = useState([]);
  const [isJobFetch, setIsJobFetch] = useState(false);
  const [workItem, setAllWorkItem] = useState([]);
  const [monthTrackData, setMonthTrackData] = useState([]);
  const [triggerMonthFunc, setTriggerMonthFunc] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [filteredSelect, setFilteredSelect] = useState({});

  function fetchJobDetails() {
    fetchJobs()
      .then((jobs) => {
        setAllJobs(jobs);
        setIsLoaded(true);
      })
      .catch((e) => console.log(e));
  }

  function getDetails() {
    fetchClients()
      .then((data) => {
        let filteredData = data.filter(
          (eachClt) => eachClt.id === location.pathname.slice(8)
        );
        setIsJobFetch(true);
        setClt(filteredData[0]);
      })
      .catch((e) => console.log(e));
  }

  useEffect(() => {
    setTimeout(() => {
      getDetails();
      fetchJobDetails();
    }, 100);
  }, []);

  useEffect(() => {
    isJobFetch === true && filterJobsWithClt();
  }, [isLoaded]);

  useEffect(() => {
    fetchMonths();
  }, [triggerMonthFunc]);

  const filterJobsWithClt = () => {
    isLoaded &&
      clt?.jobs?.forEach((jobId) => {
        allJobs?.forEach((singleJob) => {
          console.log("job", singleJob);
          if (jobId === singleJob?.id) {
            setJobWithClt((prevState) => [...prevState, singleJob]);
            setFiltersJob((prevState) => [...prevState, singleJob]);
            fetchWorkItemsByJobId(jobId)
              .then((data) => setAllWorkItem((prev) => [...prev, data]))
              .catch((e) => console.log(e));
            setTriggerMonthFunc(!triggerMonthFunc);
          }
        });
      });
  };

  const filterSearchJob = (e, type) => {
    if (type === "project") {
      let filterJob = jobWithClt.filter((data) => {
        return e.target.value?.length > 0
          ? data.job_name
              .toLowerCase()
              .includes(e.target.value.toLocaleLowerCase())
          : data;
      });

      setFiltersJob(filterJob);
    }

    if (type === "third") {
      let filterJob = jobWithClt.filter((data) => {
        return e.target.value?.length > 0
          ? data.description
              .toLowerCase()
              .includes(e.target.value.toLocaleLowerCase())
          : data;
      });

      setFiltersThirdJob(filterJob);
    }
  };

  function fetchMonths() {
    const monthWithTime = [];
    jobWithClt &&
      jobWithClt?.forEach((job) => {
        monthsArr?.forEach((month) => {
          if (parseInt(job?.created_at?.slice(5, 7)) === month.index) {
            monthWithTime.push({
              monthDetail: month,
              jobDetail: [job],
              timeSpent: 0,
              remainTime: 0,
            });
          }
        });
      });

    const mergedArr = monthWithTime.reduce((acc, curr) => {
      const index = acc.findIndex(
        (el) => el?.monthDetail?.index === curr?.monthDetail?.index
      );
      if (index === -1) {
        acc.push(curr);
      } else {
        acc[index]?.jobDetail.push(curr?.jobDetail[0]);
      }
      return acc;
    }, []);

    setMonthTrackData(mergedArr);
  }

  const calcTime = (arr) => {
    let totalTimeSpent = 0;
    let totalRemainTime = 0;

    arr?.forEach((job) => {
      if (job?.time_allocated === "" && job?.remainTime !== "") {
        totalTimeSpent = totalRemainTime + 0;
        totalRemainTime = totalRemainTime + 0;
      }
      let getSpentTime = job?.time_allocated - job?.remainTime;
      if (job?.time_allocated !== "")
        totalTimeSpent = totalTimeSpent + getSpentTime;
      if (job?.remainTime !== "")
        totalRemainTime = totalRemainTime + job?.remainTime;
    });

    return { totalTimeSpent, totalRemainTime };
  };

  return (
    <>
      <div className="clientPage">
        <div className="header__clientPage">
          <div className="d-flex" style={{ alignItems: "center" }}>
            {clt?.comp_logo ? (
              <img
                width="30px"
                height="30px"
                src={clt?.comp_logo[0]?.url}
                alt={clt.name}
              />
            ) : (
              <img width="30px" height="30px" src={flower} alt={clt.name} />
            )}
            <p className="mx-3 header__clientPageTitle">{clt.name}</p>
          </div>
          <div className="rightPart-header__clientPage">
            <button
              className="edit-client__clientPage"
              onClick={() => {
                showEditClientModal(!editCltModal);
              }}
            >
              edit client
            </button>
            <button
              className="btn-newClient-header__clientPage "
              style={{ background: "#9D9D9D" }}
              onClick={() => navigate("/client")}
            >
              Back
            </button>
            <button className="btn-newClient-header__clientPage mx-3 mb-0 ">
              <img src={pdf} alt="pdf image" />
              PDF
            </button>
            <div className="refreshIcon-header__clientPage">
              <img
                src={refreshIcon}
                alt="refresh icon"
                onClick={() => {
                  getDetails();
                  // filterJobsWithClt();
                }}
              />
            </div>
          </div>
        </div>

        <div
          className="detailsContainer__clientPage"
          style={{
            boxShadow: "6px 0px 12px #e7e7e7",
            borderRadius: "20px",
          }}
        >
          <div
            className="projectBased-detailsContainer__clientPage commonContainer-detailsContainer__clientPage"
            style={{
              width: "60%",
              marginRight: "0",
              borderTopLeftRadius: "20px",
              borderBottomLeftRadius: "20px",
              borderTopRightRadius: "0px",
              borderBottomRightRadius: "0px",
              boxShadow: "none",
            }}
          >
            <p>Projects</p>
            <div className="searchContainer-detailsContainer__clientPage">
              <img src={searchIcon} alt="search icon" />
              <input
                value={searchJob}
                onChange={(e) => {
                  setSearchJob(e.target.value);
                  filterSearchJob(e, "project");
                }}
                type="text"
                placeholder="Search job name"
              />
            </div>
            <div className="tableCont__specificClient">
              <table className="table__specificClient">
                <tr>
                  <th>Job code</th>
                  <th>Job name</th>
                  <th>Date</th>
                  <th>Remaining time (hrs)</th>
                  <th>Time allocated (hrs)</th>
                </tr>
                {/* below data is dynamic  */}
                {filterJobs?.length === 0 ? (
                  <>
                    {jobWithClt?.map((eachJob, index) => {
                      let convertDate = moment
                        .utc(eachJob?.created_at)
                        .format("DD/MM/YY");
                      return (
                        <tr key={index}>
                          <td>
                            {eachJob?.job_code?.length > 0
                              ? eachJob?.job_code
                              : "- - -"}
                          </td>
                          <td>
                            {eachJob?.job_name?.length > 0
                              ? eachJob?.job_name
                              : "- - -"}
                          </td>
                          <td>
                            {convertDate?.length > 0 ? convertDate : "DD/MM/YY"}
                          </td>
                          <td>{"- - -"}</td>
                          <td>
                            {eachJob?.time_allocated?.length > 0
                              ? eachJob?.time_allocated
                              : "- - -"}
                          </td>
                        </tr>
                      );
                    })}
                  </>
                ) : (
                  <>
                    {filterJobs?.map((eachJob, index) => {
                      let convertDate = moment
                        .utc(eachJob?.created_at)
                        .format("DD/MM/YY");

                      return (
                        <SingleJob
                          key={index}
                          convertDate={convertDate}
                          eachJob={eachJob}
                          sprint={sprint}
                          fetchJobDetails={fetchJobDetails}
                        />
                      );
                    })}
                  </>
                )}
              </table>
            </div>
          </div>
          <div
            className="ml-0 retainerBased-detailsContainer__clientPage commonContainer-detailsContainer__clientPage"
            style={{
              width: "50%",
              marginLeft: "0",
              borderTopRightRadius: "20px",
              borderBottomRightRadius: "20px",
              boxShadow: "none",
              borderTopLeftRadius: "0px",
              borderBottomLeftRadius: "0px",
              overflow: "hidden",
            }}
          >
            <div>
              {clt?.client_type === "Retainer" && (
                <div className="retainerTrackerCont">
                  <div
                    style={{
                      height: "150px",
                      marginBottom: "30px",
                      minWidth: "180px",
                      maxWidth: "200px",
                      position: "relative",
                    }}
                  >
                    <div className="timeFilter-cont">
                      <div className="timeFilter-cont-inner">
                        <p className="timeFilter-cont-inner-title">
                          Time spent
                        </p>
                        <p className="timeFilter-cont-inner-val">
                          {filteredSelect?.totalTimeSpent
                            ? filteredSelect?.totalTimeSpent
                            : "00"}
                          hrs
                        </p>
                      </div>
                      <select
                        value={selectedMonth}
                        onChange={(e) => {
                          setSelectedMonth(e.target.value);
                          monthTrackData.forEach((data) => {
                            if (data?.monthDetail?.name === e.target.value) {
                              let timeThing = calcTime(data?.jobDetail);
                              setFilteredSelect(timeThing);
                            }
                          });
                        }}
                      >
                        <option value="select">select</option>
                        {monthTrackData.map((eachData) => {
                          return (
                            <option value={eachData?.monthDetail?.name}>
                              {eachData?.monthDetail?.name}
                            </option>
                          );
                        })}
                      </select>

                      <div className="timeFilter-cont-inner">
                        <p className="timeFilter-cont-inner-title">
                          Time remaining
                        </p>
                        <p className="timeFilter-cont-inner-val">
                          {filteredSelect?.totalRemainTime
                            ? filteredSelect?.totalRemainTime
                            : "00"}
                          hrs
                        </p>
                      </div>
                    </div>

                    <CircularProgressbar
                      value={filteredSelect?.totalRemainTime}
                      maxValue={filteredSelect?.totalTimeSpent}
                      strokeWidth={10}
                      className="retainer-progressBar"
                    />
                  </div>
                  <div className="monthTracking">
                    {monthTrackData.map((eachData) => {
                      let timeDetails = calcTime(eachData?.jobDetail);

                      return (
                        <div>
                          <p className="month-monthTracking">
                            {eachData?.monthDetail?.name}
                          </p>

                          <div className="timeCont-monthTracking">
                            <p>
                              Time spent
                              <span>{timeDetails.totalTimeSpent} hrs</span>
                            </p>
                            <p>
                              Time remaining
                              <span className="remainTime-monthTracking">
                                {timeDetails.totalRemainTime} hrs
                              </span>
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div style={{ height: "50%" }}>
                <p>Third party cost</p>
                <div className="searchContainer-detailsContainer__clientPage">
                  <img src={searchIcon} alt="search icon" />
                  <input
                    value={thirdPartySearch}
                    onChange={(e) => {
                      setThirdPartySearch(e.target.value);
                      filterSearchJob(e, "third");
                    }}
                    type="text"
                    placeholder="Search with description"
                  />
                </div>
                <div
                  className="tableCont__specificClient retainer-scrollView"
                  style={
                    clt?.client_type === "Retainer"
                      ? { height: "37vh" }
                      : { height: "66vh" }
                  }
                >
                  <table className="table__specificClient">
                    <tr>
                      <th style={{ width: "50%" }}>Description</th>
                      <th>Date</th>
                      <th>cost</th>
                    </tr>
                    {/* below data is dynamic  */}
                    {filterThirdJobs?.length > 0 ? (
                      <>
                        {filterThirdJobs?.map((eachJob, index) => {
                          let convertDate = moment
                            .utc(eachJob?.created_at)
                            .format("DD/MM/YY");
                          return (
                            <tr key={index}>
                              <td>
                                {eachJob?.description?.length > 0
                                  ? eachJob?.description
                                  : "- - -"}
                              </td>
                              <td>
                                {convertDate?.length > 0
                                  ? convertDate
                                  : "DD/MM/YY"}
                              </td>
                              <td>
                                {eachJob?.Third_party_cost?.length > 0
                                  ? `£ ${eachJob?.Third_party_cost}`
                                  : "- - -"}
                              </td>
                            </tr>
                          );
                        })}
                      </>
                    ) : (
                      <>
                        {jobWithClt?.map((eachJob, index) => {
                          let convertDate = moment
                            .utc(eachJob?.created_at)
                            .format("DD/MM/YY");
                          return (
                            <tr key={index}>
                              <td>
                                {eachJob?.description?.length > 0
                                  ? eachJob?.description
                                  : "- - -"}
                              </td>
                              <td>
                                {convertDate?.length > 0
                                  ? convertDate
                                  : "DD/MM/YY"}
                              </td>
                              <td>
                                {eachJob.Third_party_cost.length > 0
                                  ? `£ ${eachJob.Third_party_cost}`
                                  : "- - -"}
                              </td>
                            </tr>
                          );
                        })}
                      </>
                    )}

                    <tr></tr>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {editCltModal && (
        <EditClientModal
          showEditClientModal={showEditClientModal}
          editCltModal={editCltModal}
          clt={clt}
        />
      )}
    </>
  );
}

export default SpecificClient;
