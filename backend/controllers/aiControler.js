import fetch from "node-fetch";
import Doctor from "../models/doctorModel.js";

const chatbot = async (req, res) => {
  const { message } = req.body;

  if (!message || message.trim() === "") {
    return res.status(400).json({
      success: false,
      message: "Message is required.",
    });
  }

  try {
    const lowerMsg = message.toLowerCase();

    // 🔹 1️⃣ Detect symptom-related messages
    const symptomKeywords = [
      "fever",
      "headache",
      "cough",
      "cold",
      "chest pain",
      "stomach pain",
      "vomiting",
      "eye pain",
      "toothache",
      "skin rash",
      "joint pain",
    ];

    const foundSymptom = symptomKeywords.find((kw) => lowerMsg.includes(kw));

    if (foundSymptom) {
      const deptMap = {
        fever: "General Medicine",
        headache: "Neurology",
        cough: "Pulmonology",
        cold: "ENT",
        "chest pain": "Cardiology",
        "stomach pain": "Gastroenterology",
        vomiting: "Gastroenterology",
        "eye pain": "Ophthalmology",
        toothache: "Dentistry",
        "skin rash": "Dermatology",
        "joint pain": "Orthopedics",
      };

      const dept = deptMap[foundSymptom] || "General Medicine";
      const doctors = await Doctor.find(
        { speciality: { $regex: dept, $options: "i" } },
        "name speciality experience"
      );

      if (doctors.length > 0) {
        const doctorList = doctors
          .map(
            (d, i) =>
              `${i + 1}. ${d.name} — ${d.speciality} (${d.experience} exp)`
          )
          .join("\n");

        return res.json({
          success: true,
          reply: `It seems you’re experiencing **${foundSymptom}**. You may consult the **${dept}** department.\n\nHere are some available doctors:\n\n${doctorList}`,
        });
      } else {
        return res.json({
          success: true,
          reply: `It seems you’re experiencing **${foundSymptom}**. You may consult the **${dept}** department, but no doctors are currently available in that department.`,
        });
      }
    }

    // 🔹 2️⃣ If user asks for doctor list
    if (
      lowerMsg.includes("doctor list") ||
      lowerMsg.includes("available doctor") ||
      lowerMsg.includes("show doctors")
    ) {
      const doctors = await Doctor.find({}, "name speciality experience");
      if (!doctors.length)
        return res.json({
          success: true,
          reply: "❌ No doctors found in the system.",
        });

      const formatted = doctors
        .map(
          (d, i) =>
            `${i + 1}.  ${d.name} — ${d.speciality} (${d.experience} exp)`
        )
        .join("\n");

      return res.json({
        success: true,
        reply: `Here are the available doctors:\n\n${formatted}`,
      });
    }

    // 🔹 3️⃣ Otherwise forward query to DeepSeek AI
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://hospitalo-yjlj.onrender.com",
        "X-Title": "Hospitalo ChatBot",
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-chat",
        messages: [
          {
            role: "system",
            content:
              "You are Hospitalo, an AI medical assistant chatbot. Help users with appointment info, doctors, or hospital-related queries. Be friendly and concise.",
          },
          { role: "user", content: message },
        ],
      }),
    });

    const data = await response.json();

    const reply =
      data?.choices?.[0]?.message?.content?.trim() ||
      data?.error?.message ||
      "I'm sorry, I couldn't generate a response right now.";

    res.json({ success: true, reply });
  } catch (error) {
    console.error("❌ Chatbot Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error — unable to connect to AI model.",
    });
  }
};

export { chatbot };