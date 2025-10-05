
import { Outlet } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import  Navbar  from '../components/Navbar'

const MainLayout = () => {
  return (
    <>
    <Navbar/>
    <Outlet/>
    <Toaster position="top-center" />
    </>
  )
}

export default MainLayout



