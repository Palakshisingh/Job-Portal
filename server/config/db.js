import mongoose from "mongoose";

//Function to connect with mongodb database
const connectDB=async()=>{
    
    try {
        
        await mongoose.connect(`${process.env.MONGODB_URI}/job-portal`)
        console.log('mongodb connected');

    } catch (error) {
        console.log('mongodb connection error',error);
    }
    

}

export default connectDB