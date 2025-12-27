import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { useDispatch } from "react-redux"
import { setUser,logOut } from '../reduxStore/userSlice'

export default function ProtectedRoute({ children }) {
    const [firebaseUser, setFirebaseUser] = useState(undefined); 
    const dispatch = useDispatch()

    useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
        setFirebaseUser(user)
        if(user){
            let userData = {
                uid: user.uid,
                token:user.accessToken,
                email:user.email,
                userName:user.email.split("@")[0]
            }
            dispatch(setUser(userData))
        }

    });
    return () => unsub();
    }, []);


  if (firebaseUser === null )  {
    return <Navigate to="/" replace />;
  }

  return children;
}
