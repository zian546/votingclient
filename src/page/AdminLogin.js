import React, { useState, useEffect } from "react";
import "@fontsource/roboto/700.css";
import { useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Axios from "axios";

function AdminLogin() {
  let navigation = useNavigate();


  const [admin, setAdmin] = useState({ val: "" });
  const [password, setPassword] = useState({ val: "" });

  localStorage.removeItem("admin");

  const getUsername = (event) => {
    const username = { _val: event.target.value };

    setAdmin({ val: username._val });
  };

  const getPassword = (event) => {
    const password = { _val: event.target.value };

    setPassword({ val: password._val });
  };

  const loginHandler = () => {
    Axios.post("https://zianserver.herokuapp.com/admin", { username: admin.val, password : password.val}).then(
      (response) => {
        if (response.data.length == 0 || response.data.Username != "admin" || response.data.Password != "password")
          return alert("wrong password or username");
        else {
         
          const save = {
              user : admin.val, 
              password : password.val
          }

          //very unsafe
          localStorage.setItem('admin', JSON.stringify(save));
          navigation("/admin/dashboard");
        }
      }
    );
  };
  return (
    <div
      style={{
        margin: "auto",
        width: "50%",
        alignItems: "center",
        textAlign: "center",
        height: "50%",
        padding: "10px",
      }}
    >
      <Stack spacing={1}>
        <Typography variant="h1">Login Admin</Typography>
        <br />
        <TextField
          variant="filled"
          size="small"
          type="text"
          placeholder="admin"
          onChange={getUsername}
          label="Username"
          required
        ></TextField>
        <TextField
          variant="filled"
          size="small"
          type="password"
          placeholder="XXXXX"
          onChange={getPassword}
          label="Password"
          required
        ></TextField>
        <Button variant="contained" type="submit" onClick={loginHandler}>
          Login
        </Button>
      </Stack>
    </div>
  );
}

export default AdminLogin;
