import axios from "axios";
import React, { useState } from "react";
import { useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { userDataContext } from "../context/UserContext";
import { savePin, unSavePin } from "../utils/pinSaverUnsaver";
import { NotificationsContext } from "../context/NotificationsProvider";

const Pin = () => {

  const { userData , setUserData } = useContext(userDataContext);
  const {setNotifications} = useContext(NotificationsContext)

  const navigate = useNavigate();
  const location = useLocation();
  const pin = location.state?.pin;
  const isPinOwner = pin?.userId === userData?.user?._id;

  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState(pin?.comments || []);
  const [isSending, setIsSending] = useState(false);

  const [isSaved, setIsSaved] = useState(() =>
    pin?.savedBy?.some((obj) => obj.userId === userData?.user?._id)
  );

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

  const handleSavePin = async () => {
  try {
    setIsSending(true);
    const response = await savePin(pin._id);
    if (response.status === 200) {
       setNotifications((prev) => [
    ...prev,
    {
      id: Date.now(),
      message: `📌 Pin "${pin.title}" has been saved!`,
      time: new Date().toLocaleTimeString(),
    },
  ]);
      toast.success("Pin saved successfully");
      setIsSaved(true); // 
      fetchData();
    }
  } catch (err) {
    console.error(err);
    toast.error("Failed to save pin");
  } finally {
    setIsSending(false);
  }
};

const handleUnsavePin = async () => {
  try {
    setIsSending(true); 
    const response = await unSavePin(pin._id);
    if (response.status === 200) {
      setNotifications((prev) => [
    ...prev,
    {
      id: Date.now(),
      message: `❌ Pin "${pin.title}" has been unsaved!`,
      time: new Date().toLocaleTimeString(),
    },
  ]);
      toast.success("Pin unsaved successfully");
      setIsSaved(false); // 
      fetchData();
    }
  } catch (err) {
    console.error(err);
    toast.error("Failed to unsave pin");
  } finally {
   setIsSending(false);
  }
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    try {
      setIsSending(true); // Start loading
      const token = localStorage.getItem("token");
      const response = await axios.patch(
        `${import.meta.env.VITE_BASE_URL}/user/comment`,
        {
          comment: commentText,
          pinId: pin._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);

      if (response.status === 200) {
        setNotifications((prev) => [
    ...prev,
    {
      id: Date.now(),
      message: `💬 You commented: "${commentText}" on pin "${pin.title}"`,
      time: new Date().toLocaleTimeString(),
    },
  ]);
        toast.success("Comment Sent successfully");

        // Optimistically add the new comment:
        const newComment = response.data.newComment || {
          comment: commentText,
          name: response.data.userName || "You", // fallback if API doesn't send
        };
        setComments((prev) => [...prev, newComment]);

        setCommentText("");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to send comment");
    } finally {
      setIsSending(false); // Stop loading
    }
  };

  const handleProfileClick = () => {
    navigate(`/userhome/userprofile/`, { state: { userId: pin.userId } });
  };

  const handleDeleteComment = async (commentId) => {
  try {
    setIsSending(true);
    const token = localStorage.getItem("token");
    const response = await axios.delete(
      `${import.meta.env.VITE_BASE_URL}/user/delete_comment`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          pinId: pin._id,
          commentId: commentId,
        },
      }
    );

    if (response.status === 200) {
      setNotifications((prev) => [
    ...prev,
    {
      id: Date.now(),
      message: `🗑️ You deleted a comment on pin "${pin.title}"`,
      time: new Date().toLocaleTimeString(),
    },
  ]);
      toast.success("Comment deleted");
      setComments((prev) => prev.filter((c) => c._id !== commentId));
    }
  } catch (err) {
    console.error(err);
    toast.error("Failed to delete comment");
  } finally {
    setIsSending(false);
  }
};

const handleOwnerCommentDelete = async (commentId) => {
  try {
    const confirmDelete = window.confirm("Are you sure you want to delete this comment?");
    if (!confirmDelete) return;

    setIsSending(true);
    const token = localStorage.getItem("token");

    const response = await axios.delete(
      `${import.meta.env.VITE_BASE_URL}/user/delete_comment_owner`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          pinId: pin._id,
          commentId: commentId,
        },
      }
    );

    if (response.status === 200) {
      setNotifications((prev) => [
    ...prev,
    {
      id: Date.now(),
      message: `🗑️ You deleted a comment on pin "${pin.title}"`,
      time: new Date().toLocaleTimeString(),
    },
  ]);
      toast.success("Comment deleted");
      // Remove the deleted comment from local state
      setComments((prev) => prev.filter((c) => c._id !== commentId));
    }
  } catch (err) {
    console.error(err);
    toast.error("Failed to delete comment");
  } finally {
    setIsSending(false);
  }
};




  return (
    <div className="flex-grow pt-15 px-3 flex justify-center items-center">
      <div className="w-[84vw] h-[76vh] flex justify-center">
        <div className="rounded-3xl w-[69%] h-full flex overflow-hidden border-1 border-gray-300">
          <div className="w-[44vw] h-full bg-black">
            {pin ? (
              <img
                src={pin.image}
                alt={pin.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-white flex justify-center items-center h-full">
                No image data
              </div>
            )}
          </div>
          <div className="w-[55vw] bg-white">
            <div className="w-full flex justify-between px-5 pt-4">
              <div className="flex gap-6">
                <i className="text-2xl ri-share-2-line"></i>
                <i className="text-2xl ri-more-fill"></i>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleProfileClick}
                  className="border-1 border-gray-300 text-black cursor-pointer font-semibold py-2 px-3 rounded-[20px] text-[16px] leading-tight"
                >
                  Profile
                </button>
               <button
  onClick={isSaved ? handleUnsavePin : handleSavePin}
  className={`${
    isSaved ? "bg-gray-300 text-zinc-800" : "bg-red-600 text-white"
  } cursor-pointer font-semibold py-2 px-3 rounded-[20px] text-[16px] leading-tight flex items-center justify-center`}
  disabled={isSending}
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
                  ) : isSaved ? (
                    "Unsave"
                  ) : (
                    "Save"
                  )}
                </button>
              </div>
            </div>
            <div className="comment-section h-[89%] w-full p-2">
              <div className="flex justify-between items-center px-4">
                <div className="px-1 py-2">
                  {pin && (
                    <>
                      <h2 className="text-sm font-bold">{pin.title}</h2>
                      <p className="text-gray-600 text-xs">
                        {pin.description.split(" ").slice(0, 15).join(" ")}
                        {pin.description.split(" ").length > 15 && "..."}
                      </p>
                    </>
                  )}
                </div>
                <div className="font-semibold text-sm flex gap-0.5 justify-center">
                  <span>{comments.length} </span> Comments
                </div>
                <i className="text-xl cursor-pointer font-semibold ri-arrow-down-wide-line"></i>
              </div>

<div className="comment-box h-[75%] overflow-y-auto flex flex-col gap-3 px-3 pt-2 py-1">
  {comments.length > 0 ? (
    comments.map((comment, index) => {
      const isOwner = isPinOwner;
      const isSelf = comment.userId === userData?.user?._id;

      return (
        <div
          key={index}
          className="message w-[94%] flex gap-1 items-start justify-between px-2 py-1 rounded-md hover:bg-gray-100 group transition-all"
        >
          <div className="flex gap-1">
            <div className="w-7 h-7 rounded-full bg-gray-400 text-white flex items-center justify-center font-semibold uppercase">
              {comment.name?.charAt(0)}
            </div>
            <div>
              <h1 className="font-semibold text-sm">{comment.name}</h1>
              <p className="text-xs">{comment.comment}</p>
            </div>
          </div>

          {/* Delete Button Logic */}
          {isOwner ? (
            <button
              onClick={() => handleOwnerCommentDelete(comment._id)}
              className="hidden group-hover:inline cursor-pointer text-red-500 text-sm font-bold"
              title="Delete Comment"
            >
              Delete
            </button>
          ) : isSelf ? (
            <button
              onClick={() => handleDeleteComment(comment._id)}
              className="hidden group-hover:inline cursor-pointer text-red-500 text-sm font-bold"
              title="Delete Comment"
            >
              Delete
            </button>
          ) : null}
        </div>
      );
    })
  ) : (
    <div className="text-center text-gray-500">No comments yet</div>
  )}
</div>


              <form
                onSubmit={handleSubmit}
                className="w-full flex comment-input bg-gray-300 rounded-4xl overflow-hidden mb-3"
              >
                <input
                  className="w-[90%] outline-none px-2 py-2"
                  type="text"
                  placeholder="Add a comment"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  disabled={isSending}
                />
                <button
                  type="submit"
                  className="bg-red-600 hover:bg-red-700 text-white cursor-pointer font-semibold rounded-4xl px-5 py-1 flex items-center justify-center"
                  disabled={isSending}
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
                    "Send"
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pin;


