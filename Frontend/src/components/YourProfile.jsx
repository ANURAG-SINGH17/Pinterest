import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { userDataContext } from "../context/UserContext";
import { unSavePin } from "../utils/pinSaverUnsaver";
import { NotificationsContext } from "../context/NotificationsProvider";
import axios from "axios";

const YourProfile = () => {
  const navigate = useNavigate();

  const { userData } = useContext(userDataContext);

  const [selectedPinId, setSelectedPinId] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);


  const handleDelete = async () => {
    setIsSending(true);
    try {
      const response = await axios.delete(`${import.meta.env.VITE_BASE_URL}/user/deletePin`, {
        data: { pinId: selectedPinId },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        
      });
      if (response.status === 200) {
        setNotifications((prev) => [
        ...prev,
        {
          id: Date.now(),
          message: `🗑️ A pin was deleted successfully.`,
          time: new Date().toLocaleTimeString(),
        },
      ]);
        setIsSending(false);
        setShowConfirmModal(false);
        setSelectedPinId(null);
        
      }
    } catch (err) {
      console.error("Failed to delete:", err);
      setIsSending(false);
    }
  }

  const [activeTab, setActiveTab] = useState("created");
  const [isSending, setIsSending] = useState(false);

  const createdPins = userData?.allPins || [];
  const savedPins = userData?.savedPins || [];

  const getColumns = (pins) => {
    let columns = [[], [], [], [], []];
    pins.forEach((pin, index) => {
      const columnIndex = index % 5;
      columns[columnIndex].push(pin);
    });
    return columns;
  };

  const currentPins = activeTab === "created" ? createdPins : savedPins;
  const columns = getColumns(currentPins);

  return (
    <div className="flex-grow overflow-y-auto pt-15 px-2">
      <div className="min-h-[45vh] w-full flex flex-col justify-center items-center gap-3 relative">
        <i
          onClick={() => {
            navigate("/userhome");
          }}
          className="absolute text-2xl text-black z-10 top-5 cursor-pointer left-16 ri-arrow-left-long-line"
        ></i>

        <div className="profileimage">
          <img
            className="w-[7vw] h-[7vw] object-cover rounded-full"
            src={userData?.user?.profilePicture}
            alt=""
          />
        </div>
        <div className="profilename">
          <h1 className="text-2xl">{userData?.user?.username}</h1>
        </div>
        <div className="w-[38%] text-center leading-tight">
          <p>{userData?.user?.bio}</p>
        </div>
        <div className="flex gap-3.5 font-semibold">
          <h1>
            <span>{userData?.user?.following?.length}</span> following
          </h1>
          <h1>
            <span>{userData?.user?.followers?.length}</span> followers
          </h1>
        </div>

        {/* Added buttons here */}
        <div className="flex gap-3 mt-3">
          {userData?.user?.website && (
            <a
              href={userData?.user?.website}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-zinc-300 hover:bg-zinc-400 text-black px-6 py-2 rounded-3xl text-lg cursor-pointer"
              title="Visit Website"
            >
              <i className="ri-link"></i>
            </a>
          )}
          <button
            onClick={() => {
              navigate("/userhome/edit-profile");
            }}
            className="bg-black text-white hover:bg-zinc-800 px-4.5 py-2.5 rounded-3xl text-md font-semibold cursor-pointer"
          >
            Edit Profile
          </button>
        </div>
      </div>

      <div className="w-full text-center mt-3 flex gap-5 justify-center font-semibold">
        <button
          className={`cursor-pointer ${
            activeTab === "created"
              ? "border-b-4 border-b-black"
              : "bg-zinc-200 px-4 py-1 rounded-full "
          }`}
          onClick={() => setActiveTab("created")}
        >
          Created
        </button>
        <button
          className={`cursor-pointer ${
            activeTab === "saved"
              ? "border-b-4 border-b-black"
              : "bg-zinc-200 px-4 py-1 rounded-full "
          }`}
          onClick={() => setActiveTab("saved")}
        >
          Saved
        </button>
      </div>

      <div className="w-full px-1 pt-6 flex gap-4">
        {currentPins.length === 0 ? (
          <div className="w-full text-center text-lg text-gray-500 font-medium">
            No pins yet.
          </div>
        ) : (
          columns.map((column, columnIndex) => (
            <div key={columnIndex} className="h-full flex flex-col gap-2">
             
              {column.map((pin, index) => (
                <div key={index} className="relative group">
  <img
    className="w-[18vw] rounded-3xl object-cover"
    src={pin.image}
    alt={pin.title || `Image ${index + 1}`}
  />
    {activeTab === "created" && (
  <>
    <button
      onClick={() => {
        setSelectedPinId(pin._id);
        setShowConfirmModal(true);
      }}
      className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition"
      title="Delete Pin"
    >
      <i className="ri-delete-bin-line text-xl"></i>
    </button>

    {showConfirmModal && selectedPinId === pin._id && (
      <div className="fixed inset-0 bg-[#0000002d] flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-xl text-center w-[90vw] max-w-md">
          <h2 className="text-xl font-semibold mb-4">Are you sure?</h2>
          <p className="mb-6">Do you want to delete this pin permanently?</p>
          <div className="flex justify-center gap-4">
            <button
              onClick={handleDelete}
              className="bg-red-600 text-white cursor-pointer px-4 py-2 rounded-md"
            >
              {isSending ? "Deleting..." : "Delete"}
            </button>
            <button
              onClick={() => {
                setShowConfirmModal(false);
                setSelectedPinId(null);
              }}
              className="bg-gray-300 cursor-pointer px-4 py-2 rounded-md"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )}
  </>
)}

                  {/* Show Unsave button only if activeTab === "saved" */}
                  {activeTab === "saved" && (
                    <button
                      onClick={async () => {
                        setIsSending(true);
                        try {
                          const response = await unSavePin(pin._id);
                          if (response.status === 200) {
                            setIsSending(false);
                            // Remove this pin from UI after unsaving
                            const updatedPins = savedPins.filter(
                              (p) => p._id !== pin._id
                            );
                            userData.savedPins = updatedPins; // Update directly or use context setter if needed
                            setActiveTab("saved"); // Re-trigger render
                          }
                        } catch (err) {
                          console.error("Failed to unsave:", err);
                            setIsSending(false);
                        }
                      }}
                      className="absolute cursor-pointer top-2 right-2 bg-red-600 text-white text-sm px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                    >
                     {isSending ? (
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      ></path>
                    </svg>
                  ) : (
                    "unsave"
                  )}
                    </button>
                  )}
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default YourProfile;
