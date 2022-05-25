import React, { useState, useEffect } from "react";
import "./Vote.css";
import { useMoralis } from "react-moralis";
import { useTable } from 'react-table'
import { useNavigate } from "react-router-dom";


function Vote(props) {
  const { authenticate, isAuthenticated , Moralis } = useMoralis();
  let navigation = useNavigate();

  //contract abi
  const ABI = [
    {
      constant: true,
      inputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      name: "voter_blue",
      outputs: [
        {
          internalType: "string",
          name: "color",
          type: "string",
        },
        {
          internalType: "address",
          name: "person",
          type: "address",
        },
      ],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      name: "voter_red",
      outputs: [
        {
          internalType: "string",
          name: "color",
          type: "string",
        },
        {
          internalType: "address",
          name: "person",
          type: "address",
        },
      ],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "votes_count",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        {
          internalType: "address",
          name: "_person",
          type: "address",
        },
      ],
      name: "Red",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        {
          internalType: "address",
          name: "_person",
          type: "address",
        },
      ],
      name: "Blue",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "TotalVotes",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "RedVotes",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "BlueVotes",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
  ];

  //initialize the vote counter
  let newVote = 0;
  let newRedVote = 0;
  let newBlueVote = 0;

  //state used to update vote counter
  const [totalVoter, setVoters] = useState({ totalVote: newVote });
  const [redVoter, setRedVoter] = useState({ redVote: newRedVote });
  const [blueVoter, setBlueVoter] = useState({ blueVote: newBlueVote });
  const [rerender, setRerender] = useState(false);




  let blueResult;
  let redResult;
  let retrieveBlue = JSON.parse(localStorage.getItem('blue'));
  let retrieveRed = JSON.parse(localStorage.getItem('red'));
  const user = JSON.parse(localStorage.getItem('user'));




  //contract address
  const Address = "0x4B382cd8d28c6e4b206DC0278E375735736Da69c"






  //API

  async function TrackMoralis(_action) {
    try {
        const trackUser = Moralis.Object.extend("TrackUser");
        const track = new trackUser();
        track.set("Username", String(user.username));
        track.set("Action",_action);

      

        await track.save();
        
    } catch (err) {
      console.error(err);
    }
  }
  

  //function to save voter details in moralis DB
  const saveVoter = async (address, tx_id, color, ChainID) => {
    const createVoter = Moralis.Object.extend("Voters");
    const voter = new createVoter();
    voter.set("ChainID",String(ChainID))
    voter.set("Username",String(user.username));
    voter.set("PublicKey", String(address));
    voter.set("TransactionId", String(tx_id));
    voter.set("Color", color);

    await voter.save();
    return voter;
  }




  //function to retrieve people who voted blue DB
  const searchBlue = async () => {
    const query = new Moralis.Query("Voters");
    query.startsWith("Color", "Blue");
    blueResult = await query.find();


    localStorage.setItem('blue', JSON.stringify(blueResult));
    retrieveBlue = localStorage.getItem('blue');


  }

  // function to retrieve people who voted red from moralis DB
  const searchRed = async () => {
    const query = new Moralis.Query("Voters");
    query.startsWith("Color", "Red");
    redResult = await query.find();

    localStorage.setItem('red', JSON.stringify(redResult));
    retrieveRed = localStorage.getItem('red');
  }

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
  











  //function to get total votes, total red votes, total blue votes and show it on the counter
  async function TotalVotes() {


    await Moralis.enableWeb3();

    let options = {
      contractAddress: Address,
      functionName: "TotalVotes",
      abi: ABI,
    };


    const transaction = await Moralis.executeFunction(options);

    const result = { totalVote: Number(transaction) }
    setVoters({ totalVote: result.totalVote });


    //set state for the red votes
    let options1 = {
      contractAddress: Address,
      functionName: "RedVotes",
      abi: ABI,
    };

    const transaction1 = await Moralis.executeFunction(options1);

    const result1 = { redVote: Number(transaction1) }
    setRedVoter({ redVote: result1.redVote });


    //set state for blue votes
    let options2 = {
      contractAddress: Address,
      functionName: "BlueVotes",
      abi: ABI,
    };

    const transaction2 = await Moralis.executeFunction(options2);

    const result2 = { blueVote: Number(transaction2) }
    setBlueVoter({ blueVote: result2.blueVote });

    searchBlue();
    searchRed();

    setRerender(!rerender);
  }











  //function used to vote red
  async function Red() {

    const checkUser = await FindMoralis("Voters","Username",user.username);


    if (checkUser == undefined) {
      try {
        await Moralis.enableWeb3();

        let options = {
          contractAddress: Address,
          functionName: "Red",
          abi: ABI,
          params: {
            _person: user.ethAddress,
          },
        };

        const transaction = await Moralis.executeFunction(options);
        const tx_id = transaction.hash;

        await saveVoter(user.ethAddress, tx_id, "Red",transaction.chainId);

        TrackMoralis("voted Red");

        TotalVotes();
      } catch (error) {
        console.error(error);
      }
    }else{
    alert(`You already voted!\n date : ${checkUser.attributes.createdAt} \nTransaction Id : ${checkUser.attributes.TransactionId}\nChain ID : ${checkUser.attributes.ChainID}`);
    }
  }



  //function used to vote blue
  async function Blue() {

    const checkUser = await FindMoralis("Voters","Username",user.username);



    if (checkUser == undefined) {
      try {
        await Moralis.enableWeb3();

        let options = {
          contractAddress: Address,
          functionName: "Blue",
          abi: ABI,
          params: {
            _person: user.ethAddress,
          },
        };

        const transaction = await Moralis.executeFunction(options);
        const tx_id = transaction.hash;

        await saveVoter(user.ethAddress, tx_id, "Blue",transaction.chainId);

        TrackMoralis("voted Blue");

        TotalVotes();
      } catch (error) {
        console.error(error);
      }
    }else{
    alert(`You already voted!\n date : ${checkUser.attributes.createdAt} \nTransaction Id : ${checkUser.attributes.TransactionId}\nChain ID : ${checkUser.attributes.ChainID}`);
    }


    
  }








  //event listener when the user change account
  window.ethereum.on('accountsChanged', () => {
    localStorage.removeItem("user");
    TrackMoralis("Logout(changed eth address)");
    window.location.reload(true);
  })

  const logout = () => {
    localStorage.removeItem("user");
    TrackMoralis("logout");
    window.location.reload(true);
  }

  useEffect(() => {
    window.addEventListener("beforeunload", handleUnload);
    window.addEventListener('unload', DoAtUnload);
    return () => {
      window.removeEventListener("beforeunload", handleUnload);
      window.removeEventListener('unload', DoAtUnload)
    };
  }, []);

  const handleUnload = (e) => {
    e.preventDefault();
  };
  
  const DoAtUnload = async () => {
    await TrackMoralis("logout");
  }



useEffect(() =>{ 
  Promise.all([searchBlue,searchRed]);
})

  const data = React.useMemo(
    () => [{
      PublicKeyRed: retrieveRed.map((data, index) => {
        return <tr>{data.PublicKey}</tr>;
      }),

      TxIdRed: retrieveRed.map((data, index) => {
        return <tr>{data.TransactionId}</tr>;
      }),

      PublicKeyBlue: retrieveBlue.map((data, index) => {
        return <tr>{data.PublicKey}</tr>;
      }),

      TxIdBlue: retrieveBlue.map((data, index) => {
        return <tr>{data.TransactionId}</tr>;
      })
    }]
  );

  const columns = React.useMemo(
    () => [
      {
        Header: 'Red',
        columns: [
          {
            Header: 'PublicKey',
            accessor: 'PublicKeyRed',
          },
          {
            Header: 'Tx Id',
            accessor: 'TxIdRed',
          },
        ],
      },
      {
        Header: 'Blue',
        columns: [
          {
            Header: 'PublicKey',
            accessor: 'PublicKeyBlue',
          },
          {
            Header: 'Tx Id',
            accessor: 'TxIdBlue'
          },
        ],
      },
    ],
    []
  )
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data })

  const Login = () => {
    navigation("/Login");
  }

  if (user == undefined) {
    return (
      <div id="error_page" className="center">
        <button id="login" onClick={Login}>Login<br /> <img src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" height="60" width="30" /></button>
      </div>)
  }
  else{
    Promise.all([searchBlue,searchRed]).then(() =>{ return (
      <>
        <div className="center">
          Cast your vote!<br />
          <button id="red_button" onClick={Red} >Red</button>
          <button id="blue_button"  onClick={Blue} >Blue</button><br />
          <p id="vote_count">Voters  count :  <br />{totalVoter.totalVote}</p>
          <p id="vote_count">Red Vote count : <br />{redVoter.redVote}</p>
          <p id="vote_count">Blue Vote count : <br />{blueVoter.blueVote}</p>
          <div style={{margin: "auto"}}>
          <table {...getTableProps()} style={{alignItems : 'center',
          margin : "auto"

          }}>
            <thead>
              {headerGroups.map(headerGroup => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map(column => (
                    <th
                      {...column.getHeaderProps()}
                      style={{
                        borderBottom: 'solid 4px black',
                        background: 'transparent',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: ' 16px',
                        width: '50 %',
                      }}
                    >
                      {column.render('Header')}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {rows.map(row => {
                prepareRow(row)
                return (
                  <tr {...row.getRowProps()}>
                    {row.cells.map(cell => {
                      return (
                        <td
                          {...cell.getCellProps()}
                          style={{
                            padding: '10px',
                            border: 'solid 1px black',
                            background: 'transparent',
                            fontSize: '16px'
                          }}
                        >
                          {cell.render('Cell')}
                        </td>
                      )
                    })}
                  </tr>
                )
              })}
            </tbody>
          </table>
          </div>

          <button id="result_button" onClick={TotalVotes} >Refresh</button>
          <p id="account">Account :<br />{user.ethAddress}<br /></p>
          <button id="change_account_button" onClick={logout} >Logout</button>
        </div></>
    )

            }
  
      







    )
    

   

}
}


// dashboard localhost(data kyc, login user(nama,email,password,telfon, otp email, icon pending, time stamp saat sudah voting, ))
// daftar -> login -> kyc -> choose vote page -> vote  
// save chain id

export default Vote;
