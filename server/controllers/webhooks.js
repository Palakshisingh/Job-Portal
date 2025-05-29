import { Webhook } from 'svix';
import User from "../models/User.js";

// API controller to manage Clerk user with database
export const clerkWebhooks = async (req, res) => {
    console.log("🔥 Webhook handler called");  // Log when webhook is called
    
    try {
        // Create a Svix instance with Clerk webhook secret
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

        // Verify the signature to ensure it's from Svix
        try {
            await whook.verify(JSON.stringify(req.body), {
                "svix-id": req.headers["svix-id"],
                "svix-timestamp": req.headers["svix-timestamp"],
                "svix-signature": req.headers["svix-signature"]
            });
        } catch (err) {
            console.error("❌ Svix signature verification failed:", err.message);
            return res.status(400).json({ success: false, message: "Invalid signature" });
        }

        // Getting data from request body
        const { data, type} = req.body;
        console.log("📨 Webhook data received:", data);  // Log data received

        switch (type) {
            case 'user.created':
                try {
                    const userData = {
                        _id: data.id,
                        email: data.email_addresses[0].email_address, // FIXED
                        name: data.first_name + " " + data.last_name,
                        image: data.image_url,
                        resume: ''  // Assuming resume is empty
                    };

                    // Insert user data into DB
                    const result = await User.create(userData);
                    console.log("✅ User Created:", result);  // Log successful user creation
                    res.json({ success: true, message: 'User created successfully' });
                } catch (err) {
                    console.error("❌ DB Insert Failed:", err.message);
                    res.status(500).json({ success: false, message: 'Failed to create user' });
                }
                break;

            case 'user.updated':
                try {
                    const userData = {
                        email: data.email_addresses[0].email_address, // FIXED
                        name: data.first_name + " " + data.last_name,
                        image: data.image_url,
                    };

                    // Update user data in DB
                    const updatedUser = await User.findByIdAndUpdate(data.id, userData, { new: true });
                    console.log("✅ User Updated:", updatedUser);  // Log successful user update
                    res.json({ success: true, message: 'User updated successfully' });
                } catch (err) {
                    console.error("❌ DB Update Failed:", err.message);
                    res.status(500).json({ success: false, message: 'Failed to update user' });
                }
                break;

            case 'user.deleted':
                try {
                    // Delete user from DB
                    await User.findByIdAndDelete(data.id);
                    console.log("✅ User Deleted:", data.id);  // Log successful user deletion
                    res.json({ success: true, message: 'User deleted successfully' });
                } catch (err) {
                    console.error("❌ DB Deletion Failed:", err.message);
                    res.status(500).json({ success: false, message: 'Failed to delete user' });
                }
                break;

            default:
                console.log("📦 Unsupported event type:", type); // Log unsupported types
                res.status(400).json({ success: false, message: 'Unsupported event type' });
                break;
        }

    } catch (error) {
        console.error("❌ Webhook Error:", error.message);
        res.status(500).json({ success: false, message: 'Webhook error' });
    }
};
