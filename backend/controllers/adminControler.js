import validator from "validator"
import bcrypt from 'bcrypt'
import mongoose from 'mongoose'
import { v2 as cloudinary } from "cloudinary"
import doctorModel from "../models/doctorModel.js"
import jwt from 'jsonwebtoken'
import appointmentModel from "../models/appointmentModel.js"
import userModel from "../models/userModel.js"


// API for adding doctor
const addDoctor = async (req, res) => {

    try {

        const { name, email, password, speciality, degree, experience, about, fees, address } = req.body
        const imageFile = req.file


        // checking for all data to add doctor
        if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address) {
            return res.json({ success: false, message: "Missing Details" })
        }

        // validating email format
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" })
        }

        // validating strong format
        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" })
        }

        // hashing doctor password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)


        if (!imageFile) {
            return res.json({ success: false, message: "Image file is required" });
        }

        // upload image to cloudinary

        const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" })
        const imageUrl = imageUpload.secure_url



        const doctorData = {
            name,
            email,
            image: imageUrl,
            password: hashedPassword,
            speciality,
            degree,
            experience,
            about,
            fees,
            address: JSON.parse(address),
            date: Date.now()
        }

        const newDoctor = new doctorModel(doctorData)
        await newDoctor.save()

        res.json({ success: true, message: "Doctor Added" })



    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })

    }
}

// API For admin Login
const loginAdmin = async (req, res) => {
    try {

        const { email, password } = req.body

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {

            const token = jwt.sign(email + password, process.env.JWT_SECRET)
            res.json({ success: true, token })

        } else {
            res.json({ success: false, message: "Invalid credentials" })
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// API to get all doctors list for admin panel
const allDoctors = async (req, res) => {
    try {

        const doctors = await doctorModel.find({}).select('-password')
        res.json({ success: true, doctors })


    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// API to get all patients list for admin panel
const allPatients = async (req, res) => {
    try {
        const patients = await userModel.find({}).select('-password');
        res.json({ success: true, patients });
        
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// API to delete a doctor
const deleteDoctor = async (req, res) => {
    try {
        const doctorId = req.params.id;

        // Check if doctor exists
        const doctor = await doctorModel.findById(doctorId);
        if (!doctor) {
            return res.json({ success: false, message: "Doctor not found" });
        }

        // Delete doctor's image from Cloudinary if exists
        if (doctor.image) {
            const publicId = doctor.image.split('/').pop().split('.')[0]; // Extract public ID from URL
            await cloudinary.uploader.destroy(publicId);
        }

        // Find and cancel all related appointments
        const appointments = await appointmentModel.find({ docId: doctorId });
        for (const appointment of appointments) {
            await appointmentModel.findByIdAndUpdate(appointment._id, { cancelled: true });
        }

        // Delete the doctor
        await doctorModel.findByIdAndDelete(doctorId);

        res.json({ success: true, message: "Doctor and related appointments handled successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}




//API to get all appointments list
const appointmentAdmin = async (req, res) => {

    try {

        const appointments = await appointmentModel.find({})
        res.json({ success: true, appointments })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API for appointment cancellation
const appointmentCancel = async (req, res) => {

    try {

        const { appointmentId } = req.body

        const appointmentData = await appointmentModel.findById(appointmentId)

      
        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })

        // releasing doctor slot

        const { docId, slotDate, slotTime } = appointmentData

        const doctorData = await doctorModel.findById(docId)

        let slots_booked = doctorData.slots_booked

        slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime)

        await doctorModel.findByIdAndUpdate(docId, { slots_booked })

        res.json({ success: true, message: 'Appointment Cancelled' })


    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get dashboard data for admin panel
const adminDashboard = async (req, res) => {
    try {

        const today = new Date().toISOString().slice(0, 10);
        const [doctors, users, appointments] = await Promise.all([
            doctorModel.find({}).select('-password'),
            userModel.find({}).select('-password'),
            appointmentModel.find({}).sort({ date: -1 })
        ]);

        const completedAppointments = appointments.filter((item) => item.isCompleted);
        const pendingAppointments = appointments.filter((item) => !item.cancelled && !item.isCompleted);
        const cancelledAppointments = appointments.filter((item) => item.cancelled);
        const todayAppointments = appointments.filter((item) => item.slotDate === today);
        const paidAppointments = appointments.filter((item) => item.payment || item.isCompleted);
        const revenue = paidAppointments.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

        const appointmentsPerMonth = await appointmentModel.aggregate([
            { $match: { date: { $exists: true } } },
            {
                $group: {
                    _id: {
                        month: { $dateToString: { format: "%Y-%m", date: { $toDate: "$date" } } }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        const patientsRegisteredPerMonth = await userModel.aggregate([
            { $match: { date: { $exists: true } } },
            {
                $group: {
                    _id: {
                        month: { $dateToString: { format: "%Y-%m", date: { $toDate: "$date" } } }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        const revenuePerMonth = await appointmentModel.aggregate([
            { $match: { $or: [{ payment: true }, { isCompleted: true }] } },
            {
                $group: {
                    _id: {
                        month: { $dateToString: { format: "%Y-%m", date: { $toDate: "$date" } } }
                    },
                    total: { $sum: { $toDouble: "$amount" } }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        const doctorPerformance = await appointmentModel.aggregate([
            { $group: {
                _id: "$docId",
                appointments: { $sum: 1 },
                completed: { $sum: { $cond: [{ $eq: ["$isCompleted", true] }, 1, 0] } },
                cancelled: { $sum: { $cond: [{ $eq: ["$cancelled", true] }, 1, 0] } },
                revenue: { $sum: { $cond: [{ $or: [{ $eq: ["$payment", true] }, { $eq: ["$isCompleted", true] }] }, { $toDouble: "$amount" }, 0] } }
            } },
            { $sort: { appointments: -1 } },
            { $limit: 6 }
        ]);

        const doctorPerformanceWithNames = await Promise.all(
            doctorPerformance.map(async (item) => {
                const doctor = await doctorModel.findById(item._id).select('name speciality');
                return {
                    _id: item._id,
                    name: doctor?.name || 'Unknown Doctor',
                    speciality: doctor?.speciality || 'General',
                    appointments: item.appointments,
                    completed: item.completed,
                    cancelled: item.cancelled,
                    revenue: item.revenue,
                };
            })
        );

        const departmentDistribution = await doctorModel.aggregate([
            { $group: { _id: "$speciality", count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        const recentPatients = await userModel.find({}).sort({ date: -1, _id: -1 }).limit(6).select('-password');
        const recentDoctors = await doctorModel.find({}).sort({ date: -1, _id: -1 }).limit(6).select('-password');

        const systemStatus = {
            database: mongoose.connection.readyState === 1 ? 'Operational' : 'Offline',
            backendApi: 'Operational',
            mailService: process.env.BREVO_API_KEY ? 'Operational' : 'Unavailable',
            paymentGateway: process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET ? 'Operational' : 'Unavailable',
            authentication: process.env.JWT_SECRET ? 'Operational' : 'Unavailable'
        };

        const notifications = [];
        appointments.slice(0, 6).forEach((item) => {
            if (item.cancelled) {
                notifications.push({ type: 'cancelled', title: 'Appointment Cancelled', message: `${item.userData?.name || 'Patient'} cancelled their booking`, time: item.slotDate });
            } else if (item.payment) {
                notifications.push({ type: 'payment', title: 'Payment Completed', message: `${item.userData?.name || 'Patient'} paid for the consultation`, time: item.slotDate });
            } else if (item.isCompleted) {
                notifications.push({ type: 'completed', title: 'Appointment Completed', message: `${item.docData?.name || 'Doctor'} completed a visit`, time: item.slotDate });
            } else {
                notifications.push({ type: 'booked', title: 'Appointment Booked', message: `${item.userData?.name || 'Patient'} booked with ${item.docData?.name || 'doctor'}`, time: item.slotDate });
            }
        });

        const dashData = {
            doctors: doctors.length,
            appointments: appointments.length,
            patients: users.length,
            todayAppointments: todayAppointments.length,
            completedAppointments: completedAppointments.length,
            pendingAppointments: pendingAppointments.length,
            cancelledAppointments: cancelledAppointments.length,
            revenue,
            latestAppointments: appointments.slice(0, 8).map((item) => ({
                ...item.toObject(),
                patientName: item.userData?.name || 'Patient',
                doctorName: item.docData?.name || 'Doctor',
                department: item.docData?.speciality || 'General'
            })),
            recentPatients,
            recentDoctors,
            analytics: {
                appointmentsPerMonth,
                patientsRegisteredPerMonth,
                revenuePerMonth,
                doctorPerformance: doctorPerformanceWithNames,
                departmentDistribution
            },
            systemStatus,
            notifications
        };

        res.json({ success: true, dashData });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// API to delete an appointment
const deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if appointment exists
    const appointment = await appointmentModel.findById(id);
    if (!appointment) {
      return res.json({ success: false, message: "Appointment not found" });
    }

    // Release doctor slot
    const { docId, slotDate, slotTime } = appointment;
    const doctor = await doctorModel.findById(docId);
    if (doctor) {
      let slots_booked = doctor.slots_booked;
      slots_booked[slotDate] = slots_booked[slotDate].filter((e) => e !== slotTime);
      await doctorModel.findByIdAndUpdate(docId, { slots_booked });
    }

    // Delete the appointment
    await appointmentModel.findByIdAndDelete(id);

    res.json({ success: true, message: "Appointment deleted successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { addDoctor, loginAdmin, allDoctors, allPatients, appointmentAdmin, appointmentCancel, adminDashboard , deleteDoctor, deleteAppointment };