import React  from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Doctors from './pages/Doctors';
import Login from './pages/Login';
import About from './pages/About';
import Contact from './pages/Contact';
import MyProfile from './pages/MyProfile';
import MyAppointments from './pages/MyAppointments';
import Appointment from './pages/Appointment';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { ToastContainer } from 'react-toastify';
import ResetPassword from './pages/ResetPassword';
import PrivPolicy from './pages/PrivPolicy';
import NearbyPharmacy from './components/NearbyPharmacy';


const App = () => {

  return (
   <div className='mx-4 sm:mx-[10%]'>
    <ToastContainer
  autoClose={4000}
  hideProgressBar={false}
  newestOnTop={false}
  closeOnClick
  pauseOnFocusLoss
  draggable
  pauseOnHover
  theme="light"
/>
    <Navbar />
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/doctors' element={<Doctors />} />
      <Route path='/doctors/:speciality' element={<Doctors />} />
      <Route path='/login' element={<Login />} />
      <Route path='/reset-password' element={<ResetPassword/>} />
      <Route path='/about' element={<About />} />
      <Route path='/contact' element={<Contact />} />
      <Route path='/my-profile' element={<MyProfile />} />
      <Route path='/my-appointments' element={<MyAppointments />} />
      <Route path='/appointment/:docId' element={<Appointment />} />
      <Route path='/pri-policy' element={<PrivPolicy lastUpdated="November 4, 2025" />} />
      <Route path="/nearby-pharmacy" element={<NearbyPharmacy />} />
    </Routes>
    <Footer/>
   </div>
  )
}

export default App