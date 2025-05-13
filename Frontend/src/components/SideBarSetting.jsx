import axios from 'axios';
import React from 'react'
import { useNavigate } from 'react-router-dom';

const SideBarSetting = ({setSideSett}) => {

    const navigate = useNavigate();

    const logoutHandler = async () => {
        try{
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/user/logout`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            if (response.status === 200) {
                setSideSett(false)
                localStorage.removeItem("token");
                navigate('/');
            } else {
                console.error("Logout failed");
            }
        }catch(err){
            console.error("Error logging out:", err);
        }
    }

  return (
    <div className="absolute w-[15vw] flex flex-col px-2 justify-center h-[20vh] bg-white rounded-2xl bottom-20 left-20 z-30 shadow-lg p-4 overflow-y-auto space-y-3">
      <button onClick={()=>{
        navigate('/userhome/edit-profile')
        setSideSett(false)
      }} className='font-semibold hover:bg-black hover:text-white py-0.5 rounded-lg cursor-pointer'>Edit Profile</button>
        
      <button onClick={() => {
        logoutHandler();
      }} className='font-semibold hover:bg-black hover:text-white py-0.5 rounded-lg cursor-pointer'>Logout</button>
    </div>
  )
}

export default SideBarSetting
