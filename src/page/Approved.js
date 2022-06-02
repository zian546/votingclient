import React, { useState } from "react";
import "@fontsource/roboto/700.css";
import "./Approved.css";
import Axios from "axios";
import Button from "@mui/material/Button";

function Approved() {
  const [approved, setRejected] = useState([]);
  const [render, setRender] = useState(false);

  const approvedUser = async () => {
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
      <Button variant="contained" onClick={approvedUser}>
        Refresh
      </Button>

      <table border="1" cellspacing="0" cellpadding="10">
        <tr>
          <th>user id</th>
          <th>eth ethAddress</th>
          <th>Username</th>
          <th>phone number</th>
          <th>Email</th>
          <th>time Stamp</th>
          <th>Activation Status</th>
        </tr>

        {approved.map((data) => (
          <tr key={data.id}>
            <td>{data.id}</td>
            <td>{data.ethAddress}</td>
            <td>{data.Username}</td>
            <td>{data.Phone}</td>
            <td>{data.Email}</td>
            <td>{data.CreatedAt}</td>
            <td>{data.ActivationStatus}</td>

            <br />
          </tr>
        ))}
      </table>
    </div>
  );
}

export default Approved;
