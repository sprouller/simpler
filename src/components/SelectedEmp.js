import React, { useState, useEffect } from "react";
import eyeIcon from "../images/eye.svg";
import "../App.css";

function SelectedEmp({ empName, Id, currSprint, setFilteredSprint, empColor }) {
  const [showEye, setShowEye] = useState(true);
  const [clickedEmp, setClickedEmp] = useState("");

  const handleClick = (empId) => {
    setClickedEmp("");
    const allFilterSprint = currSprint?.filter(
      (eachData) => eachData?.employee?.id === empId
    );
    console.log("empName", empName, empId);
    allFilterSprint?.length > 0 && setFilteredSprint(allFilterSprint);
    setShowEye(true);
    setClickedEmp(empName);
  };
  return (
    <div
      style={{ backgroundColor: `${empColor}` }}
      className="empList_firstChild_leftMenu"
      onClick={() => handleClick(Id)}
    >
      <p>{empName}</p>

      {empName === clickedEmp && (
        <img
          className="eyeIcon_firstChild_leftMenu"
          src={eyeIcon}
          alt="eye icon"
        />
      )}
    </div>
  );
}

export default SelectedEmp;
