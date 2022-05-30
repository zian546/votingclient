import React, { useState } from "react";
import { useMoralis } from "react-moralis";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import '@fontsource/roboto/700.css';
import Typography from '@mui/material/Typography';
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import Stack from '@mui/material/Stack';
import detectEthereumProvider from '@metamask/detect-provider';



let OTPsendCount = "";



function SignUp() {
  const { Moralis, user } = useMoralis();
  const { ethereum } = window;
  let navigation = useNavigate();

  //this must be removed and replaced with an API
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

  //webUser varibale for storing webUser identification
  const [confirmation, setConfirmation] = useState(false);
  const [OTPconfirm, setOTPconfirm] = useState(false);
  const [webUser, setUser] = useState({
    username: "",
    password: "",
    phone: "",
    email: "",
    activationStatus: "",
  });
  const [userDisplay, setUserDisplay] = useState({ _username: "" });
  const [password, setPassword] = useState({ _password: "" });
  const [phone, setPhone] = useState({ _phone: "" });
  const [email, setEmail] = useState({ _email: "" });
  const [activationStatus, setStatus] = useState({ _activationStatus: true });
  const [OTP, setRealOTP] = useState(0);
  const [InputedOTP, setInputOTP] = useState({ otp: "" });
  

  let ethAddress = "";

  //store webUser input
  const GetUsername = (event) => {
    const val = { _val: event.target.value };

    setUser({ username: val._val });
    setUserDisplay({ _username: val._val });
  };

  const GetPassword = (event) => {
    const val = { _val: event.target.value };

    setUser({ password: val._val });
    setPassword({ _password: val._val });
  };

  const GetPhoneNumber = (event) => {
    const val = { _val: event.target.value };

    setUser({ phone: val._val });
    setPhone({ _phone: val._val });
  };

  const GetEmail = (event) => {
    const val = { _val: event.target.value };

    setUser({ email: val._val });
    setEmail({ _email: val._val });
  };

  const GetUserOTP = (event) => {
    const val = { _val: event.target.value };

    setInputOTP({ otp: val._val });
  };

  // doesn't work yet
  const SubmitHandler = () => {
    //check webUser input
    if (
      userDisplay._username.length == 0 ||
      password._password.length == 0 ||
      phone._phone.length == 0 ||
      email._email.length == 0
    ) {
      alert("please enter all required fields!");
      return;
    } else {
      setConfirmation(true);
      return;
    }
  };

  const OtpDisplay = () => {
    setConfirmation(false);
    setOTPconfirm(true);
  };

  //check availability of phone number and username;
  const YesConfirm = async () => {

    const checkPhone = await FindMoralis("VoterId", "Phone", phone._phone);
    const checkUser = await FindMoralis(
      "VoterId",
      "Username",
      userDisplay._username
    );
    const checkEmail = await FindMoralis("VoterId", "Email", email._email);

  
    if (
      checkPhone == undefined &&
      checkUser == undefined &&
      checkEmail == undefined
    ) {
      await SendOTP();
      OtpDisplay();
      return;
      //konfirmasi otp
    } else if (
      checkPhone == undefined ||
      checkUser == undefined ||
      checkEmail == undefined
    ) {
      alert(
        "username, phone number, or email has been taken. \nplease use a different username, email or phone number"
      );
      setConfirmation(false);
    } else if (
      checkPhone.attributes.Phone == phone._phone &&
      checkPhone.attributes.Username == userDisplay._username &&
      checkPhone.attributes.ActivationStatus == "true"
    ) {
      alert("account is already registered, please login");
      return;
      // login
    } else if (
      checkPhone.attributes.Phone == phone._phone &&
      checkPhone.attributes.Username == userDisplay._username &&
      checkPhone.attributes.ActivationStatus != "true"
    ) {
      await SendOTP();
      OtpDisplay();
      return;
      //konfirmasi otp
    } else {
      console.error("something went wgrong");
    }

    return;
  };

  const NoConfirm = () => {
    setConfirmation(false);
  };

  //send otp with email
  const SendOTP = async () => {
    if (OTPsendCount == 3) {
      alert("maximum activation attempt reached!");
      document.location.reload(true);
    } else {
      //otp generator algorithm
      const digits = "0123456789";
      let val = "";
      for (let i = 0; i < 4; i++) {
        val += digits[Math.floor(Math.random() * 10)];
      }
      setRealOTP(val);

      //send otp through email with smtp build with express.js
      try {
     

        const param = {
          email: webUser.email,
          otp: val,
        };
        //break if count exceed 3
        const response = await fetch("https://zianserver.herokuapp.com/send", {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify(param),
        })
          .then((res) => res.json())
          .then(async (res) => {
            const resData = await res;
     
            if (resData == "Error: No recipients defined") {
              alert("Your Email is not Valid");
              return;
            }

            //count how many times otp had been sent
            OTPsendCount++;
       
            alert(
              "otp code has been sent, check your email. \nDon't resfresh your browser!"
            );
            setOTPconfirm(true);
          });
      } catch (e) {
        console.error(e);
      }
    }
  };

  //check for otp correction
  const CompareOTP = async () => {
    try {
      if (OTP == InputedOTP.otp) {
       await  Moralis.authenticate({
          signingMessage: "sign up to voting dapp",
        })
          
          ethAddress = await ethereum.request({ method: 'eth_requestAccounts' })
          console.log(ethAddress);
        
       
        //check user ethAddress ke database
        const checkAddress = await FindMoralis(
          "VoterId",
          "ETHAddress",
          String(ethAddress)
        );

        if (checkAddress == undefined) {
          //save User ke database
         

          //save user to database for further approval
          await Axios.post("https://zianserver.herokuapp.com/Create", {
            Username: userDisplay._username,
            Password: password._password,
            Email: webUser.email,
            ethAddress: ethAddress,
            Phone: phone._phone,
            ActivationStatus: "pending",
            CreatedAt: Date(),
          }).then((err, res) => {
         
            alert("please wait while our team  verifies your account");
            navigation("/login");
          });
        } else {
          alert("Public key already registered!");
        }
      } else {
        alert("otp is wrong");
      }
    } catch (error) {
      console.error(error);
    }

  };

  return (
    <>
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
          <Typography
            variant="h1"
            style={{ fontSize: "37px", fontWeight: "bold" }}
          >
            Sign Up
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
          <br />
          <TextField
            variant="filled"
            type="number"
            placeholder="08XXXXXX"
            textAlign="center"
            onChange={GetPhoneNumber}
            label="Phone Number"
            required
          ></TextField>
          <br />
          <TextField
            variant="filled"
            type="email"
            placeholder="test@something.com"
            onChange={GetEmail}
            label="Email"
            required
          ></TextField>
          <br />
          <br />
          <Button variant="contained" type="submit" onClick={SubmitHandler}>
            submit
          </Button>
          <Button
            variant="contained"
            type="submit"
            onClick={() => navigation("/Login")}
          >
            Login
          </Button>

          {confirmation === true ? (
            <div style={{ backgroundColor: "#afb7be5d" }}>
              <Stack spacing={2}>
                <Typography variant="h1" style={{ fontSize: "32px" }}>
                  Are you sure?
                </Typography>
                <Typography variant="subtitle1" style={{ fontSize: "16px" }}>
                  Username : {userDisplay._username}
                </Typography>
                <br />
                <Typography variant="subtitle1" style={{ fontSize: "16px" }}>
                  Password : {password._password}
                </Typography>
                <br />
                <Typography variant="subtitle1" style={{ fontSize: "16px" }}>
                  Phone : {phone._phone}
                </Typography>
                <br />
                <Typography variant="subtitle1" style={{ fontSize: "16px" }}>
                  Email : {email._email}
                </Typography>
                <br />
                <Button variant="contained" onClick={YesConfirm}>
                  yes
                </Button>
                <Button variant="contained" onClick={NoConfirm}>
                  no
                </Button>
              </Stack>
            </div>
          ) : (
            ""
          )}
          {OTPconfirm == true ? (
            <Stack spacing={2}>
              <Typography variant="h1" style={{ fontSize: "32px" }}>
                please enter your otp code
              </Typography>
              <TextField
                type="number"
                placeholder="XXXX"
                maxLength="4"
                onChange={GetUserOTP}
              ></TextField>
              <br />
              <Button type="submit" onClick={CompareOTP}>
                confirm
              </Button>
              <Button type="submit" onClick={SendOTP}>
                resend otp
              </Button>
            </Stack>
          ) : (
            ""
          )}
        </Stack>
      </div>
    </>
  );
}


//1 account 1 public key 1 username



export default SignUp;