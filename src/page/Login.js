import React, { useState } from "react";
import '@fontsource/roboto/700.css';
import Typography from '@mui/material/Typography';
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useMoralis } from "react-moralis";
import { BrowserRouter, Link, Route, Routes, Navigate, useNavigate } from "react-router-dom";
import Stack from '@mui/material/Stack';

function Login() {
  const { Moralis, user, logout } = useMoralis();
  let navigation = useNavigate();

  //API

  /**
   * accept a string input of the desired class name, coulumn name, and value and return a JSON object list
   * @param string
   * @returns  JSON Object List
   */
  async function FindMoralis(_className, _coulumnName, _value) {
    try {
      const query = new Moralis.Query(_className);
      query.equalTo(_coulumnName, _value);

      const result = await query.first();

      return result;
    } catch (err) {
      console.error(err);
    }
  }

  async function TrackMoralis(_action) {
    try {
        const trackUser = Moralis.Object.extend("TrackUser");
        const track = new trackUser();
        track.set("Username", String(username._username));
        track.set("Action",_action);

        console.log(`${_action} saved`);

        await track.save();
        
    } catch (err) {
      console.error(err);
    }
  }




  const [username, setUsername] = useState({ _username: "" });
  const [password, setPassword] = useState({ _password: "" });
  let saveUser;

  //remove any remaining user credentials in local storage
  localStorage.removeItem("user");



  //get user input
  const GetUsername = (event) => {
    const val = { _val: event.target.value };

    setUsername({ _username: val._val });
  };

  const GetPassword = (event) => {
    const val = { _val: event.target.value };

    setPassword({ _password: val._val });
  };

  




  const SubmitHandler = async () => {
    if (username._username.length == 0 || password._password.length == 0) {
      alert("Please enter all the required fields");
      return;

    } else {

      try {
        const checkUser = await FindMoralis(
          "VoterId",
          "Username",
          username._username
        );

        console.log(checkUser);

        if (checkUser === undefined) {
          alert("Account not registered, register first");
        } else if (checkUser.attributes.Password == password._password) {
          //logout user from metamask
          await logout();
          //login user to MetaMask, get public address and store it in the _user_ variable
          await Moralis.authenticate().then(function (user) {
            console.log(user);
            if (checkUser.attributes.ETHAddress == user.attributes.ethAddress) {
              saveUser = {
                username: username._username,
                ethAddress: user.attributes.ethAddress,
              };
              localStorage.setItem("user", JSON.stringify(saveUser));

              TrackMoralis("login");
              //redirect the user to vote choosing page
              navigation("/Choose");

              //login
            } else {
              alert("Wrong Public Key");
              logout();
            }
          });
        } else {
          alert("Wrong password");
        }
      } catch (error) {
        console.error(error);
      }
    }
  };


  

  return (
    <>
      <div style={{margin: 'auto',
      width: '50%', 
      alignItems: 'center',
      textAlign: 'center',
      height: '50%',
      padding: '10px',}}>
        <Stack  spacing={1}>
        <Typography variant="h1"
            style={{ fontSize: "37px", fontWeight: "bold" }}>
          Login
        </Typography>
        <TextField
          variant="filled"
          size="small"
          type="text"
          placeholder="gg_gaming123"
          onChange={GetUsername}
          label="Username"
          required
        ></TextField>
        <br />
        <TextField
          variant="filled"
          type="password"
          placeholder="xxxxxxx"
          onChange={GetPassword}
          label="Password"
          required
        ></TextField>
        <br/>
        <br/>
        
        <Button  variant="contained" type="submit" onClick={SubmitHandler}>
          Login
        </Button>
        <Button variant="contained" type="submit" onClick={()=> navigation("/signup")}>
          Sign Up
        </Button></Stack>
      </div>
    </>
  );
}

//bug when login user.attributes.ethAddress sometimes default to null;

export default Login;
