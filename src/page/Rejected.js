import React, { useState, useEffect } from "react";
import "@fontsource/roboto/700.css";
import "./Rejected.css";
import Axios from "axios";
import Button from "@mui/material/Button";
import {useMoralis} from "react-moralis";

function Rejected() {


  const [rejected, setRejected] = useState([]);
  const [render, setRender] = useState(false);

  const pendingUser = async () => {
    Axios.post("http://localhost:3001/read", {
      condition: "rejected",
    }).then((response) => {

      setRejected(response.data);
      console.log(rejected);

      setRender(!render);
    });
  };

  //load the rejected user after the component is rendered
 

  

  const approveUser = async (userID) => {};

  return (
    <div className="flexbox-container">
      <Button variant="contained" onClick={pendingUser}>
        Refresh
      </Button>
      {rejected.map((data) => (
        <div key={data.id}>
          id : {data.id}, ethAddress : {data.ethAddress},Username :
          {data.Username},phone : {data.Phone},email : {data.Email}
          ,CreatedAt : {data.CreatedAt}, ActivationStatus :
          {data.ActivationStatus}<br/>
        </div>
      ))}
    </div>
  );
}

export default Rejected;
