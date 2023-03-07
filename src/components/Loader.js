import React, { useEffect, useState } from "react";
import { ScaleLoader } from "react-spinners";

function Loader() {
  const [isAvailable, setIsAvailable] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsAvailable(false);
    }, [4000]);
  });

  return isAvailable ? (
    <ScaleLoader className="loader" color="#20e29f" />
  ) : (
    <p className="loader">Data not found</p>
  );
}

export default Loader;
