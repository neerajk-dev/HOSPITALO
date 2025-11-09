
# 🏥 Hospitalo Project Documentation

> 🚀 Hospitalo is a modern, full-stack hospital management platform designed to streamline healthcare operations. It offers secure authentication, real-time appointment booking, analytics dashboards, online payments, and a beautiful, responsive UI for Admins, Doctors, and Patients.

Welcome to the **Hospitalo** platform!  
This documentation covers the Admin Panel, Backend API, and Frontend Panel, with colorful icons and clear headings for each section.

---

- **Live link for User**: [Hospitalo User Panel](https://hospitalo-yjlj.onrender.com/)
- **Live link for Admin**: [Hospitalo Admin Panel](https://hospitalo-admin.onrender.com/doctor-appointments)

---

## 🛠️ Tech Stack

| Technology   | Icon                                                                 |
|--------------|----------------------------------------------------------------------|
| Node.js      | ![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white&style=for-the-badge) |
| Express.js   | ![Express.js](https://img.shields.io/badge/Express.js-000000?logo=express&logoColor=white&style=for-the-badge) |
| MongoDB      | ![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white&style=for-the-badge) |
| React        | ![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB&style=for-the-badge) |
| Vite         | ![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=FFD62E&style=for-the-badge) |
| TailwindCSS  | ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-06B6D4?logo=tailwindcss&logoColor=white&style=for-the-badge) |
| Axios        | ![Axios](https://img.shields.io/badge/Axios-5A29E4?logo=axios&logoColor=white&style=for-the-badge) |
| JWT          | ![JWT](https://img.shields.io/badge/JWT-000000?logo=jsonwebtokens&logoColor=white&style=for-the-badge) |
| Razorpay     | ![Razorpay](https://img.shields.io/badge/Razorpay-02042B?logo=razorpay&logoColor=white&style=for-the-badge) |
| Cloudinary   | ![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?logo=cloudinary&logoColor=white&style=for-the-badge) |
| DeepSeek API   | ![DeepSeek](https://img.shields.io/badge/DeepSeek-1E90FF?logo=deepl&amp;logoColor=white&amp;style=for-the-badge>) |
| OpenStreetMap | ![OpenStreetMap](https://img.shields.io/badge/OpenStreetMap-7AB317?logo=openstreetmap&logoColor=white&style=for-the-badge) |

---

## 🚀 Features Overview

- 👨‍⚕️ **Doctor Management**: Add, edit, and manage doctor profiles, specialities, and availability.
- 📅 **Appointment Oversight**: View, approve, or cancel patient appointments with real-time updates.
- 📊 **Analytics Dashboard**: Visualize key metrics: total doctors, appointments, and patients.
- 🔒 **Secure Login**: Separate authentication for Admins, Doctors, and Users.
- ☁️ **Image Upload**: Upload doctor profile images securely.
- 🩺 **Browse Doctors**: Patients can find and filter doctors by speciality and availability.
- 💳 **Online Payments**: Securely pay for appointments using integrated payment gateways.
- 🔔 **Notifications**: Real-time updates for confirmations, reminders, and more.
- 👤 **Profile Management**: Update personal details and manage health information.
- 🤖 **Chatbot Integration**: AI-powered chatbot for answering user queries and assisting with appointment booking.
- 📍**Location Access**: Automatically detects the user’s current location using the browser’s Geolocation API.
- 🏪 **Nearby Pharmacy Detection**: Displays a list of pharmacies within a few kilometers radius.

---

## 📁 Folder Structure

```
admin/      # Admin Panel (React)
backend/    # Backend API (Node.js, Express.js)
fronted/    # Frontend Panel (React)
```

---

## 📡 API Endpoints (Backend)

### 👤 User APIs (`/api/user`)
- `POST /register` — Register a new user  
  **Request:**  
  ```json
  { "name": "John Doe", "email": "john@example.com", "password": "yourpassword" }
  ```
  **Response:**  
  ```json
  { "success": true, "token": "jwt_token_here", "user": { "id": "user_id", "name": "John Doe", "email": "john@example.com" } }
  ```

- `POST /login` — User login  
  **Request:**  
  ```json
  { "email": "john@example.com", "password": "yourpassword" }
  ```
  **Response:**  
  ```json
  { "success": true, "token": "jwt_token_here" }
  ```

- `GET /get-profile` — Get user profile (auth required)  
  **Headers:** `{ token: <jwt_token> }`  
  **Response:**  
  ```json
  { "success": true, "userData": { ... } }
  ```

- `POST /book-appointment` — Book an appointment (auth)  
  **Request:**  
  ```json
  { "doctorId": "doctor_id", "date": "2024-06-10", "time": "10:00" }
  ```
  **Response:**  
  ```json
  { "success": true, "appointment": { ... } }
  ```

### 🤖 Chatbot API (`/api/chatbot`)
- `POST /ask` — Send a query to the chatbot  
  **Request:**  
  ```json
  { "query": "What are the available appointment slots for Dr. Smith?" }
  ```
  **Response:**  
  ```json
  { "response": "Dr. Smith is available on Monday and Wednesday from 10:00 AM to 2:00 PM." }
  ```

---

### 👨‍⚕️ Doctor APIs (`/api/doctor`)
- `POST /login` — Doctor login  
- `GET /appointments` — Doctor's appointments (auth)
- `POST /complete-appointment` — Mark appointment as complete (auth)
- `POST /cancel-appointment` — Cancel appointment (auth)
- `GET /dashboard` — Doctor dashboard stats (auth)
- `GET /profile` — Get doctor profile (auth)
- `POST /update-profile` — Update doctor profile (auth)

---

### 🛡️ Admin APIs (`/api/admin`)
- `POST /login` — Admin login  
  **Request:**  
  ```json
  { "email": "admin@example.com", "password": "adminpassword" }
  ```
  **Response:**  
  ```json
  { "success": true, "token": "admin_jwt_token" }
  ```

- `POST /add-doctor` — Add a new doctor (auth, file upload)
- `POST /all-doctors` — List all doctors (auth)
- `POST /change-availability` — Change doctor availability (auth)
- `GET /appointments` — List all appointments (auth)
- `POST /cancel-appointment` — Cancel appointment (auth)
- `GET /dashboard` — Admin dashboard stats (auth)

---

## 📝 How to Use the Chatbot

1. **Backend Setup**:  
   - Ensure the OpenAI API key is set in the `.env` file under `DEEPSEEK_API_KEY`.
   - The chatbot logic is implemented in the backend under `controllers/chatbotController.js`.

2. **Frontend Integration**:  
   - A chatbot widget is available in the frontend under `components/Chatbot.jsx`.
   - The widget allows users to type queries and receive responses in real-time.

3. **Example Queries**:  
   - "What are the available appointment slots for Dr. Smith?"
   - "How can I reset my password?"
   - "What is the consultation fee for a cardiologist?"

---

## 🎨 UI Highlights

- **Modern, responsive design** with TailwindCSS
- **Colorful icons** for intuitive navigation
- **Sidebar and navbar** for easy access to all features
- **Real-time feedback** and notifications
- **Chatbot widget** for real-time assistance.

---

## 🛠️ Environment Variables

Each service uses its own `.env` file. Below are the required variables:

### Backend `.env`
- `MONGO_URI` — MongoDB connection string.
- `JWT_SECRET` — Secret for JWT tokens.
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` — Cloudinary credentials.
- `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET` — Razorpay credentials.
- `DEEPSEEK_API_KEY` — Deepseek API key for the chatbot.

### Frontend `.env`
- `VITE_API_BASE_URL` — Base URL for the backend API.

---

## 🚀 Deployment Notes

- **Frontend**: Build the React apps (admin and frontend) using `npm run build` and deploy to a static hosting service like Netlify or Vercel.
- **Backend**: Deploy the Node.js backend to a platform like Render, Heroku, or AWS. Ensure environment variables are configured correctly.

---

## 📬 Contact

For support or feedback, contact:  
📧 neerajkr145518@gmail.com  
📞 +7277959834

---

> _Empowering healthcare
