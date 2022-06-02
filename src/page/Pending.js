import React, { useState, useEffect } from "react";
import "@fontsource/roboto/700.css";
import "./Pending.css";
import Axios from "axios";
import Button from "@mui/material/Button";
import { useMoralis } from "react-moralis";

function Pending() {
  const { Moralis, isAuthenticated } = useMoralis();
  /**
   * this will save the desired input as User in the moralis database
   * @returns a true boolean value if the User is saved successfully in the database
   */

  async function SaveUserMoralis(
    _className,
    _username,
    _password,
    _phone,
    _email,
    _activationStatus,
    _ethAddress
  ) {
    Moralis.authenticate();
    try {
      const newUserConstructor = Moralis.Object.extend(_className);
      const newUser = new newUserConstructor();
      newUser.set("Username", String(_username));
      newUser.set("Phone", String(_phone));
      newUser.set("Password", String(_password));
      newUser.set("Email", String(_email));
      newUser.set("ActivationStatus", String(_activationStatus));
      newUser.set("ETHAddress", String(_ethAddress));

      await newUser.save();

      return true;
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  }

  const [pending, setPending] = useState([]);
  const [render, setRender] = useState(false);

  const pendingUser = async () => {
    Axios.post("https://zianserver.herokuapp.com/read", {
      condition: "pending",
    }).then((response) => {
      setPending(response.data);

      setRender(!render);
    });
  };

  //load the pending user after the component is rendered



  return (
    <div className="flexbox-container">
      <Button variant="contained" onClick={pendingUser}>
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
          <th>Action</th>
        </tr>
  
      
      
        {pending.map((data) => (
          <tr key={data.id}>
            <td>{data.id}</td>
            <td>{data.ethAddress}</td>
            <td>{data.Username}</td>
            <td>{data.Phone}</td>
            <td>{data.Email}</td>
            <td>{data.CreatedAt}</td>
            <td>{data.ActivationStatus}</td>
            <td><Button
              variant="contained"
              onClick={() => {
                Axios.post("https://zianserver.herokuapp.com/Update", {
                  condition: "active",
                  id: data.id,
                }).then((response) => {
                  //auto refresh the page for pending user
                  pendingUser();
                  //save the user to moralis Database
                  SaveUserMoralis(
                    "VoterId",
                    data.Username,
                    data.Password,
                    data.Phone,
                    data.Email,
                    "active",
                    data.ethAddress
                  );

                  Axios.post(
                    "https://zianserver.herokuapp.com/sendActivation",
                    { email: data.Email }
                  );
                });
              }}
            >
              approve
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                Axios.post("https://zianserver.herokuapp.com/Update", {
                  condition: "rejected",
                  id: data.id,
                }).then((response) => {
                  //auto refresh the page for pending user
                  pendingUser();
                });
              }}
            >
              reject
            </Button></td>
  
            
            <br/>
          </tr>
        ))}
        </table>
         
    </div>
  );
}

export default Pending;
