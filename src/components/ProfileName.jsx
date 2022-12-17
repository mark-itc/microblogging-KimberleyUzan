import React from "react";
import { useEffect, useState, useRef } from "react";
import { Redirect } from "react-router";
import firebase from "firebase/app";
import "firebase/firestore";

const ProfileName = (props) => {
  const [currentNickName, setCurrentNickName] = useState(null);
  const [newNickName, setNewNickName] = useState(null);
  const [redirect, setRedirect] = useState(null);
  const [userName, setUserName] = useState(null);
  const [value, setValue] = useState("");
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    firebase
      .firestore()
      .collection("users")
      .doc(props.currentUser)
      .get()
      .then((doc) => {
        if (doc.exists) {
          setUserName(doc.data().name);
        } else {
          console.log(props.currentUser);
        }
      })
      .catch((error) => {
        console.log("Error Username:", error);
      });
    firebase
      .firestore()
      .collection("nicknames")
      .doc(props.currentUser)
      .get()
      .then((doc) => {
        if (doc.exists) {
          setCurrentNickName(doc.data().nickName);
        } else {
          setCurrentNickName(userName);
        }
      })
      .catch((error) => {
        console.log("Error User: ", error);
      });
    return () => {
      isMounted.current = false;
    };
  }, [props.currentUser, userName]);

  const createNewNickName = async () => {
    await firebase
      .firestore()
      .collection("nicknames")
      .doc(props.currentUser)
      .get()
      .then((doc) => {
        if (doc.exists) {
          firebase
            .firestore()
            .collection("nicknames")
            .doc(props.currentUser)
            .set({
              nickName: newNickName,
            });
        } else {
          firebase
            .firestore()
            .collection("nicknames")
            .doc(props.currentUser)
            .set({
              nickName: newNickName,
            });
        }
      })
      .catch((error) => {
        console.log("Error User :", error);
      });
  };


  const handleSubmit = (event) => {
    event.preventDefault();
    createNewNickName();
    alert(
      "Successfully, your Username is " +
        newNickName +
        ". Redirected to the main page."
    );
    setRedirect("/");
  };

  const handleChange = (event) => {
    setValue(event.target.value);
    setNewNickName(event.target.value);
  };

  if (redirect) {
    return <Redirect to={redirect} />;
  }
  return (
    <div className="container text-white profile">
      <h2>Profile</h2>
      <h3>User Name</h3>
      {!currentNickName && (
        <span>
          The current name is "{userName}". You can change it below: 
        </span>
      )}
      {currentNickName && (
        <span>
          {userName}, The current name is "
          {currentNickName}" . You can change it below: 
        </span>
      )}
      <form className="card-profile" onSubmit={(event) => handleSubmit(event)}>
        <div className="card-body-profile">
          <input
            className="form-control"
            name="text"
            type="text"
            rows="1"
            value={value}
            placeholder={currentNickName}
            onChange={(event) => handleChange(event)}
          />
        </div>
        <div className="card-body tweet-header">
          <div className="float-end">
            {newNickName !== currentNickName && (
              <button className="btn btn-primary">Save</button>
            )}
            {newNickName === currentNickName && (
              <button className="btn btn-primary disabled">Save</button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProfileName;
