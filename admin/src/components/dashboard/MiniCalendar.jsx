import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./calendar.css";

const MiniCalendar = () => {
  const [date, setDate] = useState(new Date());

  return (
    <div className="w-full flex justify-center overflow-hidden">
      <div className="w-full max-w-[250px]">
        <Calendar
          onChange={setDate}
          value={date}
          className="hospital-calendar"
        />
      </div>
    </div>
  );
};

export default MiniCalendar;