import {Navigate, Route, Routes} from "react-router-dom";
import  LoginPage  from "./pages/login/LoginPage";
import SignupPage from "./pages/signup/SignupPage";
import HomePage from "./pages/home/HomePage";
import Sidebar from "./components/common/Sidebar";
import RightPanel from "./components/common/RightPanel";
import NotificationPage from "./pages/notification/NotificationPage";
import ProfilePage from "./pages/profile/ProfilePage";
import LoadingSpinner from "./components/common/LoadingSpinner";

import Toast, { Toaster } from "react-hot-toast";

import { useQuery } from "@tanstack/react-query";

function App() {
  const {data:authuser, isLoading} = useQuery({

    queryKey: ["authUser"],
    queryFn: async () => {
     try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      if(data.error){
        return null;
      }
      if (!res.ok) throw new Error(data.error || "Failed to fetch user");
      console.log("authuser is here", data);
      return data;
      
     } catch (error) {
      console.error(error);
      throw error;
     }
    },
    retry: false,
  });

  if (isLoading) return (
    <div className="h-screen flex items-center justify-center">
      <LoadingSpinner size = 'lg'/>
    </div>
  )

  console.log(authuser);
  return (
    <>
      <div className="flex max-w6xl mx-auto">
        {authuser && <Sidebar/>}
        <Routes>
          <Route path="/" element={authuser ? <HomePage />: <Navigate to="/login"/>} />
          <Route path="/login" element={!authuser ? <LoginPage /> :<Navigate to="/"/>} />
          <Route path="/signup" element={!authuser ?<SignupPage/> :<Navigate to="/"/>} />
          <Route path="/notifications" element={authuser ? <NotificationPage/> : <Navigate to="/login"/>} />
          <Route path="/profile/:username" element={authuser ? <ProfilePage/>: <Navigate to="/login"/>} />
         
        </Routes>
     {authuser && <RightPanel/>}
        <Toaster/>
        
      </div>
    </>
  );
}

export default App;
