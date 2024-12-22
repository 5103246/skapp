//import logo from './logo.svg';
//import './App.css';
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import CourseList from "./components/CourseList";
import ReviewForm from "./components/ReviewForm";
import RegisterForm from "./components/RegisterForm";
import LoginView from "./components/LoginView";
import ProtectedPage from "./components/UserPage";
import HomePage from "./components/HomePage";
import CourseCategory from "./components/CourseCategory";
import CoursePage from "./components/CoursePage";
import { useAuth } from "./auth/AuthContext";
import { AuthProvider } from "./auth/AuthContext";
import './index.css';

const App = () => {
  const { isAuthenticated } = useAuth();

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/home" element={<HomePage />} />
          <Route path="/course/department/:department_name" element={<CourseList />} />
          <Route path="/course/:course_id" element={<CoursePage />} />
          <Route path="/course" element={<CourseCategory />} />
          <Route path="/review" element={<ReviewForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/login" element={<LoginView />} />
          <Route path="/userpage" element={isAuthenticated ? <ProtectedPage /> : <Navigate to="/login" /> } />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );

}


export default App;
