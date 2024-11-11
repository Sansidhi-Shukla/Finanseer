import React , {useEffect} from 'react';
import "./styles.css" ;
import { auth } from '../../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import {useNavigate } from 'react-router-dom';
import { signOut } from "firebase/auth";
import { toast } from 'react-toastify';
import UserImg from '../../assets/user.png';

function Header() {

  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if(user){
      navigate("/dashboard");
    }
  }, [user,loading])
  

  function logoutFnc(){
    try{
      signOut(auth)
        .then(() => {
          // Sign-out successful.
          navigate("/");
          toast.success("LoggedOut Successfully")
        })
        .catch((error) => {
          // An error happened.
          toast.error(error.message);
        });
    }
    catch(e){
      toast.error(e.message);
    }
    /* alert("Logout !! "); */
  }
  return (
    <>
      <div className="navbar">
        <p className="logo">Finanseer</p>
        {user && (
          <div style={{display : "flex" , alignItems:"center" , gap:"0.75rem"}}>
            <img src={user.photoURL ? user.photoURL : UserImg}  style={{width:"2rem", height:"2rem", borderRadius:"50%"}}/>
            <p className="logo link" onClick={logoutFnc}>
              Logout
            </p>
          </div>
        )}
      </div>
    </>
  );
}

export default Header;