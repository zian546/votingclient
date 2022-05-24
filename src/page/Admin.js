import React, { useState } from "react";
import "@fontsource/roboto/700.css";
import { ReactComponent as Plus } from "../icons/plus.svg";
import {
  useNavigate,
} from "react-router-dom";
import "./Admin.css";
import Button from "@mui/material/Button";



function Admin() {
  let navigation = useNavigate();

  const admin = localStorage.getItem("admin");

  const Login = ()=> {
    navigation("/admin/login");
  }
 

  if (admin === undefined || admin === null) {
    return (<div id="error_page" className="center">
        <button id="login" onClick={Login}>Login<br /> <img src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" height="60" width="30" /></button>
      </div>)
  }else{

    return (
      
      
      <Navbar>
        <NavItem icon={<Plus></Plus>}>
          <DropdownMenu></DropdownMenu>
        </NavItem>
      </Navbar>
      
    );
  }

}

function Navbar(props) {
  return (
    <nav className="navbar">
      <ul className="navbar-nav">{props.children}</ul>
    </nav>
  );
}

function DropdownMenu() {
  let navigation = useNavigate();

  const [approved,setApproved] = useState([]);
  const [rejected,setRejected] = useState([]);

  const toPending = () => {
    navigation("/admin/pending")
  }

  const toApproved = () => {
    navigation("/admin/approved")
  }

  const toRejected = () => {
    navigation("/admin/rejected")
  }


  

  function DropdownItem(props) {
    const [open, setOpen] = useState(false);

    return (
      <div>
        <a href="#" className="menu-item" onClick={() => setOpen(!open)}>
          {props.children}
        </a>
      </div>
    );
  }

  
  return (
    <div className="dropdown">
      <Button
        variant="contained"
        type="button"
        onClick={toPending}
      >
        Pending

      </Button>
      <br />
      <br />
      <Button 
      variant="contained" 
      type="button" 
      onClick={toApproved}
      >
        Approved

      </Button>
      <br />
      <br />
      <Button 
      variant="contained" 
      type="button" 
      onClick={toRejected}
      >
        Rejected

      </Button>
    </div>
  );
}

function NavItem(props) {
  const [open, setOpen] = useState(false);

  return (
    <li className="nav-item">
      <a href="#" className="icon-button" onClick={() => setOpen(!open)}>
        {props.icon}
      </a>

      {open && props.children}
    </li>
  );
}

function Container(condition, props) {
  const [dataArr, setData] = useState([]);

  return (
    <div>
      {dataArr.map((datum) => {
        return <h1>{datum.data}</h1>;
      })}
    </div>
  );
}

export default Admin;
