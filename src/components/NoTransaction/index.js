import React from 'react'
import transactions from "../../assets/noTrans.png";

function NoTransaction() {
  return (
    <div
        style = {{
            display : "flex",
            justifyContent : "center",
            alignItems : "center" ,
            width : "100%",
            flexDirection : "coloumn",
            marginBottom : "2rem",
        }}
    >
      <img src = {transactions} style = {{width : "400px" , margin:"4rem"}}/>
      <h1 style = {{textAlign:"center"}}>
        You Have No Transactions Currently
      </h1>
    </div>
  );
}

export default NoTransaction ;
