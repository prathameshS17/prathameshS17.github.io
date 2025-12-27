import { useState } from "react"
import passwordShow from "/password-show.png"
import passwordHide from "/password-hide.png"
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import checkedIcon from "/checked-icon.png"
import cancelIcon from "/cancel-icon.png"
import closeIcon from "/close-icon.png"

function SignUp (props){
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [passwordToggle, setPasswordToggle] = useState("show")
    const [errorEmail, setErrorEmai] = useState(null)
    const [errorPassword, setErrorPassword] = useState({
        length:true, alphanum:true
    })
    const [authError, setAuthError] = useState(null)

    const handleEmail  = (event)=>{
        let emailData = event.target.value
        setEmail(emailData)
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        if(!emailRegex.test(emailData)){
            setErrorEmai("Invalid email address format")
            return
        }else{
            setErrorEmai(null)
        }
    }

    const handlePassword  = (event)=>{
        let password = event.target.value
        setPassword(password)
        if(password.length<6){
            setErrorPassword((prev)=>({
                ...prev,length:true
            }))
        }else{
            setErrorPassword((prev)=>({
                ...prev, length:null
            }))
        }

        const passwordRegex = /^[a-zA-Z0-9]+$/
        if(!passwordRegex.test(password)){
            setErrorPassword((prev)=>({
                ...prev, alphanum:true
            }))
        }else{
            setErrorPassword((prev)=>({
                ...prev, alphanum:null
            }))
        }
    }   

    const showMessages = password.length > 0 && !(errorPassword.length==null && errorPassword.alphanum==null)

    const handleSignUp = async(e)=>{
        try{
            e.preventDefault()
            if(errorEmail || errorPassword.length || errorPassword.alphanum) return
            let isSignUp = await createUserWithEmailAndPassword(auth, email, password)
            console.log("isSignUp is../......", isSignUp)
        }catch(error){
            console.log("error../...",error.message)
            setAuthError(error.message)
        }
    }

    const handleBack = ()=>{
        setEmail("")
        setPassword("")
        setErrorEmai(null)
        setErrorPassword({length:true,alphanum:true})
        props.onClickBack()
    }

    return(
        <div className="flex flex-col justify-center w-full h-full">
            <div className="w-full mb-1.5 flex justify-center flex-col gap-1 relative">
                <div className="w-full text-2xl">
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
                    {errorEmail?<p className="ml-0.5 text-xs text-red-700">{errorEmail}</p>:<p className="ml-0.5 invisible text-xs text-red-700">erroremail</p>}
                </div>
            </div>

            <div className="mb-6 w-full flex justify-center flex-col gap-1">
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
                        onChange={handlePassword}
                        required
                    />
                    {passwordToggle=="show"?
                        <img src={passwordShow} alt="show" className="h-5 w-5 absolute top-3 right-4 cursor-pointer" onClick={()=>setPasswordToggle("hide")}/> :
                        <img src={passwordHide} alt="hide" className="h-5 w-5 absolute top-3 right-4 cursor-pointer" onClick={()=>setPasswordToggle("show")}/>
                    }
                    {showMessages && (
                        <>
                            <p className={`ml-0.5 mt-1 text-xs ${errorPassword.length?"text-red-700":"text-green-700"} flex gap-1 items-center`}><img src={errorPassword.length?cancelIcon:checkedIcon} className=" bg-amber-50 h-2 w-2"/><span>Password should be at least 6 characters</span></p>
                            <p className={`ml-0.5 text-xs ${errorPassword.alphanum?"text-red-700":"text-green-700"} flex gap-1 items-center`}><img src={errorPassword.alphanum?cancelIcon:checkedIcon} className="h-2 w-2"/>Password should contain only alphanumeric characters</p>
                        </>
                    )}
                </div>
            </div>

            <button className={`${email && password?"bg-blue-600 cursor-pointer":"bg-blue-300 disabled cursor-not-allowed"} w-full mb-4 py-2 rounded text-lg text-white font-semibold`} onClick={handleSignUp}>
                Sign Up
            </button>

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
                Already have an account? <span className="text-blue-600 font-semibold cursor-pointer underline" onClick={handleBack}>Login</span>
            </div>
        </div>
    )
}

export default SignUp