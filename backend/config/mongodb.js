import mongoose from 'mongoose'
import dns from 'dns'

const connectDB = async () => {
    mongoose.connection.on('connected', () => console.log("Database Connected"))

    const uri = `${process.env.MONGODB_URI}/prescripto`

    try {
        await mongoose.connect(uri)
        return
    } catch (err) {
        console.warn('Initial MongoDB connection failed:', err.message)

        // If SRV DNS lookup was refused, try using public DNS servers and retry once
        if (err.code === 'ECONNREFUSED' && err.syscall === 'querySrv') {
            try {
                dns.setServers(['8.8.8.8', '8.8.4.4'])
                // console.log('Set DNS servers to Google (8.8.8.8, 8.8.4.4) and retrying connection')
                await mongoose.connect(uri)
                return
            } catch (err2) {
                console.error('Retry with Google DNS failed:', err2.message)
                throw err2
            }
        }

        throw err
    }
}

export default connectDB