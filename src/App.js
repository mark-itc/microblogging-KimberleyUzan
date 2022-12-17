import React from "react";
import { useEffect, useState } from "react";
import "./App.css";
import { AuthContext } from "./context/AuthContext";
import firebase from "firebase/app";
import "firebase/firestore";
import Login from "./components/Login";
import TweetUI from "./components/TweetUI";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBof51U68nLB-JrtmRxPDR2PlcAAHl6DEY",
  authDomain: "microblog-app-kimberley.firebaseapp.com",
  projectId: "microblog-app-kimberley",
  storageBucket: "microblog-app-kimberley.appspot.com",
  messagingSenderId: "81446669590",
  appId: "1:81446669590:web:068b702c0ab913c5469437"
};

firebase.initializeApp(firebaseConfig);

function App() {
  const [authUser, setAuthUser] = useState(null);
  const [authStorage, setAuthStorage] = useState(null);
  const login = async (authUser) => {
    setAuthUser(authUser);
    setAuthStorage(firebase.storage());
    await firebase
      .firestore()
      .collection("users")
      .doc(authUser.uid)
      .set({ name: authUser.displayName });
  };

  useEffect(() => {
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL); 
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        setAuthUser(user);
      } else {
        setAuthUser(null);
      }
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        authUser,
        authStorage,
        login,
        logout: () => setAuthUser(null),
      }}>
      {!authUser && <Login />}
      {authUser && <TweetUI authUser={authUser} authStorage={authStorage} />}
    </AuthContext.Provider>
  );
}

export default App;
