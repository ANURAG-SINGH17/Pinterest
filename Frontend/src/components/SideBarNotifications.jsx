import React, { useContext } from 'react';
import { NotificationsContext } from '../context/NotificationsProvider';

const SideBarNotifications = () => {
  const { notifications } = useContext(NotificationsContext);

  return (
    <div className="absolute w-[20vw] h-[70vh] bg-white rounded-2xl top-40 left-20 z-30 shadow-lg p-4 overflow-y-auto space-y-3">
      {notifications.length === 0 ? (
        <div className="text-sm text-gray-500">No notifications yet.</div>
      ) : (
        notifications
          .slice() // Copy the array
          .reverse() // Show latest on top
          .map((notif) => (
            <div key={notif.id} className="text-sm leading-snug">
              <p>{notif.message}</p>
              <span className="text-xs text-gray-400">{notif.time}</span>
            </div>
          ))
      )}
    </div>
  );
};

export default SideBarNotifications;
