import React, { useState } from "react";
import { useEffect } from "react";
import {
  fetchClients,
  fetchEmployees,
  fetchSprints,
} from "../controller/Airtable";

import ViewSprintModal from "./ViewSprintModal";
import ViewJob from "./ViewJob";

function SingleJob({ convertDate, eachJob, sprint }) {
  const [isJobModalOpen, setIsJobOpen] = useState(false);
  const [job, setJob] = useState(null);
  const [employee, setEmployee] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  useEffect(() => {
    fetchEmployees()
      .then((res) => setEmployee(employee))
      .catch((e) => console.log(e));
  }, []);

  return (
    <>
      <tr
        className="jobList-singleRow"
        onClick={() => {
          setJob(eachJob);
          setIsJobOpen(true);
        }}
      >
        <td>{eachJob?.job_code?.length > 0 ? eachJob?.job_code : "- - -"}</td>
        <td>{eachJob?.job_name?.length > 0 ? eachJob?.job_name : "- - -"}</td>
        <td>{convertDate?.length > 0 ? convertDate : "DD/MM/YY"}</td>
        <td>{"---"}</td>
        <td>{eachJob?.time_allocated ? eachJob?.time_allocated : "- - -"}</td>
      </tr>
      {isJobModalOpen && (
        <ViewJob
          isJobModalOpen={isJobModalOpen}
          setIsJobOpen={setIsJobOpen}
          job={job}
          sprint={sprint}
          employee={employee}
        />
      )}
    </>
  );
}

export default SingleJob;
