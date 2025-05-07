import './App.css'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import React from 'react'
import Registration from './pages/Registration/Registration'
import LoginPage from './pages/Login/Login'
import Dashboard from './pages/Dashboard/Dashboard'
import CandidateModal from './components/Dashboard/AddCandidateModal/AddCandidateModal'


function App() {

  return (
  <Router>
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
