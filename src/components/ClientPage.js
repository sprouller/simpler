import React, { useEffect, useState } from "react";
import plusIconWhite from "../images/plusIconWhite.svg";
import refreshIcon from "../images/refreshIcon.svg";
import searchIcon from "../images/searchIcon.svg";
import { fetchClients } from "../controller/Airtable";
import "../App.css";

function ClientPage() {
  const [activeBtn, setActiveBtn] = useState(false);
  const [PBSearch, setPBSearch] = useState("");
  const [RBSearch, setRBSearch] = useState("");

  const getClientsDetails = async () => {
    let existedClient = await fetchClients();
    console.log("exClClientPage....", existedClient);
  };

  useEffect(() => {
    getClientsDetails();
  }, []);

  return (
    <div className="clientPage">
      <div className="header__clientPage">
        <p>Clients</p>
        <div className="rightPart-header__clientPage">
          <div className="clientDetails-header__clientPage">
            <div className="btnGroup-header__clientPage">
              <button
                onClick={() => setActiveBtn(false)}
                style={
                  activeBtn === false
                    ? { backgroundColor: "#20e29f", fontWeight: "600" }
                    : { backgroundColor: "#d8d2d1" }
                }
              >
                Live Clients
              </button>
              <button
                onClick={() => setActiveBtn(true)}
                style={
                  activeBtn === true
                    ? { backgroundColor: "#20e29f", fontWeight: "600" }
                    : { backgroundColor: "#d8d2d1" }
                }
              >
                Archive
              </button>
            </div>
          </div>
          <div className="newClient-header__clientPage">
            <button className="btn-newClient-header__clientPage">
              <img src={plusIconWhite} alt="plus icon white" />
              New client
            </button>
          </div>
          <div className="refreshIcon-header__clientPage">
            <img src={refreshIcon} alt="refresh icon" />
          </div>
        </div>
      </div>
      <div className="detailsContainer__clientPage">
        <div className="projectBased-detailsContainer__clientPage commonContainer-detailsContainer__clientPage">
          <p>Project based clients</p>
          <div className="searchContainer-detailsContainer__clientPage">
            <img src={searchIcon} alt="search icon" />
            <input
              type="text"
              value={PBSearch}
              onChange={(e) => setPBSearch(e.target.value)}
              placeholder="Search"
            />
          </div>
          <div className="dataContainer-detailsContainer__clientPage">
            <div className="data-detailsContainer__clientPage">
              <img
                src="https://images.pling.com/img/00/00/56/23/58/1470346/f070d046fb9bad8048a64713d78ad2a77b0665dc5d423f8d49812ad98a5975e358a9.png"
                alt="client company logo"
              />
              <p>The test logo for testing</p>
            </div>
          </div>
        </div>
        <div className="retainerBased-detailsContainer__clientPage commonContainer-detailsContainer__clientPage">
          <p>Retainer based clients</p>
          <div className="searchContainer-detailsContainer__clientPage">
            <img src={searchIcon} alt="search icon" />
            <input
              type="text"
              value={RBSearch}
              onChange={(e) => setRBSearch(e.target.value)}
              placeholder="Search"
            />
          </div>
          <div className="dataContainer-detailsContainer__clientPage">
            <div className="data-detailsContainer__clientPage">
              <img
                src="https://images.pling.com/img/00/00/56/23/58/1470346/f070d046fb9bad8048a64713d78ad2a77b0665dc5d423f8d49812ad98a5975e358a9.png"
                alt="client company logo"
              />
              <p>The test logo for testing</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClientPage;
