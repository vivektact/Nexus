import { Route, Navigate, RouterProvider, createBrowserRouter, createRoutesFromElements } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import HomePage from "../pages/HomePage";
import RegisterPage from "../pages/RegisterPage";
import Dashboard from "../pages/Dashboard";
import LoginPage from "../pages/LoginPage";
import ChatPage from "../pages/ChatPage";
import CallPage from "../pages/CallPage";
import NotificationPage from "../pages/NotificationPage";
import WelcomePage from "../pages/WelcomePage";
import LearningPage from "../pages/LearningPage";
import ProtectedRoute from "../components/ProtectedRoute"; 
import useAuthUser from "../hooks/useAuthUser";
import Layout from "../components/Layout";

const App = () => {
  const { authUser } = useAuthUser(); 

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<MainLayout />}>
        <Route 
          path="login" 
          element={authUser ? <Navigate to="/dashboard" replace /> : <LoginPage />} 
        />
        <Route 
          path="register" 
          element={authUser ? <Navigate to="/dashboard" replace /> : <RegisterPage />} 
        />
        <Route path="/verify/:token" element={<WelcomePage />} />

        <Route
          index
          element={
              <HomePage />
          }
        />
        <Route
          path="dashboard"
          element={
            <ProtectedRoute>
              <Layout showSidebar={true}>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="learning"
          element={
            <ProtectedRoute>
              <Layout showSidebar={true}>
                <LearningPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="call/:id"
          element={
            <ProtectedRoute>
              <CallPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="chat/:id"
          element={
            <ProtectedRoute>
              <Layout showSidebar={true}>
                <ChatPage />
              </Layout>
              
            </ProtectedRoute>
          }
        />
        <Route
          path="notifications"
          element={
            <ProtectedRoute>
              <Layout showSidebar={true}>
                <NotificationPage />
              </Layout>
            </ProtectedRoute>
          }
        />
      </Route>
    )
  );

  return <RouterProvider router={router} />;
};

export default App;