import React, { useContext, useState } from "react";
import axios from "axios";
import {toast} from 'react-toastify'
import { NotificationsContext } from "../context/NotificationsProvider";

const CreatePin = ({setShow , show}) => {

   const { setNotifications } = useContext(NotificationsContext);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !image) {
        alert("Please fill in all fields!");
        return;
    }

    const formData = new FormData();  //Correct way
    formData.append("title", title);
    formData.append("description", description);
    formData.append("image", image);

    try {
        setLoading(true);  //Start loading
        const token = localStorage.getItem("token");

        const res = await axios.post(
            `${import.meta.env.VITE_BASE_URL}/user/createPin`,
            formData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (res.status === 200) {
            setNotifications((prev) => [
        ...prev,
        {
          id: Date.now(),
          message: `🆕 Pin "${title}" has been created!`,
          time: new Date().toLocaleTimeString(),
        },
      ]);
            toast.success('Pin Created successfully');
            setTitle("");
            setDescription("");
            setImage(null);
            setPreview(null);
            setShow(false);
        }

    } catch (err) {
        console.error(err);
        alert(err.response?.data?.message || "Something went wrong!");
    } finally {
        setLoading(false);  // Stop loading
    }
};


  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  return (
    <div>
      {show && (
        <div className="absolute inset-0 z-[100] bg-opacity-30 backdrop-blur-sm flex justify-center items-center">
          <div className="relative max-w-4xl w-full bg-white p-8 rounded-2xl shadow-lg flex gap-6">
            {/* Close button */}
            <button
              onClick={() => setShow(false)}
              className="absolute top-1 cursor-pointer right-0 text-gray-500 hover:text-gray-800 text-2xl font-bold p-2"
            >
              &times;
            </button>

            {/* Left: Image preview */}
            <div className="flex-1 flex items-center justify-center border-zinc-300 border-2 border-dashed rounded-lg min-h-[300px]">
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <p className="text-gray-400 text-center">Image preview will appear here</p>
              )}
            </div>

            {/* Right: Form */}
            <form onSubmit={handleSubmit} encType="multipart/form-data" className="flex-1 flex flex-col gap-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="border border-zinc-400 p-3 rounded-lg cursor-pointer"
              />
              <input
                type="text"
                placeholder="Enter title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={!preview}
                className={`border p-3 border-zinc-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  !preview ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
              />
              <textarea
                placeholder="Enter description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={!preview}
                className={`border border-zinc-400 p-3 rounded-lg h-32 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  !preview ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
              ></textarea>

<button
    type="submit"
    disabled={!title || !description || !image || loading}
    className="bg-red-600 text-white cursor-pointer font-semibold py-3 rounded-lg hover:bg-red-700 transition flex items-center justify-center"
>
    {loading ? (
        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
        </svg>
    ) : (
        "Create Pin"
    )}
</button>

            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatePin;
