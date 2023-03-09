import moment from "moment-timezone";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchClients } from "../controller/Airtable";
import flower from "../images/flower-green.svg";
import pdf from "../images/pdf.svg";
import refreshIcon from "../images/refreshIcon.svg";
import searchIcon from "../images/searchIcon.svg";
import Loader from "./Loader";

function SpecificClient({ allJobs }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [clt, setClt] = useState([]);
  const [jobWithClt, setJobWithClt] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const getDetails = async () => {
    fetchClients()
      .then((data) => {
        let filteredData = data.filter(
          (eachClt) => eachClt.id === location.pathname.slice(8)
        );
        setClt(filteredData[0]);
        setIsLoaded(true);
      })
      .catch((e) => console.log(e));
  };

  const filterJobsWithClt = () =>
    isLoaded &&
    clt?.jobs?.forEach((jobId) => {
      allJobs?.forEach((singleJob) => {
        if (jobId === singleJob?.id) {
          setJobWithClt((prevState) => [...prevState, singleJob]);
        }
      });
    });

  useEffect(() => {
    getDetails();
  }, []);

  useEffect(() => {
    isLoaded === true && filterJobsWithClt();
  }, [isLoaded]);

  console.log("jwc", jobWithClt);
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
                <input type="text" placeholder="Search" />
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

                  {jobWithClt?.map((eachJob, index) => {
                    let convertDate = moment
                      .utc(eachJob?.created_at)
                      .format("DD/MM/YY");
                    return (
                      <tr key={index}>
                        <td>
                          {eachJob?.job_code?.length > 0
                            ? eachJob?.job_code
                            : "NAMXXX"}
                        </td>
                        <td>
                          {eachJob?.job_name?.length > 0
                            ? eachJob?.job_name
                            : "XXXXX"}
                        </td>
                        <td>
                          {convertDate?.length > 0 ? convertDate : "DD/MM/YY"}
                        </td>
                        <td>{"XX"}</td>
                        <td>
                          {eachJob?.time_allocated?.length > 0
                            ? eachJob?.time_allocated
                            : "XX"}
                        </td>
                      </tr>
                    );
                  })}
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
                <input type="text" placeholder="Search" />
              </div>
              <div className="tableCont__specificClient">
                <table className="table__specificClient">
                  <tr>
                    <th style={{ width: "60%" }}>Description</th>
                    <th>Date</th>
                    <th>cost</th>
                  </tr>
                  {/* below data is dynamic  */}
                  {jobWithClt?.map((eachJob, index) => {
                    let convertDate = moment
                      .utc(eachJob?.created_at)
                      .format("DD/MM/YY");
                    return (
                      <tr key={index}>
                        <td>
                          {eachJob?.description?.length > 0
                            ? eachJob?.description
                            : "XXXXX"}
                        </td>
                        <td>
                          {convertDate?.length > 0 ? convertDate : "DD/MM/YY"}
                        </td>
                        <td>
                          {eachJob?.Third_party_cost?.length > 0
                            ? `£ ${eachJob?.Third_party_cost}`
                            : "£ XX"}
                        </td>
                      </tr>
                    );
                  })}

                  <tr></tr>
                </table>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Loader />
      )}
    </>
  );
}

export default SpecificClient;
