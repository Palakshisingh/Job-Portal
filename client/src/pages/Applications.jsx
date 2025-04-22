import React, { useState } from 'react'
import Navbar from '../components/Navbar'

const Applications = () => {
  const [isEdit, setIsEdit] = useState(false)
  const [resumeFile, setResumeFile] = useState(null)
  const [tempFile, setTempFile] = useState(null)

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setTempFile(file)
    }
  }

  const handleSave = () => {
    setResumeFile(tempFile)
    setIsEdit(false)
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
          {
            isEdit ? (
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
                {resumeFile ? (
                  <a
                    href={URL.createObjectURL(resumeFile)}
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
                  {resumeFile ? 'Edit' : 'Upload'}
                </button>
              </div>
            )
          }
        </div>
         <h2>Jobs Applied</h2>
         <table></table>
      </div>
    </>
  )
}

export default Applications
