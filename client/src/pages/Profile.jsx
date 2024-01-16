import { useSelector } from "react-redux";
import{ useEffect, useRef, useState } from "react";
import { 
  getDownloadURL, 
  getStorage, 
  ref, 
  uploadBytesResumable 
} from 'firebase/storage';
import { app } from "../firebase";

export default function Profile () {
  const fileRef = useRef(null); // To reference the file input element.
  const {currentUser} = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(()=> {
    if(file) { // useEffect is triggered whenever the file state changes.
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

  return (
    <div className="p-3 max-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Profile 
      </h1>
      <form className="flex flex-col gap-4">
        <input 
        onChange={(e)=>setFile(e.target.files[0])} 
        type="file" 
        ref={fileRef} 
        hidden accept="image/*"
      />
        <img 
          onClick={() => fileRef.current.click()}
          src={formData.avatar || currentUser.data.user.avatar} 
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
          className="border p-3 rounded-lg"
        />
        <input 
          type="email"
          placeholder="email"
          id="email"
          className="border p-3 rounded-lg"
        />
        <input 
          type="text"
          placeholder="password"
          id="password"
          className="border p-3 rounded-lg"
        />
        <button 
          className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disdabled:opacity-95"
        >
          update
        </button>
      </form>
      <div className="flex justify-between mt-5">
        <span className="text-red-700 cursor-pointer">
          Delete account
        </span>
        <span className="text-red-700 cursor-pointer">
          Sign out
        </span>
      </div>
    </div>
  )
}
