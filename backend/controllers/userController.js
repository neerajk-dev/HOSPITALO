
import validator from 'validator'
import bcrypt from 'bcrypt'
import userModel from '../models/userModel.js'
import sendWithBrevo from '../utils/sendWithBrevo.js'
import jwt from 'jsonwebtoken'
import { v2 as cloudinary } from 'cloudinary'
import doctorModel from '../models/doctorModel.js'
import appointmentModel from '../models/appointmentModel.js'
import razorpay from 'razorpay'
import { PASSWORD_RESET_TEMPLATE, CONFIRMATION_TEMPLATE_USER, CANCELLATION_TEMPLATE_USER, PAYMENT_RECEIPT_TEMPLATE, FEEDBACK_TEMPLATE } from '../config/emailTemplates.js'


const razorpayInstance = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
})

//API to register user
const registerUser = async (req, res) => {

    try {

        const { name, email, password } = req.body

        if (!name || !password || !email) {
            return res.json({ success: false, message: "Missing Details" })
        }

        // validating email format
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "enter a valid email" })
        }

        const existingUser = await userModel.findOne({ email })

        if (existingUser) {
            return res.json({ success: false, message: 'User already exists' })
        }

        // validating strong password
        if (password.length < 8) {
            return res.json({ success: false, message: "enter a strong password" })
        }

        // hashing user password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const userData = {
            name,
            email,
            password: hashedPassword
        }

        const newUser = new userModel(userData)
        const user = await newUser.save()

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        // Sending welcome email
        try {
            await sendWithBrevo({
                to: user.email,
                subject: 'Welcome to Hospitalo',
                text: `Welcome to Hospitalo website. Your account has been created with email id: ${email}`,
                senderName: 'HOSPITALO'
            });
        } catch (mailErr) {
            console.error('Brevo API send error:', mailErr?.response?.data || mailErr.message);
            return res.json({ success: false, message: 'Failed to send email', error: mailErr?.message });
        }

        res.json({ success: true, token })


    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}
// API  for user login
const loginUser = async (req, res) => {


    try {

        const { email, password } = req.body
        const user = await userModel.findOne({ email })

        if (!email || !password) {
            return res.json({ success: false, message: 'Email and password are required' })
        }

        if (!user) {
            return res.json({ success: false, message: 'User does not exist' })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.json({ success: false, message: 'Incorrect password' });
        }

        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000
            })

            return res.json({ success: true, token })
        } else {
            return res.json({ success: false, message: "Invalid credentials" })
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }

}


const logout = async (req, res) => {

    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict'
        });
        return res.json({ success: true, message: 'Logged out' });


    } catch (error) {
        return res.json({ success: false, message: error.message })
    }

}



// Send Password Reset OTP
const sendResetOtp = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.json({ success: false, message: "Email is required" });
    }

    try {

        const user = await userModel.findOne({ email })
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000))

        user.resetOtp = otp;
        user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000

        await user.save()

        try {
            await sendWithBrevo({
                to: user.email,
                subject: 'Password Reset OTP',
                html: PASSWORD_RESET_TEMPLATE.replace("{{otp}}", otp).replace("{{email}}", user.email),
                senderName: 'HOSPITALO'
            });
        } catch (mailErr) {
            console.error('Brevo API send error:', mailErr?.response?.data || mailErr.message);
            return res.json({ success: false, message: 'Failed to send email', error: mailErr?.message });
        }

        return res.json({ success: true, message: "OTP sent to your email" });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// ✅ Verify Reset OTP
export const verifyResetOtp = async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.json({ success: false, message: "Email and OTP are required" });
    }

    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        if (!user.resetOtp || user.resetOtp !== otp) {
            return res.json({ success: false, message: "Invalid OTP" });
        }

        if (user.resetOtpExpireAt < Date.now()) {
            return res.json({ success: false, message: "OTP expired" });
        }

        return res.json({ success: true, message: "OTP verified successfully" });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};



// 🔒 Reset Password After OTP
const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
        return res.json({ success: false, message: "Email, OTP, and new password are required" });
    }

    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        if (!user.resetOtp || user.resetOtp !== otp) {
            return res.json({ success: false, message: "Invalid OTP" });
        }

        if (user.resetOtpExpireAt < Date.now()) {
            return res.json({ success: false, message: "OTP expired" });
        }

        // Update password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetOtp = "";
        user.resetOtpExpireAt = 0;

        await user.save();

        return res.json({ success: true, message: "Password reset successful" });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};



// API to get user profile data
const getProfile = async (req, res) => {

    try {
        const { userId } = req.body
        const userData = await userModel.findById(userId).select('-password')

        res.json({ success: true, userData })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

//API to update user profile
const updateProfile = async (req, res) => {

    try {

        const { userId, name, phone, address, dob, gender } = req.body
        const imageFile = req.file

        if (!name || !phone || !dob || !gender) {
            return res.json({ success: false, message: "Data Missing" })
        }

        await userModel.findByIdAndUpdate(userId, { name, phone, address: JSON.parse(address), dob, gender })

        if (imageFile) {

            // upload image to cloudinary
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" })
            const imageURL = imageUpload.secure_url

            await userModel.findByIdAndUpdate(userId, { image: imageURL })
        }

        res.json({ success: true, message: 'Profile Updated' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to book appointment
const bookAppointment = async (req, res) => {

    try {

        const { userId, docId, slotDate, slotTime } = req.body

        const docData = await doctorModel.findById(docId).select('-password')

        if (!docData.available) {
            return res.json({ success: false, message: 'Doctor not available' })
        }

        let slots_booked = docData.slots_booked

        //checking for slot availablity
        if (slots_booked[slotDate]) {
            if (slots_booked[slotDate].includes(slotTime)) {
                return res.json({ success: false, message: 'Slot not available' })
            } else {
                slots_booked[slotDate].push(slotTime)
            }
        } else {
            slots_booked[slotDate] = []
            slots_booked[slotDate].push(slotTime)
        }

        const userData = await userModel.findById(userId).select('-password')

        delete docData.slots_booked

        const appointmentData = {
            userId,
            docId,
            userData,
            docData,
            amount: docData.fees,
            slotTime,
            slotDate,
            date: Date.now()
        }

        const newAppointment = new appointmentModel(appointmentData)
        await newAppointment.save()

        // save new slots data in docData
        await doctorModel.findByIdAndUpdate(docId, { slots_booked })

        // Send appointment confirmation email
        try {
            await sendWithBrevo({
                to: userData.email,
                subject: "Appointment Confirmed ✅",
                html: CONFIRMATION_TEMPLATE_USER
                    .replace("{{name}}", userData.name)
                    .replace("{{doctorName}}", docData.name)
                    .replace("{{slotDate}}", slotDate)
                    .replace("{{slotTime}}", slotTime),
                senderName: 'HOSPITALO'
            });
        } catch (mailErr) {
            console.error('Brevo API send error:', mailErr?.response?.data || mailErr.message);
            return res.json({ success: false, message: 'Failed to send email', error: mailErr?.message });
        }

        res.json({ success: true, message: 'Appointment Booked' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API to get user appointments for frontend my-appointments page
const listAppintment = async (req, res) => {

    try {

        const { userId } = req.body
        const appointments = await appointmentModel.find({ userId })

        res.json({ success: true, appointments })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API to cancel appointment
const cancelAppointment = async (req, res) => {
    try {
        const { userId, appointmentId } = req.body;
        const appointmentData = await appointmentModel.findById(appointmentId);

        if (!appointmentData) {
            return res.json({ success: false, message: "Appointment not found" });
        }

        // verify appointment user
        if (appointmentData.userId.toString() !== userId) {
            return res.json({ success: false, message: 'Unauthorized action' });
        }

        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });

        // releasing doctor slot 
        const { docId, slotDate, slotTime } = appointmentData;

        const doctorData = await doctorModel.findById(docId);
        const userData = await userModel.findById(userId); // ✅ Fetch userData

        let slots_booked = doctorData.slots_booked;

        if (slots_booked[slotDate]) {
            slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime);

            // If no slots left for that date, delete the key
            if (slots_booked[slotDate].length === 0) {
                delete slots_booked[slotDate];
            }
        }

        await doctorModel.findByIdAndUpdate(docId, { slots_booked });

        // Send cancellation email
        try {
            await sendWithBrevo({
                to: userData.email,
                subject: "Appointment Cancelled ❌",
                html: CANCELLATION_TEMPLATE_USER
                    .replace("{{name}}", userData.name)
                    .replace("{{doctorName}}", doctorData.name)
                    .replace("{{slotDate}}", slotDate)
                    .replace("{{slotTime}}", slotTime),
                senderName: 'HOSPITALO'
            });
        } catch (mailErr) {
            console.error('Brevo API send error:', mailErr?.response?.data || mailErr.message);
            return res.json({ success: false, message: 'Failed to send email', error: mailErr?.message });
        }

        res.json({ success: true, message: 'Appointment Cancelled' });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};




// API to make payment of appointment using razorpay
const paymentRazorpay = async (req, res) => {

    try {

        const { appointmentId } = req.body
        const appointmentData = await appointmentModel.findById(appointmentId)

        if (!appointmentData || appointmentData.cancelled) {
            return res.json({ success: false, message: "Appointment Cancelled or not found" })
        }

        // creating options for razorpay payment
        const options = {
            amount: appointmentData.amount * 100,
            currency: process.env.CURRENCY,
            receipt: appointmentId,
        }

        // creation of an order
        const order = await razorpayInstance.orders.create(options)

        res.json({ success: true, order })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API to verify payment of razorpay
const verifyRazorpay = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id } = req.body;

        // Fetch the order details from Razorpay
        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);
        const appointmentId = orderInfo.receipt;

        if (!appointmentId) {
            return res.json({ success: false, message: "Appointment not found" });
        }

        // Get the appointment details
        const appointment = await appointmentModel.findById(appointmentId);
        if (!appointment) {
            return res.json({ success: false, message: "Invalid Appointment" });
        }

        if (orderInfo.status === 'paid' || razorpay_payment_id) {
            // ✅ Save payment status and Razorpay payment ID
            await appointmentModel.findByIdAndUpdate(appointmentId, {
                payment: true,
                razorpay_payment_id: razorpay_payment_id,
                refundStatus: 'not_initiated'
            });

            // ✅ Get user and doctor data
            const user = await userModel.findById(appointment.userId);
            const doctor = await doctorModel.findById(appointment.docId);

            // ✅ Import email template
            const htmlContent = PAYMENT_RECEIPT_TEMPLATE
                .replace('{{userName}}', user.name)
                .replace('{{doctorName}}', doctor.name)
                .replace('{{speciality}}', doctor.speciality)
                .replace('{{slotDate}}', appointment.slotDate)
                .replace('{{slotTime}}', appointment.slotTime)
                .replace('{{amount}}', appointment.amount)
                .replace('{{paymentId}}', razorpay_payment_id);

            // ✅ Send receipt email
            try {
                await sendWithBrevo({
                    to: user.email,
                    subject: "🧾 Payment Receipt - Hospitalo",
                    html: htmlContent,
                    senderName: 'HOSPITALO'
                });
            } catch (mailErr) {
                 console.error('Brevo API send error:', mailErr?.response?.data || mailErr.message);
                return res.json({ success: false, message: 'Failed to send email', error: mailErr?.message });
            }

            return res.json({ success: true, message: "Payment verified and receipt sent" });
        } else {
            return res.json({ success: false, message: "Payment not completed" });
        }

    } catch (error) {
        console.log("verifyRazorpay error:", error);
        return res.json({ success: false, message: error.message });
    }
};

const sendFeedback = async (req, res) => {
    try {
        const { userId, message } = req.body;

        if (!userId && !message) {
            return res.json({ success: false, message: "Message is required" });
        }

        const user = await userModel.findById(userId).select('-password');

        if(!user){
            return res.json({ success: false, message: "User not found" });
        }

        const adminTo = process.env.SENDER_EMAIL;
        const html = FEEDBACK_TEMPLATE
            .replace("{{name}}", user.name || "Anonymous")
            .replace("{{email}}", user.email || "Not provided")
            .replace("{{message}}", message)
            .replace("{{date}}", new Date().toLocaleString());

        try {
            await sendWithBrevo({
            to: adminTo,
            subject: "📝 New Feedback Received",
            html,
            senderName: 'HOSPITALO'
        });
            
        } catch (mailErr) {
            console.error('Brevo API send error:', mailErr?.response?.data || mailErr.message);
            return res.json({ success: false, message: 'Failed to send email', error: mailErr?.message });
        }

        return res.json({ success: true, message: "Feedback sent successfully" });

    } catch (error) {
        console.log("sendFeedback error:", error);
        return res.json({ success: false, message: error.message });
    }
}



export { registerUser, loginUser, logout, sendResetOtp, resetPassword, getProfile, updateProfile, bookAppointment, listAppintment, cancelAppointment, paymentRazorpay, verifyRazorpay, sendFeedback }