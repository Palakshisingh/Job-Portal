import 'dotenv/config'
import './config/instrument.js'
import express from 'express'
import cors from 'cors'

import connectDB from './config/db.js';
import * as Sentry from "@sentry/node";
import { clerkWebhooks } from './controllers/webhooks.js';
import companyRoutes from './routes/companyRoutes.js'
import connectCloudinary from './config/cloudinary.js';
import jobRoutes from './routes/jobRoutes.js'
import userRoutes from './routes/userRoutes.js'
import {clerkMiddleware} from '@clerk/express'
//initialize express
const app=express();


//connect to databse
await connectDB();
await connectCloudinary()

//Middlewares
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(clerkMiddleware());

//Routes
app.get('/',(req,res)=>{
    res.send("API WORKING");
})
app.get("/debug-sentry", function mainHandler(req, res) {
    throw new Error("My first Sentry error!");
  });
  
app.post('/webhooks',clerkWebhooks)
app.use('/api/company',companyRoutes);
app.use('/api/jobs',jobRoutes); // it is public we dont need any token\\
app.use('/api/users',userRoutes)

//port
const PORT = process.env.PORT || 5050;
Sentry.setupExpressErrorHandler(app);

app.listen(PORT,()=>{
    console.log(`server is running on ${PORT}`)
})