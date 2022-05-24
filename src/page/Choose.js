import React from "react";
import '@fontsource/roboto/700.css';
import { useNavigate } from "react-router-dom";
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