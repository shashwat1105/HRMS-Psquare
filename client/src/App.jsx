import './App.css'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import React, { useEffect } from 'react'
import Registration from './pages/Registration/Registration'
import LoginPage from './pages/Login/Login'
import Dashboard from './pages/Dashboard/Dashboard'
import CandidateModal from './components/Dashboard/AddCandidateModal/AddCandidateModal'
import { triggerLogout } from './store/slices/authSlice'
import { jwtDecode } from 'jwt-decode'
import { useDispatch, useSelector } from 'react-redux'
import { startAutoLogout } from './utils/autoLogout'
import { Toaster } from 'react-hot-toast'


function App() {
  const dispatch = useDispatch();
  const { tokenExpiry } = useSelector((state) => state.auth);

  useEffect(() => {
    if (tokenExpiry) {
      startAutoLogout(dispatch, tokenExpiry);
    }
  }, [tokenExpiry, dispatch]);

  // On reload: check if token exists in localStorage and still valid
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    if (token && user) {
      const decoded = jwtDecode(token);
      const expiry = decoded.exp * 1000;

      if (Date.now() < expiry) {
        dispatch({
          type: 'auth/login/fulfilled',
          payload: { user, token },
        });
      } else {
        dispatch(triggerLogout());
      }
    }
  }, [dispatch]);
  return (
  <Router>
 <Toaster position="top-center" reverseOrder={false} />
<Routes>
  <Route path="/" element={<Registration/>} />
  <Route path="/login" element={<LoginPage/>} />
  <Route path="/dashboard" element={<Dashboard/>} />
  <Route path="/can" element={<CandidateModal/>} />
</Routes>

  </Router>
  )
}

export default App
