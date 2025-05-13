import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { userDataContext } from '../context/UserContext';
import { useLocation } from 'react-router-dom';
import { NotificationsContext } from "../context/NotificationsProvider";

const UserProfile = () => {
     const location = useLocation();
     const userId = location.state?.userId;

     const [userProfileData , setUserProfileData] = useState(null);

     const {userData} = useContext(userDataContext)
       const { setNotifications } = useContext(NotificationsContext);
     

      const [isAlreadyFollow , setIsAlreadyFollow] = useState(false);
     const [isLoading , setIsLoading] = useState(false);

     const [activeTab, setActiveTab] = useState("created");

      const allPins = userProfileData?.allPins || [];
      const savedPins = userProfileData?.savedPins || [];
     
     useEffect(() => {
          if (!userId) {
              console.warn("No userId provided.");
              return;
          }
      
          const fetchUserProfileData = async () => {
              try {
                  const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/user/getUserProfile/${userId}`, {
                      headers: {
                          Authorization: `Bearer ${localStorage.getItem("token")}`,
                      },
                  });
                  if (response.status === 200) {
                      setUserProfileData(response.data);
                      console.log("Set user profile data:", response.data);
                  }
              } catch (err) {
                  console.error("Error fetching data:", err);
              }
          };
          fetchUserProfileData();
      }, [userId]);
      
      const getColumns = (pins) => {
          let columns = [[], [], [], [], []]; // 5 columns
          pins.forEach((pin, index) => {
            const columnIndex = index % 5; // This will distribute the images across 5 columns
            columns[columnIndex].push(pin);
          });
          return columns;
        };
      
          const currentPins = activeTab === "created" ? allPins : savedPins;
          const columns = getColumns(currentPins); 
      
          const followerHandler = async () => {
            setIsLoading(true);
            try{
              const response = await axios.patch(`${import.meta.env.VITE_BASE_URL}/user/startFollow`,{
                userId: userProfileData?.user?._id
              }, {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              })
              if(response.status === 200){
                setNotifications((prev) => [
        ...prev,
        {
          id: Date.now(),
          message: `➕ You followed ${userProfileData?.user?.name || "a user"}`,
          time: new Date().toLocaleTimeString(),
        },
      ]);
                 setIsAlreadyFollow(true);
                setIsLoading(false);
                console.log(response.data);
              }
            }catch(err){
              console.error("Error following user:", err);
              setIsLoading(false);
            }
          }

          const unfollowerHandler = async () => {
            try{
              setIsLoading(true);
              const response = await axios.patch(`${import.meta.env.VITE_BASE_URL}/user/unFollow`,{
                userId: userProfileData?.user?._id
              }, {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              })
              if(response.status === 200){
                setNotifications((prev) => [
        ...prev,
        {
          id: Date.now(),
          message: `➖ You unfollowed ${userProfileData?.user?.name || "a user"}`,
          time: new Date().toLocaleTimeString(),
        },
      ]);
                setIsAlreadyFollow(false);
                setIsLoading(false);
                console.log(response.data);
              }
            }catch(err){
              console.error("Error unfollowing user:", err);
              setIsLoading(false);
            }
          }
     
  return (
    <div className='flex-grow overflow-y-auto pt-15 px-2'>
      <div className='min-h-[45vh] w-full flex flex-col justify-center items-center gap-3'>
        <div className='profileimage'>
            <img className='w-[7vw] h-[7vw] object-cover rounded-full' src={userProfileData?.user?.profilePicture} alt="" />
        </div>
        <div className='profilename'>
            <h1 className='text-2xl'>{userProfileData?.user?.username}</h1>
        </div>
        <div className='w-[38%] text-center leading-tight'>
            <p>{userProfileData?.user?.bio}</p>
        </div>
        <div className='flex gap-3.5 font-semibold'>
            <h1><span>{userProfileData?.user?.following.length}</span> following</h1>
            <h1><span>{userProfileData?.user?.followers.length}</span> followers</h1>
        </div>
        <div
         
        className='flex gap-4 items-center my-2'>
            <i class="font-semibold text-2xl ri-share-2-line cursor-pointer"></i>
            <button onClick={()=>{
              const isfollow = userProfileData?.user?.followers?.includes(userData?.user?._id)
              if(isfollow){
                unfollowerHandler();
              }else{
                followerHandler();
              }
            }} className={`cursor-pointer text-white font-semibold py-2 px-3 rounded-[20px] text-[18px] leading-tight ${
    userProfileData?.user?.followers?.includes(userData?.user?._id) || isAlreadyFollow
      ? "bg-zinc-400"
      : "bg-red-600"
  }`}>    
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
                  ) : ((userProfileData?.user?.followers?.includes(userData?.user?._id) || isAlreadyFollow )&& 
                    "Unfollow"
                  ) || "Follow"}
            </button>
            <i class="font-semibold text-2xl ri-more-fill cursor-pointer"></i>
        </div>
      </div>
      <div className='w-full text-center flex gap-5 justify-center font-semibold mt-10'>
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
      <div className=' w-full px-1 pt-6 flex gap-4'>
      {currentPins.length === 0 ? (
    <div className='w-full text-center text-lg text-gray-500 font-medium'>
      No pins yet.
    </div>
  ) : (
    columns.map((column, columnIndex) => (
      <div key={columnIndex} className='h-full flex flex-col gap-2'>
        {column.map((pin, index) => (
          <img
            key={index}
            className='w-[18vw] rounded-3xl object-cover'
            src={pin.image} // Assuming `image` is a base64 string in the object
            alt={pin.title || `Image ${index + 1}`}
          />
        ))}
      </div>
    ))
  )}
      </div>
    </div>
  )
}

export default UserProfile