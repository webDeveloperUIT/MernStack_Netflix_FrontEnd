import {
  CalendarToday,
  LocationSearching,
  MailOutline,
  PermIdentity,
  PhoneAndroid,
  Publish,
  AccountBalanceWallet,
  Loyalty,
} from "@material-ui/icons";

import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

import storage from "../../firebase";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import userApi from "../../api/userApi";
import { toast } from "react-toastify";
import Navbar from "../../components/Navbar/Navbar";
import { userSlice } from "../../redux/reducer/userSlice";
import { useDispatch, useSelector } from "react-redux";
import "./user.css";

export default function User() {
  let user = useSelector((state) => state.user.user);
  const navigate = useNavigate();
  const dispatch = useDispatch;

  const [profilePic, setProfilePic] = useState(null);
  const [uploaded, setUploaded] = useState(0);
  const [userInfo, setUserInfo] = useState(null);

  const handleChange = (e) => {
    const value = e.target.value;
    setUserInfo({ ...userInfo, [e.target.name]: value });
  };

  const imageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setProfilePic(e.target.files[0]);
    }
  };

  const removeSelectedImage = () => {
    setProfilePic();
  };

  const upload = (items) => {
    items.forEach((item) => {
      // const fileName = new Date().getTime() + item.label + item.file;
      const storageRef = ref(storage, `/users/${item.file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, item.file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
        },
        (error) => {
          console.log(error);
        },
        async () => {
          getDownloadURL(uploadTask.snapshot.ref).then((url) => {
            setUserInfo((prev) => {
              return { ...prev, [item.label]: url };
            });
            setUploaded((prev) => prev + 1);
          });
        }
      );
    });
  };

  const handleUpload = (e) => {
    e.preventDefault();
    upload([{ file: profilePic, label: "profilePic" }]);
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const res = await userApi.updateUser(user._id, userInfo);
      toast.success(res.data.message);

      const newUserInfo = await userApi.newUserInfo(user._id);
      window.localStorage.setItem(
        "user",
        JSON.stringify(newUserInfo.data.user)
      );
      console.log(newUserInfo);
      // dispatch(userSlice.actions.setUser(newUserInfo.data.user));
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      <Navbar />
      <div className="user">
        <div className="userTitleContainer">
          <h1 className="userTitle">Edit User</h1>
        </div>
        <div className="userContainer">
          <div className="userShow">
            <div className="userShowTop">
              <img src={user.profilePic} alt="" className="userShowImg" />
              <div className="userShowTopTitle">
                <span className="userShowUsername">{user.username}</span>
              </div>
            </div>
            <div className="userShowBottom">
              <span className="userShowTitle">Account Details</span>
              <div className="userShowInfo">
                <PermIdentity className="userShowIcon" />
                <span className="userShowInfoTitle">{user.username}</span>
              </div>
              <span className="userShowTitle">Contact Details</span>
              <div className="userShowInfo">
                <PhoneAndroid className="userShowIcon" />
                <span className="userShowInfoTitle">{user.phone}</span>
              </div>
              <div className="userShowInfo">
                <MailOutline className="userShowIcon" />
                <span className="userShowInfoTitle">{user.email}</span>
              </div>
              <div className="userShowInfo">
                <AccountBalanceWallet className="userShowIcon" />
                <span className="userShowInfoTitle">{user.wallet_balance}</span>
              </div>
              <div className="userShowInfo">
                <Loyalty className="userShowIcon" />
                <span className="userShowInfoTitle">{user.point}</span>
              </div>
            </div>
          </div>
          <div className="userUpdate">
            <span className="userUpdateTitle">Edit</span>
            <form className="userUpdateForm">
              <div className="userUpdateLeft">
                <div className="userUpdateItem">
                  <label>Username</label>
                  <input
                    type="text"
                    placeholder="annabeck99"
                    name="username"
                    onChange={handleChange}
                    className="userUpdateInput"
                  />
                </div>
                <div className="userUpdateItem">
                  <label>Email</label>
                  <input
                    type="text"
                    name="email"
                    onChange={handleChange}
                    placeholder="jony@gmail.com"
                    className="userUpdateInput"
                  />
                </div>
                <div className="userUpdateItem">
                  <label>Phone</label>
                  <input
                    type="text"
                    name="phone"
                    onChange={handleChange}
                    placeholder="0353339425"
                    className="userUpdateInput"
                  />
                </div>
                <div className="userUpdateItem">
                  <label>Wallet Balance</label>
                  <input
                    type="number"
                    name="wallet_balance"
                    onChange={handleChange}
                    placeholder="0"
                    className="userUpdateInput"
                  />
                </div>
                <div className="userUpdateItem">
                  <label>Point</label>
                  <input
                    type="number"
                    name="point"
                    placeholder=""
                    onChange={handleChange}
                    className="userUpdateInput"
                  />
                </div>
                {user.isAdmin ? (
                  <div></div>
                ) : (
                  <div className="userUpdateItem">
                    <label>Type</label>
                    <select
                      name="isAdmin"
                      className="userUpdateInput"
                      onChange={handleChange}
                    >
                      <option value="false">isMember</option>
                      <option value="true">isAdmin</option>
                    </select>
                  </div>
                )}
              </div>
              <div className="userUpdateRight">
                <div className="userUpdateUpload">
                  {profilePic ? (
                    <div>
                      <img
                        src={URL.createObjectURL(profilePic)}
                        alt="Thumb"
                        className="userUpdateImg"
                      />
                    </div>
                  ) : (
                    <img
                      className="userUpdateImg"
                      src={user.profilePic}
                      alt=""
                    />
                  )}
                  <label htmlFor="file">
                    <Publish className="userUpdateIcon" />
                  </label>
                  <input
                    type="file"
                    id="file"
                    style={{ display: "none" }}
                    name="profilePic"
                    onChange={imageChange}
                  />
                </div>
                {uploaded === 1 ? (
                  <button className="userUpdateButton" onClick={handleSubmit}>
                    Create
                  </button>
                ) : (
                  <button className="userUpdateButton" onClick={handleUpload}>
                    Upload
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
