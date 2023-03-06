import React, { useEffect, useState } from "react";
import plusIconWhite from "../images/plusIconWhite.svg";
import refreshIcon from "../images/refreshIcon.svg";
import searchIcon from "../images/searchIcon.svg";
import defaultImage from "../images/flower-green.svg";
import { useNavigate } from "react-router-dom";
import { fetchClients, fetchJobs } from "../controller/Airtable";
import "../App.css";
import CreateNewClient from "./CreateNewClient";

function ClientPage() {
  const location = useNavigate();
  const [activeBtn, setActiveBtn] = useState(false);
  const [PBSearch, setPBSearch] = useState("");
  const [RBSearch, setRBSearch] = useState("");
  const [showClientModal, setShowClientModal] = useState(false);
  const [clt, setClt] = useState([]);
  const [projectBasedClt, setProjectBasedClt] = useState([]);
  const [retainerClt, setRetainerClt] = useState([]);

  const getClientsDetails = async () => {
    let allClients = await fetchClients();
    setClt(allClients);
    setProjectBasedClt(
      allClients.filter((data) => data.client_type === "Project based")
    );
    setRetainerClt(
      allClients.filter((data) => data.client_type === "Retainer")
    );
  };

  const handleRetainSearch = (e) => {
    let filteredClient = retainerClt.filter((data) => {
      return data.name
        .toLowerCase()
        .includes(e.target.value.toLocaleLowerCase());
    });
    e.target.value.length > 0 && setRetainerClt(filteredClient);
  };

  const handleProjectSearch = (e) => {
    let filteredClient = projectBasedClt.filter((data) => {
      return data.name
        .toLowerCase()
        .includes(e.target.value.toLocaleLowerCase());
    });
    e.target.value.length > 0 && setProjectBasedClt(filteredClient);
  };

  useEffect(() => {
    getClientsDetails();
  }, []);

  return (
    <div className="clientPage">
      <div className="header__clientPage">
        <p className="header__clientPageTitle">Clients</p>
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
            <button
              className="btn-newClient-header__clientPage"
              onClick={() => setShowClientModal(!showClientModal)}
            >
              <img src={plusIconWhite} alt="plus icon white" />
              New client
            </button>
          </div>
          <div className="refreshIcon-header__clientPage">
            <img
              src={refreshIcon}
              alt="refresh icon"
              onClick={() => getClientsDetails()}
            />
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
              onChange={(e) => {
                setPBSearch(e.target.value);
                e.target.value.length > 0
                  ? handleProjectSearch(e)
                  : getClientsDetails();
              }}
              placeholder="Search"
            />
          </div>
          <div className="dataContainer-detailsContainer__clientPage">
            {projectBasedClt.map((data) => {
              return (
                <div
                  className="data-detailsContainer__clientPage"
                  key={data?.id}
                  onClick={() => {
                    location(`/client/${data?.id}`);
                  }}
                >
                  <img
                    src={data.comp_logo ? data.comp_logo[0].url : defaultImage}
                    alt={data?.name}
                  />
                  <p>{data?.name}</p>
                </div>
              );
            })}
          </div>
        </div>
        <div className="retainerBased-detailsContainer__clientPage commonContainer-detailsContainer__clientPage">
          <p>Retainer based clients</p>
          <div className="searchContainer-detailsContainer__clientPage">
            <img src={searchIcon} alt="search icon" />
            <input
              type="text"
              value={RBSearch}
              onChange={(e) => {
                setRBSearch(e.target.value);
                e.target.value.length > 0
                  ? handleRetainSearch(e)
                  : getClientsDetails();
              }}
              placeholder="Search"
            />
          </div>
          <div className="dataContainer-detailsContainer__clientPage">
            {retainerClt.map((data) => {
              return (
                <div
                  className="data-detailsContainer__clientPage"
                  key={data.id}
                  onClick={() => location(`/client/${data?.id}`)}
                >
                  <img
                    src={data.comp_logo ? data.comp_logo[0].url : defaultImage}
                    alt={data.name}
                  />
                  <p>{data.name}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {showClientModal && (
        <CreateNewClient show={showClientModal} setShow={setShowClientModal} />
      )}
    </div>
  );
}

export default ClientPage;
