import React from 'react'
import { Route,Routes } from 'react-router-dom'
import Applications from './pages/Applications'
import ApplyJobs from './pages/ApplyJobs'
import Home from './pages/Home'
function App() {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/applications' element={<Applications/>}/>
        <Route path='/apply-job/:id' element={<ApplyJobs/>}/>
      </Routes>
    </div>
  )
}

export default App