import moment from "moment-timezone";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchClients, fetchJobs } from "../controller/Airtable";
import flower from "../images/flower-green.svg";
import pdf from "../images/pdf.svg";
import refreshIcon from "../images/refreshIcon.svg";
import searchIcon from "../images/searchIcon.svg";
import EditClientModal from "./EditClientModal";
import Loader from "./Loader";
import SingleJob from "./SingleJob";

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
  const getDetails = async () => {
    fetchClients()
      .then((data) => {
        let filteredData = data.filter(
          (eachClt) => eachClt.id === location.pathname.slice(8)
        );
        setClt(filteredData[0]);
        setIsJobFetch(true);
      })
      .catch((e) => console.log(e));
  };

  const filterJobsWithClt = () =>
    isLoaded &&
    clt?.jobs?.forEach((jobId) => {
      allJobs?.forEach((singleJob) => {
        if (jobId === singleJob?.id) {
          setJobWithClt((prevState) => [...prevState, singleJob]);
          setFiltersJob((prevState) => [...prevState, singleJob]);
        }
      });
    });

  const filterSearchJob = (e, type) => {
    console.log("data", e.target.value);
    if (type === "project") {
      let filterJob = jobWithClt.filter((data) => {
        return e.target.value?.length > 0
          ? data.job_name
              .toLowerCase()
              .includes(e.target.value.toLocaleLowerCase())
          : data;
      });
      console.log("flt", filterJob);
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
      console.log("flt", filterJob);
      setFiltersThirdJob(filterJob);
    }
  };

  useEffect(() => {
    if (isJobFetch === false) {
      getDetails();
      fetchJobs()
        .then((jobs) => {
          setAllJobs(jobs);
          setIsLoaded(true);
        })
        .catch((e) => console.log(e));
    }
  }, [isJobFetch]);

  useEffect(() => {
    isLoaded === true && filterJobsWithClt();
  }, [isLoaded]);

  console.log("Client details", filterJobs);
  return (
    <>
      {jobWithClt?.length > 0 ? (
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
                  onClick={() => getDetails()}
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
                    <th>Time spent (hrs)</th>
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
                              {convertDate?.length > 0
                                ? convertDate
                                : "DD/MM/YY"}
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
                width: "40%",
                marginLeft: "0",
                borderTopRightRadius: "20px",
                borderBottomRightRadius: "20px",
                boxShadow: "none",
                borderTopLeftRadius: "0px",
                borderBottomLeftRadius: "0px",
              }}
            >
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
              <div className="tableCont__specificClient">
                <table className="table__specificClient">
                  <tr>
                    <th style={{ width: "60%" }}>Description</th>
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
      ) : (
        <Loader />
      )}
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
