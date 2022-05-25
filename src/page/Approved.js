import React, { useState } from "react";
import "@fontsource/roboto/700.css";
import "./Approved.css";
import Axios from "axios";
import Button from "@mui/material/Button";

function Approved() {


  const [approved, setRejected] = useState([]);
  const [render, setRender] = useState(false);

  const pendingUser = async () => {
    Axios.post("https://zianserver.herokuapp.com/read", {
      condition: "active",
    }).then((response) => {

      setRejected(response.data);

      setRender(!render);
    });
  };

  //load the approved user after the component is rendered
 

  

  const approveUser = async (userID) => {};

  return (
    <div className="flexbox-container">
      <Button variant="contained" onClick={pendingUser}>
        Refresh
      </Button>
      {approved.map((data) => (
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

export default Approved;
