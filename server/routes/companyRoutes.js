import express from 'express'
import {registerCompany , loginCompany, getCompanyData, postJob, getCompanyJobApplicants, getCompanyPostedJobs, ChangeJobApplicationStatus, changeVisibility} from '../controllers/companyController.js'
import upload from '../config/multer.js'
import { protectCompany } from '../middleware/authMiddleware.js'
const router=express.Router()

// Register a company
router.post('/register',upload.single('image'),registerCompany)

//Company login
router.post('/login',loginCompany)

//get company data
router.get('/company',protectCompany,getCompanyData)

//post a job 
router.post('/post-job',protectCompany,postJob)

//get applicatints data of the company
router.get('/applicants',protectCompany,getCompanyJobApplicants)

//get company posted jobs
router.get('/list-jobs',protectCompany,getCompanyPostedJobs)

//change application ststus
router.post('/change-status',protectCompany,ChangeJobApplicationStatus)

//change application visibility
router.post('/change-visibility',protectCompany,changeVisibility);

export default router;