import React, { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { Login } from "./components";
import { Home } from "./container";
import { fetchUserFromLocalStorage } from "./utils/fetchUserFromLocalStorage";

const App = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = fetchUserFromLocalStorage();

    if (!userInfo) navigate("/login");
  }, []);

  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route path="/*" element={<Home />} />
    </Routes>
  );
};

export default App;
