import React, { useContext, useState } from 'react';
import { userDataContext } from '../context/UserContext';
import axios from 'axios';

const EditProfile = () => {

    const {userData} = useContext(userDataContext);

    const [username, setUsername] = useState(userData?.user?.username || '');
    const [bio, setBio] = useState(userData?.user?.bio || '');
    const [webLink, setWebLink] = useState(userData?.user?.website || '');
    const [loading, setLoading] = useState(false);
    const [loading2, setLoading2] = useState(false);
    const [image, setImage] = useState(null);


  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.patch(`${import.meta.env.VITE_BASE_URL}/user/createBio`, {
        username,
        bio,
        webLink,
      },
     {
      headers:{
                    Authorization: `Bearer ${token}`,
                },
     }
    );
      setNotifications((prev) => [
      ...prev,
      {
        id: Date.now(),
        message: "📝 You updated your bio.",
        time: new Date().toLocaleTimeString(),
      },
    ]);
      // Optionally show a success message or update UI state
    } catch (error) {
      console.error('Error updating profile:', error);
      // Optionally show an error message
    }finally {
        setLoading(false);  // Stop loading
    }
  };

  const handleImageUpload = async (e) => {
    e.preventDefault();
    if (!image) {
        alert('Please select an image first.');
        return;
    }
    try {
        setLoading2(true);
          const token = localStorage.getItem("token");
        const formData = new FormData();
        formData.append("image",image);

        const response = await axios.patch(`${import.meta.env.VITE_BASE_URL}/user/setprofile`, formData, {
            headers: {
                    Authorization: `Bearer ${token}`,
                },
        });
         setNotifications((prev) => [
      ...prev,
      {
        id: Date.now(),
        message: "📸 You updated your profile picture.",
        time: new Date().toLocaleTimeString(),
      },
    ]);
        // Optionally show a success message or update UI
    } catch (error) {
        console.error('Error uploading profile picture:', error);
    } finally {
        setLoading2(false);
    }
};

  return (
    <div className="flex-grow pt-15 px-8 py-6 max-w-2xl overflow-hidden mx-auto">
      <h1 className="text-3xl font-semibold mb-1">Edit profile</h1>
      <p className="text-sm text-gray-600 mb-6">
        Keep your personal details private. Information you add here is visible to anyone who can view your profile.
      </p>

      {/* Photo Section */}
      <div className="mb-6">
  <p className="text-sm font-medium mb-2">Photo</p>
  <form onSubmit={(e)=>{
    handleImageUpload(e);
  }} encType="multipart/form-data"  className="flex items-center space-x-4">
    <img
      src={
        image
          ? URL.createObjectURL(image)
          : userData?.user?.profilePicture
      }
      alt="Profile"
      className="w-16 h-16 rounded-full object-cover"
    />
    <label className="bg-gray-200 px-4 py-2 rounded-full text-sm font-semibold hover:bg-gray-300 transition cursor-pointer">
      Change
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files[0])}
        className="hidden"
      />
    </label>
    <button
    type='submit'
    disabled={loading2}
      className="bg-red-600 cursor-pointer text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-red-700 transition"
    >
       {loading2 ? (
        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
        </svg>
    ) : (
        "Save"
    )}
    </button>
  </form>
</div>


      <form onSubmit={(e)=>{
        handleSave(e);
      }}>
      {/* Username Field */}
      <div className="mb-6">
        <label className="block text-sm mb-1 font-medium">Username</label>
        <input
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
        />
      </div>
      
        {/* Link Field */}
      <div className="mb-6">
        <label className="block text-sm mb-1 font-medium">Link</label>
        <input
          type="url"
          placeholder="https://www.example.com"
          value={webLink}
          onChange={(e) => setWebLink(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
        />
      </div>

      {/* About Textarea */}
      <div className="mb-6">
        <label className="block text-sm mb-1 font-medium">About</label>
        <textarea
          placeholder="Tell your story"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-black"
        ></textarea>
      </div>

      {/* Save Button */}
      <div>
        <button
          type="submit"
          className="bg-black cursor-pointer text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-gray-800 transition"
        >
         {loading ? (
        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
        </svg>
    ) : (
        "Save"
    )}
        </button>
      </div>
      </form>

    </div>
  );
};

export default EditProfile;
