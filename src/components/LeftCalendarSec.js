import React, { useEffect, useState } from "react";
import eyeIcon from "../images/eye.svg";
import eyeIconWhite from "../images/eye-white.svg";
import plusIconWhite from "../images/plusIconWhite.svg";
import "../App.css";

// Utilities for reference perpose
// const utilitiesArr = ["Holiday", "Work from home", "Pencilled"];
export const utilitiesArr = [
  {
    id: "01",
    name: "Holiday",
    colour: "#000",
  },
  {
    id: "02",
    name: "work from home",
    colour: "#FF5733",
  },
  {
    id: "03",
    name: "Pencilled",
    colour: "#33FF7A",
  },
];

export default function LeftCalendarSec({
  employees,
  currSprint,
  setFilteredSprint,
  handleUtilData,
}) {
  const [eyeId, setEyeId] = useState("");
  const handleClick = (empId) => {
    const allFilterSprint = currSprint?.filter(
      (eachData) => eachData?.employee?.id === empId
    );

    allFilterSprint?.length > 0 && setFilteredSprint(allFilterSprint);
  };

  useEffect(() => {}, [eyeId]);

  return (
    <div className="left_mainCalenderContainer">
      <div className="firstChild_leftMenu">
        <p className="text-key_firstChild_leftMenu">Key</p>
        <img
          onClick={() => {
            setEyeId("");
            setFilteredSprint([]);
          }}
          className="eyeIcon"
          src={eyeIcon}
          alt="eye icon"
        />
        <p className="text-resources_firstChild_leftMenu">Resources</p>
        <div className="allClient-firstChild_leftMenu">
          {employees?.map((emp, index) => {
            return (
              <div
                key={index}
                style={{ backgroundColor: `${emp?.colour}` }}
                className="empList_firstChild_leftMenu"
                onClick={() => {
                  handleClick(emp?.id);
                  setEyeId(emp?.id);
                }}
              >
                <p>{emp?.firstName}</p>
                {eyeId?.length > 0
                  ? eyeId === emp?.id && (
                      <img
                        className="selectedClient"
                        src={eyeIconWhite}
                        alt="eye image"
                      />
                    )
                  : ""}
              </div>
            );
          })}
        </div>
        <button
          className="btn-newClient-header__clientPage"
          style={{ margin: "6px auto", width: " 100%" }}
        >
          <img src={plusIconWhite} alt="plus icon white" />
          Add resource
        </button>
      </div>
      <div className="lastChild_leftMenu">
        <p className="text-resources_firstChild_leftMenu">Utilities</p>
        <div className="allClient-firstChild_leftMenu">
          {utilitiesArr?.map((utility) => {
            return (
              <div
                key={utility?.id}
                style={{ backgroundColor: `${utility?.colour}` }}
                className="empList_firstChild_leftMenu"
                onClick={() => {
                  handleUtilData(utility);
                }}
              >
                <p>{utility?.name}</p>
              </div>
            );
          })}
        </div>
        <button
          className="btn-newClient-header__clientPage"
          style={{ margin: "6px auto", width: "100%" }}
        >
          <img src={plusIconWhite} alt="plus icon white" />
          Add utility
        </button>
      </div>
    </div>
  );
}
