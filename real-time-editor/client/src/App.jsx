// src/App.jsx
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import LoginForm from "./component/LoginForm";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux"
import { setUser } from './reduxStore/userSlice'

function App() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const user = useSelector((state)=>state.user.user)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      if(firebaseUser){
        let userData = {
          uid: firebaseUser.uid,
          token:firebaseUser.accessToken,
          email:firebaseUser.email,
          userName: firebaseUser.email.split("@")[0]
        }
        console.log("...../.........",firebaseUser.email.split("@")[0])
        dispatch(setUser(userData))
        navigate("/dashboard")
      }
    });
    return () => unsub()
  }, []);
  
  return (
    <div className="p-10 h-screen bg-white">
        <LoginForm/>
    </div>
  );
}

export default App
