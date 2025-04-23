import React, { useContext, useState } from 'react'
import { Route,Routes } from 'react-router-dom'
import Applications from './pages/Applications'
import ApplyJobs from './pages/ApplyJobs'
import Home from './pages/Home'
import RecruiterLogin from './components/RecruiterLogin'
import { AppContext } from './context/AppContext'
function App() {
  const{showRecruiterLogin} =useContext(AppContext)


  return (
    <div>
      {showRecruiterLogin && <RecruiterLogin/> }
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/applications' element={<Applications/>}/>
        <Route path='/apply-job/:id' element={<ApplyJobs/>}/>
      </Routes>
    </div>
  )
}

export default App