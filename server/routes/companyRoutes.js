import express from 'express'
import {registerCompany , loginCompany, getCompanyData, postJob, getCompanyJobApplicants, getCompanyPostedJobs, ChangeJobApplicationStatus, changeVisibility} from '../controllers/companyController.js'
import upload from '../config/multer.js'
const router=express.Router()

// Register a company
router.post('/register',upload.single('image'),registerCompany)

//Company login
router.post('/login',loginCompany)

//get company data
router.get('/company',getCompanyData)

//post a job 
router.post('/post-job',postJob)

//get applicatints data of the company
router.get('/applicants',getCompanyJobApplicants)

//get company posted jobs
router.get('/list-jobs',getCompanyPostedJobs)

//change application ststus
router.post('/change-status',ChangeJobApplicationStatus)

//change application visibility
router.post('/change-visibility',changeVisibility);

export default router;