import Head from 'next/head'
import abi from "../utils/BuyMeACoffee.json";
import React, { useEffect, useState } from 'react';
import {ethers} from 'ethers';
import Image from 'next/image'
import styles from '../styles/Home.module.css'

export default function Home() {
  
const contractAddress = '0x44ddbce30880ced7F8442Ccdc2E0eC73A31c93ee';
  const contractAbi = abi.abi;

   const onNameChange = (event) => {
    setName(event.target.value);
  }

  const onMessageChange = (event) => {
    setMessage(event.target.value);
  }

  const [currentAccount, setCurrentAccount] = useState("");
    const [name, setName] = useState("");
      const [message, setMessage] = useState("");
        const [memos, setMemos] = useState([]);


  
  const ifWalletConnected = async()=>{
  try{
    const {ethereum} = window;
    if(!ethereum){
      console.log("please install metamask");
    }
    
      const accounts = await ethereum.request({method:'eth_accounts'});
    if(accounts.length>0){
       setCurrentAccount(accounts[0]);
     
    }
    else{
      console.log("make sure metamask is connected");
    }}
  catch(err){
    console.error(err); }
}

  const connectWallet = async()=>{
    try{
      const {ethereum} = window;
       if(!ethereum){
      console.log("please install metamask");
    }
       const accounts = await ethereum.request({method:'eth_requestAccounts'})
      setCurrentAccount(accounts[0]);
    }
    catch(error){
      console.error(error);
    }
  }

  const buyCoffee = async()=>{
    try{
      const {ethereum} = window;
      if(ethereum){
      const provider = new ethers.providers.Web3Provider(ethereum, 'any');
      const signer =  provider.getSigner();

      const buyMeACoffee = new ethers.Contract(
        contractAddress,
        contractAbi,
        signer
      );
      console.log("buying coffee..");
      const coffeetxn = await buyMeACoffee.BuyCoffee(
        name? name: 'annon',
        message? message: "enjoy your coffee",
        {value: ethers.utils.parseEther('0.001')}
      );
      await coffeetxn.wait();
      console.log("mined..", coffeetxn.hash);
      console.log("coffee purchased!");

      setName("");
      setMessage("");
       
 
    }
    }
    catch(err){
      console.log(err);
    }
  }

  const getMemos = async() => {
      try {
      const {ethereum} = window;
  if(ethereum){
    
  
      const provider = new ethers.providers.Web3Provider(ethereum, 'any');
      const signer =  provider.getSigner();

      const buyMeACoffee = new ethers.Contract(
        contractAddress,
        contractAbi,
        signer
      );
  console.log("fetching memos...");
  const memos = await buyMeACoffee.GetMemos();
  console.log("fetched!");
  setMemos(memos);
  }
      }
  
  catch(err){
    console.log(err);
  }
  }
  useEffect(()=>{
    let buyMeACoffee;
    ifWalletConnected();
    getMemos();

    const onNewMemo = (from, timestamp, name, message)=>{
      console.log("memo recieved: ", from, timestamp, name, message);
      setMemos((prevState)=>[
        ...prevState,{
          address:from,
          timestamp: new Date(timestamp * 1000),
          name,
          message
        }
      ]);
    };
    
      const {ethereum} = window;
  if(ethereum){
      const provider = new ethers.providers.Web3Provider(ethereum, 'any');
      const signer =  provider.getSigner();

     buyMeACoffee = new ethers.Contract(
        contractAddress,
        contractAbi,
        signer
      );
    buyMeACoffee.on("NewMemo", onNewMemo);
  }
    return()=>{
      if(buyMeACoffee){
            buyMeACoffee.off("NewMemo", onNewMemo);
      }
    }
    
  }, []);

    
    return (
    <div className={styles.container}>
      <Head>
        <title>Buy Mia a Coffee!</title>
        <meta name="description" content="Tipping site" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Buy Mia a Coffee!
        </h1>
        
        {currentAccount ? (
          <div>
            <form>
              <div>
                <label>
                  Name
                </label>
                <br/>
                
                <input
                  id="name"
                  type="text"
                  placeholder="anon"
                  onChange={onNameChange}
                  />
              </div>
              <br/>
              <div>
                <label>
                  Send Mia a message
                </label>
                <br/>

                <textarea
                  rows={3}
                  placeholder="Enjoy your coffee!"
                  id="message"
                  onChange={onMessageChange}
                  required
                >
                </textarea>
              </div>
              <div>
                <button
                  type="button"
                  onClick={buyCoffee}
                >
                  Send 1 Coffee for 0.001ETH
                </button>
              </div>
            </form>
          </div>
        ) : (
          <button onClick={connectWallet}> Connect your wallet </button>
        )}
      </main>

      {currentAccount && (<h1>Memos received</h1>)}

      {currentAccount && (memos.map((memo, idx) => {
        return (
          <div key={idx} style={{border:"2px solid", "borderRadius":"5px", padding: "5px", margin: "5px"}}>
            <p style={{"fontWeight":"bold"}}>"{memo.message}"</p>
            <p>From: {memo.name} at {memo.timestamp.toString()}</p>
          </div>
        )
      }))}

      <footer className={styles.footer}>
        <a
          href=""
          target="_blank"
          rel="noopener noreferrer"
        >
          Created by Mia!
        </a>
      </footer>
    </div>
  )
}
