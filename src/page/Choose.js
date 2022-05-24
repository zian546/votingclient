import React, { useState } from "react";
import '@fontsource/roboto/700.css';
import Typography from '@mui/material/Typography';
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useMoralis } from "react-moralis";
import { BrowserRouter, Link, Route, Routes, Navigate, useNavigate } from "react-router-dom";
import "./Choose.css"


function Choose(){
    let navigation = useNavigate();

    return(<div style={{display: "flex", 
    justifyContent: "center"}}>
    <div><button id="RedVsBlue" onClick={()=>{navigation("/Vote")}}>Red Vs Blue</button></div>
    <div></div>
    <div></div>
  </div>)
}




export default Choose