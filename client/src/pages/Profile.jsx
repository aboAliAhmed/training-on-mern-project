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
  logoutSuccess
} from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import { Link } from 'react-router-dom'

export default function Profile() {
  const fileRef = useRef(null); // To reference the file input element.
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingError, setShowListingError] = useState(false)
  const [userListings, setUserListings] = useState([]);
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

  const handleShowListings = async () => {
    try {
      setShowListingError(false);
      const res = await fetch(`api/v1/listing/user/${currentUser.data.user._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListingError(true);
        return;
      }

      setUserListings(data);
    } catch (err) {
      setShowListingError(true);
    }
  }

  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`api/v1/listing/${listingId}`, {
        method: 'DELETE'
      })
      const data = await res.json
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setUserListings((prev) => prev.filter((listing)=> listing._id !== listingId)); // filter out the previous data in the userListings to delete the current listing
    } catch (err) {
      console.log(err)
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
        <Link 
          className="bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95" 
          to={'/create-listing'}
        >
          Create Listing
        </Link>
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
      <p className="text-green-700 mt-5">
        {updateSuccess ? 'User is updated successfully' : ''}
      </p>
      <button onClick={handleShowListings} className="text-green-700 w-full">
        Show Listings
      </button>
      <p className="text-red-700 mt-5">
        {showListingError ? 'Error showing listings' : ''}
      </p>
      {userListings && 
        userListings.length > 0 && 
        <div className="flex flex-col gap-4">
          <h1 className="text-center mt-7 text-2xl font-semibold">Your listings</h1>
          {userListings.map((listing) => (
                <div 
                  key={listing._id}
                  className="border rounded-lg p-3 flex justify-between items-center gap-4"
                >
                  <Link to={`/listing/${listing._id}`} >
                    <img 
                      src={listing.imageURLs[0]} 
                      alt={listing.name} 
                      className="h-16 w-16 object-contain"
                    />
                  </Link>
                  <Link 
                    to={`/listing/${listing._id}`} 
                    className="text-slate-700 font-semibold hover:underline truncate flex-1" 
                  >
                    <p>{listing.name}</p>
                  </Link>
                  <div className="flex flex-col items-center">
                    <button 
                      onClick={() => handleListingDelete(listing._id)}   
                      className="text-red-700"
                    >Delete</button>
                    <Link to={`/update-listing/${listing._id}`}>
                     <button className="text-green-700">Edit</button>
                    </Link>
                  </div>
                </div>
            ))}
        </div>}
    </div>
  )
}
