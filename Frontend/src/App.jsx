import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import UserHome from "./pages/UserHome";
import UserProtectedWraper from "./wrapper/UserProtectedWraper";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route 
        path="/userhome/*" 
        element={
          <UserProtectedWraper>
            <UserHome />
          </UserProtectedWraper>
        } 
      />
    </Routes>
  );
};

export default App;
