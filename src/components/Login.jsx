import firebase from "firebase/app";
import * as firebaseui from "firebaseui";
import "firebaseui/dist/firebaseui.css";
import { useContext, useLayoutEffect } from "react";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const authContext = useContext(AuthContext);
  useLayoutEffect(() => {
    const ui =
      firebaseui.auth.AuthUI.getInstance() ||
      new firebaseui.auth.AuthUI(firebase.auth());
    ui.start("#firebaseui-auth-container", {
      signInOptions: [
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
      ],
      signInFlow: "popup",
      callbacks: {
        signInSuccessWithAuthResult: (authresult) => {
          const { displayName, uid, photoURL, picture } = authresult.user;
          const authUser = {
            uid,
            displayName,
            photoURL,
            picture,
          };
          authContext.login(authUser);
          console.log(authUser);
          console.log(authresult.user);
          return false;
        },
      },
    });
  }, [authContext]);
  return (
    <div className="container-login">
      <h3>PLEASE SIGN IN</h3>
      <div className="sign-in" id="firebaseui-auth-container"></div>
    </div>
  );
};

export default Login;


