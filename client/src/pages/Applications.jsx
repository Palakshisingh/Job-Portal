import React, { useContext, useState } from 'react'
import Navbar from '../components/Navbar'
import { jobsApplied } from '../assets/assets'
import moment from 'moment'
import Footer from '../components/Footer'
import { AppContext } from '../context/AppContext'
import { useAuth, useUser } from '@clerk/clerk-react'
import axios from 'axios'
import { toast } from 'react-toastify'

const Applications = () => {
  const { user } = useUser()
  const { getToken } = useAuth()
  const [isEdit, setIsEdit] = useState(false)
  const [resumeFile, setResumeFile] = useState(null)
  const [tempFile, setTempFile] = useState(null)
  const { backendUrl, userData, fetchUserData } = useContext(AppContext)

  const updateResume = async () => {
    if (!resumeFile) {
      toast.error('Please select a file first')
      return
    }
    try {
      const formData = new FormData()
      formData.append('resume', resumeFile)
      const token = await getToken()

      const { data } = await axios.post(
        backendUrl + '/api/users/update-resume',  // <-- fixed URL here
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      )

      if (data.success) {
        toast.success(data.message)
        await fetchUserData() // refresh userData in context
        setIsEdit(false)      // reset UI state only after successful upload
        setResumeFile(null)
        setTempFile(null)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message || 'Upload failed')
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setTempFile(file)
    }
  }

  const handleSave = async () => {
    setResumeFile(tempFile)
    await updateResume()
  }

  const handleCancel = () => {
    setTempFile(null)
    setIsEdit(false)
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-4">Your Resume</h2>
        <div className="bg-white shadow p-6 rounded-lg">
          {(isEdit || (userData && !userData.resume)) ? (
            <div className="space-y-4">
              <label className="block">
                <span className="text-gray-700">Upload Resume (PDF/DOC)</span>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="mt-1 block w-full"
                />
              </label>
              <div className="space-x-2">
                <button
                  onClick={handleSave}
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                  disabled={!tempFile}
                >
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="bg-gray-300 px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="flex justify-between items-center">
              {userData?.resume ? (
                <a
                  href={userData.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  View Resume
                </a>
              ) : (
                <p className="text-gray-500">No resume uploaded.</p>
              )}
              <button
                onClick={() => setIsEdit(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                {userData?.resume ? 'Edit' : 'Upload'}
              </button>
            </div>
          )}
        </div>

        {/* jobsApplied table code remains unchanged */}
      </div>
      <Footer />
    </>
  )
}

export default Applications
