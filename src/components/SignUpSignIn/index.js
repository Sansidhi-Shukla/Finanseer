import React , { useState } from 'react';
import "./styles.css" ;
import Input from '../Input';
import Button from '../Button';
import { createUserWithEmailAndPassword , signInWithEmailAndPassword , signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import {auth, db , provider} from "../../firebase" ;
import {toast} from "react-toastify";
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc } from "firebase/firestore";

function SignUpSignInComponent() {

    const [name,setName] = useState("");
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [confirmPassword,setConfirmPassword] = useState("");
    const [loginForm , setLoginForm] = useState(false);
    const [loading,setLoading] = useState(false);
    const navigate = useNavigate();

    function signUpWithEmail(){
        setLoading(true);
        console.log("Name",name);
        console.log("email",email);
        console.log("password",password);
        console.log("confirmPassword",confirmPassword);    
        
        //need to authenticate the user or create a new user using email or password

        if(name !== "" && email !== "" && password !== "" && confirmPassword !== ""){
            if(password===confirmPassword){
                createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                   // Signed in 
                    const user = userCredential.user;
                    console.log("User>>>",user)
                    toast.success("User Created");
                    setLoading(false);   
                    setConfirmPassword("");
                    setEmail("");
                    setName("");
                    setPassword("");             
                    // create a document with user id as the following id
                    createDoc(user);
                    navigate("/dashboard");
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    toast.error(errorMessage);
                    setLoading(false);
                // ..
                });
            }
            else{
                toast.error("Password and Confirm Password don't Match");
                setLoading(false);
            }
        }
        else{
            toast.error("All feilds are mandatory !");
            setLoading(false);            
        }
    }

    async function createDoc(user){
        setLoading(true);
        //Make sure that a doc with a uid doesn't exist
        //create a doc
        if(!user)return ;

        const userRef = doc(db , "users" , user.uid);
        const userData = await getDoc(userRef);

        if(!userData.exists()){
            try{
                await setDoc(doc(db, "users", user.uid), {
                    name : user.displayName ? user.displayName : name,
                    email : user.email,
                    photoURL : user.photoURL ? user.photoURL : "" ,
                    createdAt : new Date(),
                });
                toast.success("Doc Created");
                setLoading(false);
            }
            catch(e){
                toast.error(e.message);
                setLoading(false);
            }
        }
        else{
            setLoading(false);
        }
    }

    function loginWithEmail(){
        console.log("Email : ",email);
        console.log("Password : ",password);
        setLoading(true);

        if(email !== "" && password !== ""){
            signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            setLoading(false);
            navigate("/dashboard");
            toast.success("User LoggedIn");
            // ...
            })
            .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            setLoading(false);
            toast.error(errorMessage);
            });
        }
        else{
            setLoading(false);
            toast.error("All Fields are mandatory");
        }
    }

    function googleAuth(){
        setLoading(true);

        try{
            signInWithPopup(auth, provider)
            .then((result) => {
                // This gives you a Google Access Token. You can use it to access the Google API.
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                // The signed-in user info.
                const user = result.user;
                console.log("User>>>",user);
                setLoading(false);
                createDoc(user);
                navigate("/dashboard");
                toast.success("User Authenticated");
                // IdP data available using getAdditionalUserInfo(result)
                // ...
            })
            .catch((error) => {
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                setLoading(false);
                toast.error(errorMessage)
                // ...
            });
        }
        catch(e){
            toast.error(e.message);
            setLoading(false);
        }
    }


    return(
        <>
            {(loginForm ? 
                <div className="signup-wrapper">
                    <h2 className='title'>Login on <span style = {{color:"var(--theme)"}}>Finanseer</span></h2>
                    <form>
                        <Input 
                            type = "email"
                            label={"Email"}  
                            state={email}  
                            setState={setEmail}  
                            placeholder={"Email@123.com"}
                        />

                        {/*firebase already takes care that password is atleast of six charecters*/}
                        <Input 
                            type = "password"
                            label={"Password"}  
                            state={password}  
                            setState={setPassword}  
                            placeholder={"example_123"}
                        />

                        <Button 
                            disables = {loading}
                            text={loading ? "Loading..." : "Login using Email and Password"} 
                            onClick={loginWithEmail}
                        />  

                        <p className='p-text'>or</p>

                        <Button 
                            text={loading ? "Loading..." : "Login using Google"} 
                            blue={true}
                            onClick={googleAuth}
                        />
                        <p 
                            className='p-text' 
                            style = {{cursor:"pointer"}} 
                            onClick={() => setLoginForm(!loginForm)}
                        >
                            Or Don't Have An Account Already? Click Here
                        </p>
                    </form>
                </div> 

                :

                <div className="signup-wrapper">
                    <h2 className='title'>SignUp on <span style = {{color:"var(--theme)"}}>Finanseer</span></h2>
                    <form>
                        <Input 
                            label={"Full Name"}  
                            state={name}  
                            setState={setName}  
                            placeholder={"Your Name"}
                        />
                        <Input 
                            type = "email"
                            label={"Email"}  
                        state={email}  
                            setState={setEmail}  
                            placeholder={"Email@123.com"}
                            />

                        {/*firebase already takes care that password is atleast of six charecters*/}
                        <Input 
                            type = "password"
                            label={"Password"}  
                            state={password}  
                            setState={setPassword}  
                            placeholder={"example_123"}
                        />
                        <Input 
                            type = "password"
                            label={"Confirm Password"}  
                            state={confirmPassword}  
                            setState={setConfirmPassword}  
                            placeholder={"example_123"}
                    />

                        <Button 
                            disabled = {loading}
                            text={loading ? "Loading..." : "SignUp using Email and Password"} 
                            onClick={signUpWithEmail}
                        />  

                        <p className='p-text'>or</p>

                        <Button 
                            text={loading ? "Loading..." : "SignUp using Google"} 
                            blue={true}
                            onClick={googleAuth}
                        />

                        <p 
                            className='p-text' 
                            style = {{cursor:"pointer"}} 
                            onClick={() => setLoginForm(!loginForm)}
                        >
                            Or Already Have An Account? Click Here
                        </p>   
                    </form>
                </div>
            )}   
        </>  
    );
}

export default SignUpSignInComponent
