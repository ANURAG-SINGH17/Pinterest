import React, { useContext, useEffect, useState } from 'react';
import PinContent from '../components/PinContent';
import YourProfile from '../components/YourProfile';
import { useLocation, useNavigate } from 'react-router-dom';
import Pin from '../components/Pin';
import UserProfile from '../components/UserProfile';
import { userDataContext } from '../context/UserContext';
import axios from 'axios';
import CreatePin from '../components/CreatePin';
import EditProfile from '../components/EditProfile';
import SideBarNotifications from '../components/SideBarNotifications';
import SideBarSetting from '../components/SideBarSetting';

const userhome = () => {

  const {userData , setUserData} = useContext(userDataContext);

  const [show, setShow] = useState(false);

  const [sideContent, setSideContent] = useState(false);
  const [sideSett, setSideSett] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const [showProfile , setShowProfile] = useState(false);
  const [selectPost , setSelectPost] = useState(null);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);  

  useEffect(() => {
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

    fetchData();
  }, [])

  useEffect(() => {
    if (location.pathname === "/userhome/profile") {
      setShowProfile(true);
      setSelectPost(false);
      setShowUserProfile(false);
      setShowEditProfile(false);
    } else if (location.pathname === "/userhome/pin") {
      setSelectPost(true);
      setShowProfile(false);
      setShowUserProfile(false);
      setShowEditProfile(false);
    } else if (location.pathname === "/userhome/userprofile/") {
      setShowUserProfile(true);
      setShowProfile(false);
      setSelectPost(false);
      setShowEditProfile(false);
    } else if (location.pathname === "/userhome/edit-profile") {
      setShowEditProfile(true);  
      setShowUserProfile(false);
      setShowProfile(false);
      setSelectPost(false);
    } else {
      setShowProfile(false);
      setSelectPost(false);
      setShowUserProfile(false);
      setShowEditProfile(false);
    }
  }, [location.pathname]);

  const handleProfileClick = () => {
    navigate('/userhome/profile')
    setSelectPost(false)
  }

  return (
    <div className='w-screen h-screen flex'>

      {
        sideSett &&(
          <SideBarSetting setSideSett={setSideSett}/>
        )||
        sideContent &&(
          <SideBarNotifications/>
        )
      }
      
      {/* Sidebar */}
      <div className='border-r border-gray-300 w-16 flex flex-col justify-between items-center py-10'>
        <div className='flex flex-col items-center gap-10'>
          <img className='w-5 h-5 object-cover' 
               src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJkAAACUCAMAAAC3HHtWAAAAhFBMVEX///+9CBy6AAC3AAC9ABm8ABa8ABK7AAe7AAu7AA7//P378fL57O345+n03d/++frpvsDgpKfw0NPjqq7Uen7KV1vx1dfntrruy83AGijDOTzXg4ffn6Pemp+/LS++ICPZkJHQam/EQUPJT1TScnbDLDbMYWbGREvZio/FOkPMaGfQdnXpGGR4AAAKmElEQVR4nO1c13ajMBQMkhBgqo0B94bjkv3//1scxwaVEeCy+5J527NYGa5u1xUfH7/4xS+eQxzmSZEOF8vlcjEsiiQP4/9N6SP28+H+OFutueuQKxzXXq9mx3Ea+f+NX1RsMkIp4TZjVhOM2ZwQSrJNEv17WuGyXLnEFSmJYNX/r7JF8C9pRcMjJZ6J1Z2dR2g5/FeSm2xXxOvA6gaPzLaj99MKiil1ukirCduhn8V7d3WQ7gjvSesmuF36Pl5+yon9EK9vwVGr8N9DLCmf4HUBJ9nkDbyiQy+118Ml+/DVxIopeZrXBWRVvJRXkD25kTU4ObzQSovVawR2BflMXsQr3jzoKRA8dzl4BbEgoy/lVYHRwwv8R1S+cidvINnTsXRE3TcQsyyH5M8RS9avVbEa3vSpKF/QVzkLFTZ9wkQLY2b4NDX2MLWCvpPYE1Kb8PcSq6hZD+la7r1L+Wtw6wHnEa76uIuqXLJtzj2Pc1supUxwZr2DqJ85XUl5VZVZlZi73bHMyvK4q8rPquzsKHCndzQYd/L8jBPqleNhOorqP+BHebrYn4m55ruBzPsRS7sQ8wifjSehrwvPsR+lmd2BHCO9ErbcavWwjJBs0RJhgvSLkDZu9rpPnDq2KZlNyH7UQUPiaO+0cSNld2Kntr0k01PnfD44tSXqZNl1rajFxbp03MsNRRk1Wiqzur6m2ZMxcuidwIxmRrE5527LmO3SI8sH+mLB3Ji1kE4BNFoZ15g9mIwWU0O5ys9d9nNuEhndPlySRWvDwmTTvkBoqEdYX4ctrmwIeIy2uyBTWDKYt59PkgqTPMAFm5/htcmpjVi+hh6DAWJ+tDicV2uLV7DXq3O2zLUB61IgQqmxVZv+7nu+VpxsppTcu8iMMe4Sas0T7e4EO0itTVF8rGVkqz4+GJaeruNhE35Odc4l4sjnMmqu23Fcco7KX/LTKXbunEwLDbcEZh/UGKP8I3wlNSOIMnO/g5ODxkud0K7w0mSeBRQZlbOoeNFevRNd7nVEPzMGgi1iRg7Sk4Nxa+JVwXbVLZrY4Idkj4lB/Wdryab9c7c+DKOqyUFdNnjbBfzNRiLWuUHE1LjjuyAwU9yXz4BGc0u0stic1EjUlL+HBOBliFi+QhqwEIkZ3LEKNc8PZ3qh4TiAEjN7Jlr/sl+vz/2U/9AGLADLqD/oB6IWR0ojpopJJkOVRF4FKWBpKELFn0DNqCAyPxMdEnMca71eu7gvbyu7BCI7P+vT5Qi8iStWXUNRsi7Zp3kQBMkGt+YVWSCPTvWpbYpkPBQe8wTZkOPoFolD6KcZkWQRAVsDDTWwsBQxl03+UpILs04qa9qXviggYy0zEM151nTNftl8StomfweqEO8gCQ1YJ9eW6yGQsPjXk+aSSsqWABtiluTTRnrNkf3TFROQZ4t739wwvpLXiXfIvCVPNdAz0+RaH9jPCnE2bq7oqI4RaZqSR1j6V9D6WhDNGBEE22DGz2p+XAD75lPpQeDRJD9wBaiARW/WfEiXGkxQHiVn+UC4uipoAMK0uA9ZbXyMaMr1HDKTwgDYITJW9yEugYtpZqX+rnazzlYTSoDNVcwk1QZRwJXdy+WPgqgp6GTTdytx+oIEMpO8O2DmqRXahz/VR2Shbmh6Fq6LJDArlvPHBLjaTzXj9kEiIzKrqwu21p3MwNApmwtgZk9VZgGYjRKYNXy8NgEdlKgC7Sgz21KZhWAOSWRWW4m901Q6KIdQgwDQM8Y0zED9iGRm73S9AVi0U2nuBjHjPWTWfNmJdX/InmlkhhJ81WugiGNr9Ay0QoR40aiudGlBnMGGguxpQQxgGj3zQVEvJHP+8e5adGmBoZNKpb0/6OOmzjaRPxPjZh2dmKVObKF4LucFFYBft3X+DDzLaPOpRkRXa++PEm6mKyerKCc5q8ziI8iUaTNwN3IJtWERQJ+hVE+o4nQz1eLjLWihCrIZ1FWwV8qLFLihJodNFF91uQY8oXCFZL9hU0pxiM84lDoAdaq0VTryRfauySCp5SInGz4qAir1OYq53ABUdfoEBh6ECVEgrq2Tz8QFYNao1pGoG6SvAxLYPxWy2rqS50dxAUOLSI6aE/CozhUZo7FgyefbG8g5+wxuptLrR2rGlDrxgniHmjniqc49f5GCdIjPhZSKGXWd7J2GWOXf0XZKIfK2a0R0ioYDW3kKDlcLmnOaD1OiIFkM+xaunLLj4xdPdp/QvVBduWl4E7mAu+6FFAP8DJ75ykcQ0DKVjOS2Nh5IEa3+mmNKBh7CQ27l/B7uuz3V9xwHIDORaVz9lpwFhRZ4L+ZJpcxghqQLT1FgSSa2fa4WIGfb4RS17OWGAKxJdenLFRP02pcf1Vq8/7ZhRzKjAHgC51PaoRgqpL5Q/P4NrMku1LY/3jK85rWyGcV7rS5wpfjD3kXfcfyGcejspgSj62yOYkZD3Y+5J1fy8RS+vmE0AvXdf35YfpO5Bk6byWYUa6ITXystBsPbU8MsCIoaP9RmFwu9Ngicg5LiJcrZCnGUAG0YOPVM00Eto3o2nSU/lqVrDqbiMQon6kBMuMIzOMbhPZxv3N6L/HB3dZ2ggty52R5da074YUemssxP48RG1/NBfXv8I5jPfq4kzrJEk9Hj0Nw6sGHISwVwdEgaJcvTaZPqLyGmprN3EDPvKLuN0baP8WhgHFBXZghkgL6W8oIPzIIXa9Ngm9d2SQvHDpGZYHWDLhdeCsdEzP1qXQN29Jvg4gF0vmknNjfPd8hdLB1aZ2ktxY4KuW+nIPwyEyNw7KCBvMO1AMkp7okahZoYFMSsvsqkih7tw+RyWTjl3DI48KhEsyP3N+1m6n7r0DYvBQO4NPQY3epfOx5tW0eb+LrjICw6UL/DFX3PtaFHVidN57Y4sHY/pAxqIQza9lM6Ft9eZWITmiX1PYE4zNOM0g5XsHtMnIYtdyJFEw/qVNghq2x8WlSYjw8zTjoFFNvtMaNbGG1cGnIYNX2z7f18ZsDx0JyZslqveGLcT1dsAnW6f4HRc3o4Nvlbaa7WUKZ2IVb2vMsZrXDiLYm/y1ghhNc64asggUYlndJ1Tem0sO0H7oHDNE8ceuk7jSag58WdG1Bq7P0RHvt64upp9xsoIsBQrmhMuOXUDnmwszPAPKNY0E0eF5n2WKIj5jqpiZm2qRwygz5SS9wwGGuoiWkiOOLrQOyZ+xkVhuq9V9rsJXVKzjWwYa+sMxZKdBfiea/R2hpcO5rUE6O1FH2aJWtru0EP0uuWH0R+FOXSZKZtmrWCPn+D/wdj4cpwgxk64jaCu0/qfhNJ8zphwwKGD+g/mb7qIxbfCLf1zY7anxlONKHAyPbV30sp7pP3NbP+WnZtW74YwZxcx2DulU587icy5pD5e75nFI2/S+17grDsp2XE6XchtQ8Gk4w694nowHidUpEXzSYv+UYKwuiPTX/yM+N1SokXsf+8/6NZo9O1bxN1+szYhZZHyekffMzr49bI63Z9h7lkmumusb0PyeU7dmapXb49QLL0JSGyD4Jiv8OfXuBVqb7a7d/81TOIOC+W209a4dItuNws/f5G4eXfn9tlkf/fjyfGfpAnw/n2kB0vyA7b+TDJg/j/f9LxF7/4xVvwF3qbm3i5CUruAAAAAElFTkSuQmCC" 
               alt="logo" />
          <i onClick={()=>{
            navigate('/userhome')
          }} 
          className="text-black text-2xl cursor-pointer ri-home-2-fill"></i>
          <i onClick={()=>{
            setShow(true)
          }} className="text-black text-2xl cursor-pointer ri-add-box-line"></i>
          <i onClick={()=>{
            setSideContent(!sideContent)
            setSideSett(false)
          }}
           className="text-black text-2xl cursor-pointer ri-notification-3-fill"></i>
        </div>
        <div>
          <i
          onClick={()=>{
            setSideSett(!sideSett)
            setSideContent(false)
          }}
           className="text-black text-2xl cursor-pointer ri-settings-5-fill"></i>
        </div>
      </div>

      {/* Main Content */}
      <div className='flex-grow flex flex-col h-screen relative'>
        
        {/* Header Bar */}
        <div className='w-[94.1vw] h-14 bg-none backdrop-blur-2xl fixed flex justify-end px-4 pt-2 z-[10]'>
          <div>
            <img onClick={handleProfileClick} className='w-[3vw] h-[3vw] object-cover rounded-full cursor-pointer' src={userData?.user?.profilePicture} alt="" />
          </div>
        </div>
        <CreatePin setShow={setShow} show={show} />
        {showProfile && <YourProfile />}
        {selectPost && <Pin />}
        {showUserProfile && <UserProfile />}
        {showEditProfile && <EditProfile/>}  
        {/* Default content */}
        {!showProfile && !selectPost && !showUserProfile && !showEditProfile && <PinContent />}
      </div>
    </div>
  );
};

export default userhome;
