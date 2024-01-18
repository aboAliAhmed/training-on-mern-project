import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable
} from 'firebase/storage';
import { app } from "../firebase";
import { 
  updateUserStart, 
  updateUserSuccess, 
  updateUserFailure, 
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  logoutStart,
  logoutFailure,
  loginSuccess,
  logoutSuccess
} from "../redux/user/userSlice";
import { useDispatch } from "react-redux";

export default function Profile() {
  const fileRef = useRef(null); // To reference the file input element.
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (file) { // useEffect is triggered whenever the file state changes.
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = () => {
    const storage = getStorage(app); // Getting a reference to Firebase Storage
    const fileName = new Date().getTime() + file.name; // to make file name unique
    const storageRef = ref(storage, fileName); // Showing which place to save storage
    const uploadTask = uploadBytesResumable(storageRef, file); // uploadBytesResumable allows tracking the upload progress

    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, avatar: downloadURL });
        })
      }
    );
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/v1/user/${currentUser.data.user._id}`,{
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if(data.status === 'fail') {
        dispatch(updateUserFailure(data.message));
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (err) {
      dispatch(updateUserFailure(err.message));
    }
  }

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/v1/user/${currentUser.data.user._id}`, {
        method: 'DELETE',
      })
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (err) {
      dispatch(deleteUserFailure(err.message));
    }
  }

  const handleLogout = async () => {
    try {
      dispatch(logoutStart());
      const res = await fetch('/api/v1/auth/logout')
      const data = await res.json();
      if (data.success === false) {
        dispatch(logoutFailure(data.message));
        return;
      }
      dispatch(logoutSuccess(data));
    } catch (err) {
      dispatch(logoutFailure(err.message));
    }
  }

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Profile
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          ref={fileRef}
          accept="image/*"
          hidden 
        />
        <img
          onClick={() => fileRef.current.click()}
          src={formData?.avatar || currentUser.data?.user.avatar}
          alt="profile"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
        />
        <p className="text-sm self-center">
          {
            fileUploadError
              ? <span className="text-red-700">Image must be lless than 2 mb</span>
              : filePerc > 0 && filePerc < 100
                ? <span>{`Uploading ${filePerc}`}</span>
                : filePerc === 100
                  ? <span className="text-green-700">Successfully Uploaded!</span>
                  : ""
          }
        </p>
        <input
          type="text"
          placeholder="username"
          id="username"
          defaultValue={currentUser.data?.user.username}
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="email"
          id="email"
          defaultValue={currentUser.data?.user.email}
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="password"
          id="password"
          className="border p-3 rounded-lg"
        />
        <button
          disabled={loading}
          className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disdabled:opacity-95"
        >
          {loading ? 'loading...' : 'update'}
        </button>
      </form>
      <div className="flex justify-between mt-5">
        <span 
          onClick={handleDeleteUser} 
          className="text-red-700 cursor-pointer"
        >
          Delete account
        </span>
        <span
          onClick={handleLogout} 
          className="text-red-700 cursor-pointer"
        >
          Log Out
        </span>
      </div>
      <p className="text-red-700 mt-5">{error ? error.message : ''}</p>
      <p className="text-green-700 mt-5">{updateSuccess ? 'User is updated successfully' : ''}</p>
    </div>
  )
}
