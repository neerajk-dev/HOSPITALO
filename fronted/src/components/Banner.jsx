import { assets } from "../assets/assets"; // Image assets
import { Link, useNavigate } from "react-router-dom"; // For routing

const Banner = () => {
  const navigate = useNavigate();

  return (
    <div className="flex bg-gradient-to-r from-[#3A4FFF] to-[#202C80] rounded-lg px-6 sm:px-10 md:px-14 lg:px-12 my-20 md:mx-10">
      {/* Left: Text and CTA */}
      <div className="flex-1 py-8 sm:py-10 md:py-16 lg:py-24 lg:pl-5">
        <div className="text-xl sm:text-2xl md:text-3xl lg:text-5xl font-semibold text-white">
          <p>Book Appointment</p>
          <p className="mt-4">With 100+ Trusted Doctors</p>
        </div>
       <div className="">
         <button
          onClick={() => {
            navigate("/login");
            scrollTo(0, 0);
          }}
          className="bg-white text-sm sm:text-base text-gray-600 px-8 py-3 rounded-full mt-6 hover:scale-105 transition-all"
        >
          Create account
        </button>
        <button className="bg-white ml-3 text-sm sm:text-base text-gray-600 px-3 py-3 rounded-full mt-6 hover:scale-105 transition-all">
          <Link to="/nearby-pharmacy">
            Find Nearby Pharmacy
          </Link>
        </button>
       </div>
        

      </div>

      {/* Right: Image */}
      <div className="hidden md:block md:w-1/2 lg:w-[370px] relative">
        <img
          className="w-full absolute bottom-0 right-0 max-w-md"
          src={assets.appointment_img}
          alt="Appointment"
        />
      </div>
    </div>
  );
};

export default Banner;
