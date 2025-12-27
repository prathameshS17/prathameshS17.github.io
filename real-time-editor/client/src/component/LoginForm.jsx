// src/components/LoginForm.jsx
import { useState } from "react"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "../firebase"
import Login from "/login.png"
import googleIcon from "/google-logo.png"
import passwordShow from "/password-show.png"
import passwordHide from "/password-hide.png"
import cancelIcon from "/cancel-icon.png"
import closeIcon from "/close-icon.png"
import SignUp from "./SignUp.jsx"
import "./loginToggle.css"

export default function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordToggle, setPasswordToggle] = useState("show")
    const [flipped, setFlipped] = useState(false)
    const [errorEmail, setErrorEmail] = useState(null)
    const [authError, setAuthError] = useState(null)
    
    const handleEmail = (event) =>{
        let email = event.target.value
        setEmail(email)
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        if(!emailRegex.test(email)){
            setErrorEmail("Invalid email address format")
            return
        }else{
            setErrorEmail(null)
        }
    }

    const handleSubmit = async () => {
        try {
            if(errorEmail) return
            await signInWithEmailAndPassword(auth, email, password)
        } catch (err) {
            console.log("err.message isi.../.....",err.message)
            setAuthError(err.message)
        }
    };

    const handleSignUp = ()=>{
        setFlipped(true)
        setEmail("")
        setPassword("")
        setErrorEmail(null)
        setAuthError(null)
    }

    const onClickBack = ()=>{
        setFlipped(false)
    }

    return (
        <div className="rounded-xl grid grid-cols-2 h-full bg-blue-50 shadow-2xl">
            <div className="overflow-hidden">
                <img src={Login} alt="collaboration-image" className="h-full rounded-l-xl w-full object-cover" />
            </div>
            
            <div className="flex flex-col justify-center items-center px-4 my-auto" >
                <div className="text-5xl font-semibold w-full mb-6 px-8">
                    RealTime Editor
                </div>

                <div className="w-full h-[25rem] flip-card px-8 box-border">
                    <div className={`${flipped?"flipped":""} bg-white shadow-xl rounded relative [transform-style:preserve-3d] transition-transform duration-700 h-full w-full`}>
                        {/* ------- Login ----------- */}
                        <div className={`flip-face w-full h-full absolute top-0 left-0 px-10 py-8  flex flex-col justify-center`}>
                            <div className="w-full mb-1 flex justify-center flex-col gap-1 relative">
                                <div className="w-full  text-2xl">
                                    <label htmlFor="emailId">Email Address</label>
                                </div>
                            
                                <div className="w-full"> 
                                    <input
                                        type="email"
                                        id="emailId"
                                        value={email}
                                        placeholder="Email Address"
                                        className="border py-2.5 px-2 rounded w-full"  
                                        required
                                        onChange={handleEmail}
                                    />
                                    {/* <p className={`${errorEmail?"block":"invisible"} text-xs text-red-700 ml-0.5`}>{errorEmail}</p> */}
                                    {errorEmail?<p className="ml-0.5 text-xs text-red-700">{errorEmail}</p>:<p className="ml-0.5 invisible text-xs text-red-700">erroremail</p>}
                                </div>
                                
                            </div>

                            <div className="mb-7 w-full flex justify-center flex-col gap-1">
                                <div className="w-full  text-2xl">
                                    <label htmlFor="password">Password</label>
                                </div>
                            
                                <div className="relative w-full">
                                    <input
                                        type={passwordToggle=="show"?"password":"text"}
                                        id="password"
                                        value={password}
                                        placeholder="Password"
                                        className="border py-2.5 px-2 rounded w-full"
                                        onChange={(event)=>setPassword(event.target.value)}
                                        required
                                    />
                                    {passwordToggle=="show"?
                                        <img src={passwordShow} alt="show" className="h-5 w-5 absolute top-3 right-4 cursor-pointer" onClick={()=>setPasswordToggle("hide")}/> :
                                        <img src={passwordHide} alt="hide" className="h-5 w-5 absolute top-3 right-4 cursor-pointer" onClick={()=>setPasswordToggle("show")}/>
                                    }
                                    {/* {showMessages && (
                                        <>
                                            <p className={`text-xs ml-0.5 ${errorPassword.length?"text-red-700":"text-green-700"} flex items-center gap-1`}><img className="h-2 w-2" src={errorPassword.length?cancelIcon:checkedIcon}/><span>Password should be at least 6 characters</span></p>
                                            <p className={`text-xs ml-0.5 ${errorPassword.alphanum?"text-red-700":"text-green-700"} flex items-center gap-1`}><img className="h-2 w-2" src={errorPassword.alphanum?cancelIcon:checkedIcon}/><span>Password should contain only alphanumeric characters</span></p>
                                        </>
                                    )} */}
                                </div>
                            </div>

                            <div className="flex gap-2 mb-4">
                                <button className={`${email && password?"bg-blue-600 cursor-pointer":"bg-blue-300 disabled cursor-not-allowed"} w-1/2 py-2 rounded text-lg text-white font-semibold`} onClick={handleSubmit}>
                                    Login
                                </button>
                            
                                {/* <div className="flex items-center w-full mb-4 text-gray-500 ">
                                    <hr className="flex-grow border-t border-gray-300" />
                                    <span className="font-medium text-lg px-3">or</span>
                                    <hr className="flex-grow border-t border-gray-300" />
                                </div> */}

                                <button className="w-1/2 py-2 rounded text-lg border border-gray-400 cursor-pointer flex justify-center items-center gap-3">
                                    <img src={googleIcon} alt="google-icon" className="h-5 w-5"/>
                                    <div>Continue with Google</div>
                                </button>
                            </div>

                            {authError?
                                <div className="w-full px-2 py-2 mb-2 bg-red-200 text-red-700 rounded flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <img src={cancelIcon} className=" h-4 w-4"/> 
                                        <span>{authError}</span> 
                                    </div>
                                    <img src={closeIcon} className="h-3 w-3 mx-3 cursor-pointer" onClick={()=>setAuthError(null)}/>
                                </div>
                                :<></>
                            }
                            <div className="w-full text-center">
                                Don't have an account? <span className="text-blue-600 font-semibold cursor-pointer underline" onClick={handleSignUp}>Sign up</span>
                            </div>
                        </div>
                    
                        {/* ------- sign up ----------- */}
                        <div className={`flip-face back w-full h-full absolute top-0 left-0 px-10 py-8`}>
                            <SignUp onClickBack={onClickBack}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
