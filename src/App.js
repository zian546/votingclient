import React from "react";
import SignUp from "./page/SignUp";
import Login from "./page/Login";
import Vote from "./page/Vote";
import Error from "./page/Error";
import Choose from "./page/Choose";
import Admin from "./page/Admin";
import Pending from "./page/Pending";
import Approved from "./page/Approved";
import Rejected from "./page/Rejected";
import AdminLogin from "./page/AdminLogin";
import { BrowserRouter, Link, Route, Routes, Navigate } from "react-router-dom";

class App extends React.Component {
  /*constructor(){
    super(props)
    this.state = {test : 0}
  }*/

  render() {
    return (
      <>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />}></Route>
            <Route path="/Admin/Pending" element={<Pending />}></Route>
            <Route path="/Admin/Rejected" element={<Rejected />}></Route>
            <Route path="/Admin/Approved" element={<Approved />}></Route>
            <Route path="/Admin/Dashboard" element={<Admin />}></Route>
            <Route path="/Admin/Login" element={<AdminLogin />}></Route>
            <Route path="/Admin" element={<AdminLogin />}></Route>
            <Route path="/SignUp" element={<SignUp />}></Route>
            <Route path="/Login" element={<Login />}></Route>
            <Route path="/Choose" element={<Choose />}></Route>
            <Route path="/Vote" element={<Vote />}></Route>
            <Route path="*" element={<Error />}></Route>
          </Routes>
        </BrowserRouter>
      </>
    );
  }
}

export default App;
