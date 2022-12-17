import React from "react";
import { useState } from "react";
import firebase from "firebase/app";
import "firebase/storage";
import "firebase/firestore";

const ProfilePicture = (props) => {
  const { currentUser } = props;
  console.log(currentUser);
  const [image, setImage] = useState("");
  const [noImage, setNoImage] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState("");

  const deletePicture = (event) => {
    firebase
      .storage()
      .ref(`/images/${currentUser}`)
      .delete()
      .then(() => {
        alert("Successfully!");
        setNoImage(true);
      })
      .catch((error) => {
        alert("A problem has occurred - Please try again.");
      });
    event.preventDefault();
  };

  const uploadPicture = (event) => {
    if (!image) return;
    console.log("image: " + image);
    firebase
      .storage()
      .ref(`/images/${currentUser}`)
      .put(image)
      .on(
        "state_changed",
        alert("Successfully deleted"),
        alert,
        setNoImage(false),
        setImage("")
      );

    event.preventDefault();
  };

  let imageRef = firebase.storage().ref("/images/" + currentUser);

  imageRef
    .getDownloadURL()
    .then((url) => {
      setProfileImageUrl(url);
      setNoImage(false);
    })
    .catch((e) => {
      console.log("Upload error : ", e);
      setNoImage(true);
    });

  return (
    <>
      <div className="container text-white profile">
        <h3>Profile picture</h3>
        {noImage && (
          <span>
            Your profile picture is the one defined below. To edit it, select a picture and upload it.
          </span>
        )}
        {!noImage && (
          <span>To edit or delete your profile picture.</span>
        )}
        <form className="card-profile">
          <div className="card-body-profile">
            <input
              className="form-control"
              type="file"
              onChange={(event) => setImage(event.target.files[0])}
              rows="1"
            />
          </div>
          <div className="card-body tweet-header">
            <div className="float-end">
              {!noImage && !image && (
                <button
                  onClick={(event) => deletePicture(event)}
                  className="btn btn-danger">
                  Delete
                </button>
              )}
              {image && (
                <button
                  onClick={(event) => uploadPicture(event)}
                  className="btn btn-warning">
                  Upload
                </button>
              )}
            </div>
          </div>
        </form>
        <div className="col-lg-2 col-md-2">
          {noImage && <img src="default.png" alt="avatar" className="avatar"/>}
          {!noImage && <img src={profileImageUrl} alt="avatar" className="avatar" />}
        </div>
      </div>
    </>
  );
};

export default ProfilePicture;
