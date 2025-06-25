import Company from "../models/Company.js";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import generateToken from "../utils/generateToken.js";
import Job from "../models/Job.js";
import JobApplication from "../models/JobApplication.js";

// Register a new company
export const registerCompany = async (req, res) => {
  try {
    const name = req.body.name;
    const email = req.body.email?.toLowerCase();
    const password = req.body.password;
    const imageFile = req.file;

    if (!name || !email || !password || !imageFile) {
      console.log("❌ Missing Fields:", { name, email, password, imageFile });
      return res.json({ success: false, message: "Missing Details" });
    }

    const companyExists = await Company.findOne({ email });
    if (companyExists) {
      return res.json({
        success: false,
        message: "Company already registered",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    if (!imageFile.path) {
      console.log("❌ req.file.path is missing");
      return res.json({ success: false, message: "Image not uploaded. Try again." });
    }

    const imageUpload = await cloudinary.uploader.upload(imageFile.path);

    const company = await Company.create({
      name,
      email,
      password: hashPassword,
      image: imageUpload.secure_url,
    });

    res.json({
      success: true,
      company: {
        _id: company._id,
        name: company.name,
        email: company.email,
        image: company.image,
      },
      token: generateToken(company._id),
    });
  } catch (error) {
    console.error("❌ Registration Error:", error.message);
    res.json({ success: false, message: error.message });
  }
};


// Login a company
export const loginCompany = async (req, res) => {
  try {
    const email = req.body.email?.toLowerCase();
    const password = req.body.password;

    const company = await Company.findOne({ email });

    if (!company) {
      return res.json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, company.password);
    if (!isMatch) {
      return res.json({
        success: false,
        message: "Invalid email or password",
      });
    }

    res.json({
      success: true,
      company: {
        _id: company._id,
        name: company.name,
        email: company.email,
        image: company.image,
      },
      token: generateToken(company._id),
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get logged-in company data
export const getCompanyData = async (req, res) => {
  try {
    const company = req.company;
    res.json({ success: true, company });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Post a new job
export const postJob = async (req, res) => {
  try {
    const { title, description, location, salary, level, category } = req.body;
    const companyId = req.company._id;

    if (!title || !description || !location || !salary || !level || !category) {
      return res.json({ success: false, message: "Missing job details" });
    }

    const newJob = new Job({
      title,
      description,
      location,
      salary,
      level,
      category,
      companyId,
      date: new Date(),
    });

    await newJob.save();

    res.json({ success: true, newJob });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get applicants for the company's jobs
export const getCompanyJobApplicants = async (req, res) => {
  try {
    const companyId = req.company._id;

    const applications = await JobApplication.find({ companyId })
      .populate("userId", "name image resume")
      .populate("jobId", "title location category level salary")
      .exec();

    res.json({ success: true, applications });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get all jobs posted by the company with applicant counts
export const getCompanyPostedJobs = async (req, res) => {
  try {
    const companyId = req.company._id;

    const jobs = await Job.find({ companyId });

    const jobsData = await Promise.all(
      jobs.map(async (job) => {
        const applicants = await JobApplication.find({ jobId: job._id });
        return {
          ...job.toObject(),
          applicants: applicants.length,
        };
      })
    );

    res.json({ success: true, jobsData });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Change application status (Accepted/Rejected)
export const ChangeJobApplicationStatus = async (req, res) => {
  try {
    const { id, status } = req.body;

    await JobApplication.findOneAndUpdate({ _id: id }, { status });

    res.json({ success: true, message: "Status changed" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Toggle job visibility
export const changeVisibility = async (req, res) => {
  try {
    const { id } = req.body;
    const companyId = req.company._id;

    const job = await Job.findById(id);

    if (!job) {
      return res.json({ success: false, message: "Job not found" });
    }

    if (companyId.toString() !== job.companyId.toString()) {
      return res.json({
        success: false,
        message: "Not authorized to modify this job",
      });
    }

    job.visible = !job.visible;
    await job.save();

    res.json({ success: true, job });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
