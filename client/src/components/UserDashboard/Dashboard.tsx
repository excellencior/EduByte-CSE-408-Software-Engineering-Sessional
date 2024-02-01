import React, { useEffect } from "react";
import { UserContext } from "../UserContext/UserContext";
import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";
import "../../css/dashboard.css"
import UserProfile from "./UserProfile";
import dashboardapi from "../../api/Dashboard";

import MyCourses from "./MyCourses";
import RecommendedCourses from "./RecommendedCourses";
import UserNotification from "./UserNotification";

const Dashboard = () => {
  const { currentUser } = React.useContext(UserContext);
  const navigate = useNavigate();
  // If user is not logged in, redirect to home page
  useEffect(() => {
    if (!currentUser) {
      console.log(
        "User is not logged in. Redirecting to home page..."
      );
      navigate("/signin");
      alert ("Please login first");
    }
  }, []);

  const [coursesData, setCoursesData] = React.useState<any>(null);
  const [recommendedCoursesData, setRecommendedCoursesData] = React.useState<any>(null);

  useEffect(() => {
    const handleMyCourses = async () => {
        try {
          const res = await dashboardapi.get("/courses");
          setCoursesData(res.data.coursesData);
        }
        catch (err) {
          console.log(err);
        }
    }

    handleMyCourses();
    }
  , []);

  return (
    <div className="container">
      <div className="row">
        <UserProfile />
        <Routes>
          <Route path="/mycourses" element={<MyCourses coursesData={coursesData} />} />
          <Route path="/recommendations" element={<RecommendedCourses />} />
          <Route path="/notifications" element={<UserNotification />} />
          <Route path="/savedposts" element={<MyCourses />} />
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;