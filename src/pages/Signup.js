import React from 'react'
import Header from '../components/Header'
import SignUpSignInComponent from '../components/SignUpSignIn'

function Signup() {
  return (
    <>
      <div>
        <Header/>
        <div 
          className="wrapper" 
          style={{display: "flex" , justifyContent: "center", margin: "50px"}}
        >
          <SignUpSignInComponent/> 
        </div>
      </div>
    </>
  )
}

export default Signup
