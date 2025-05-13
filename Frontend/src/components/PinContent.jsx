import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { pinDataContext } from "../context/PinProvider";
import { userDataContext } from "../context/UserContext";
import { savePin } from "../utils/pinSaverUnsaver";
import { NotificationsContext } from "../context/NotificationsProvider";

const PinContent = () => {
  const { pinData, setPinData } = useContext(pinDataContext);
  const {userData , setUserData} = useContext(userDataContext);

  const { setNotifications } = useContext(NotificationsContext);

  const [ isLoading, setIsLoading ] = useState(false);
  const [alreadySaved , setalreadySaved] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDataPin = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/user/getAllPins`
        );
        if (response.status === 200) {
          setPinData(response.data);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchDataPin();
  }, []);
  

  const getColumns = () => {
    if (!Array.isArray(pinData)) return [[], [], [], [], []];
    let columns = [[], [], [], [], []]; // 5 columns
    pinData.forEach((pin, index) => {
      const columnIndex = index % 5;
      columns[columnIndex].push(pin);
    });
    return columns;
  };

  const columns = getColumns();

  const handleDownload = (url, title = "download") => {
    const link = document.createElement("a");
    link.href = url;
    link.download = title;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

     const fetchData = async () => {

      try {

        const token = localStorage.getItem("token"); 
        if (!token) {
          console.error("No token found");
          return;
        }

        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/user/getProfile`, {
          headers: {
            Authorization: `Bearer ${token}`,  
          },
        });

        setUserData(response.data);


      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const fetchDataPin = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/user/getAllPins`
        );
        if (response.status === 200) {
          setPinData(response.data);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    

  return (
    <div className="flex-grow overflow-y-auto pt-15 px-3 flex gap-4">
      {pinData.length === 0 ? (
        <div className="w-full text-center text-lg text-gray-500 font-medium">
          No pins yet.
        </div>
      ) : (
        columns.map((column, columnIndex) => (
          <div key={columnIndex} className="h-full flex flex-col gap-2">
            {column.map((pin, index) => (
                
              <div key={index} className="relative group">
                {!pin.image ? (
                  <div className="w-[18vw] h-60 bg-gray-300 animate-pulse rounded-3xl"></div>
                ) : (
                  <>
                    <img
                      onClick={() => {
                        navigate("/userhome/pin", { state: { pin } });
                      }}
                      className="w-[18vw] rounded-3xl object-cover cursor-pointer transition duration-300 group-hover:brightness-75"
                      src={pin.image}
                      alt={pin.title || `Image ${index + 1}`}
                    />
                    {/* Save Button */}
                    <button
                      className={`absolute top-2 right-2 ${
                        pin.savedBy?.some((save) => save.userId === userData?.user?._id) || alreadySaved
                          ? "bg-zinc-900 text-white"
                          : "bg-red-600 text-white"
                      } text-sm px-3 py-2 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition`}
                      onClick={ async (e)   => {
                        e.stopPropagation();
                              const isAlreadySaved = pin.savedBy?.some(
                                (save) => save.userId === userData?.user?._id
                              );
                              if (isAlreadySaved) {
                                setalreadySaved(true);
                                return;
                              } else {
                          try {
                            setIsLoading(true);
                            const response = await savePin(pin._id);
                            
                            if (response.status === 200) {
                              setNotifications((prev) => [
                                ...prev,
                                {
                                  id: Date.now(),  // Unique ID for each notification
                                  message: `📌 Pin "${pin.title}" has been saved!`,
                                  time: new Date().toLocaleTimeString(),
                                },
                              ]);
                                setIsLoading(false);
                                setalreadySaved(true);
                                fetchData();
                                fetchDataPin();
                            }
                            
                          } catch (error) {
                            setIsLoading(false);
                          }

                        }
                      }}
                    >
                      
                      {isLoading ? (
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
                  ) : ((pin.savedBy?.some((save) => save.userId === userData?.user?._id) || alreadySaved )&& 
                    "Saved"
                  ) || "save"}
                    </button>
                    {/* Download Button */}
                    <button
                      className="absolute bottom-2 cursor-pointer right-2 bg-white text-black text-sm px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevents navigating when clicking the button
                        handleDownload(
                          pin.image,
                          pin.title || `Image_${index + 1}`
                        );
                      }}
                    >
                      Download
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
};

export default PinContent;
