import { createContext, useEffect, useState } from "react";
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signInWithEmailLink, signOut } from "firebase/auth";
import { app } from "../firebase/firebase.config";

export const AuthContext=createContext(null)
const auth = getAuth(app);


const AuthProvider = ({ children }) => {
    
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);


    // create user 
    const createUser = (email, password) => {
        setLoading(true)
    return createUserWithEmailAndPassword(auth,email,password)

}

// signin user
    const signIn = (email, password) => {
        setLoading(true)
        return signInWithEmailAndPassword(email,password)

    }
    
    

    // logout
    const logOut = () => {
        setLoading(true);
        return signOut(auth);

    }

    

    useEffect(() => {
      const unSubscribe=  onAuthStateChanged(auth, currentUser => {
            setUser(currentUser);
            console.log('current user', currentUser)
            setLoading(false)

      })
        return () => {
            unSubscribe();
        }
        
},[])



    const authValue = {
    user,loading,createUser,signIn,logOut
}
    return (
        <AuthContext.Provider value={authValue}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;