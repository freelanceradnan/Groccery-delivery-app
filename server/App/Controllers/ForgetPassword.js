import { ChangeMyPassword, VerifyMyEmail, VerifyMyOtp } from "../Services/ForgetPassword.js"

//mail very
export const VerifyEmail = async (req, res) => {
    const { email } = req.body;

    try {
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required. Please enter a valid email address!"
            });
        }

        
        const result = await VerifyMyEmail(email);
       
        if (!result.success) {
            return res.status(400).json({
                success: false,
                message: result.message
            });
        }
      

        // 3. Send success response
        res.status(200).json({
            success: true,
            message: "Email verification successfully.Your otp sent to email!",
        });

    } catch (error) {
        // 4. Handle unexpected server errors
     res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error"
        });
    }
};
//otp verify
export const VerifyOtp = async (req, res) => {
    const { email, otp } = req.body;
   
    try {
        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: "Email and OTP are required!"
            });
        }
        const result = await VerifyMyOtp(email, otp);
       
        if (!result.success) {
            return res.status(400).json({
                success: false,
                message: result.message
            });
        }
    
        return res.status(200).json({
            success: true,
            message: "OTP verified successfully! You can now proceed.",
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error"
        });
    }
};
//change password
export const ChangePassword = async (req, res) => {
    const { email, otp,password} = req.body;
   
    try {
        if (!email || !otp ||!password) {
            return res.status(400).json({
                success: false,
                message: "New Password Missing!"
            });
        }
        const result = await ChangeMyPassword(email, otp,password);
       
        if (!result.success) {
            return res.status(400).json({
                success: false,
                message: result.message
            });
        }
    
        return res.status(200).json({
            success: true,
            message: "Password Updated success!",
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error"
        });
    }
};