import React from "react";
import Header from "../components/Header";
import SpecialityMenu from "../components/SpecialityMenu";
import TopDoctors from "../components/TopDoctors";
import Banner from "../components/Banner";
import Chatbot from "../components/Chatbot";

const Home = () => {
 
  // Return the JSX to render the Home page
  return (
    <div>
      <Header />
      <SpecialityMenu />
      <TopDoctors />
      <Banner />
      <Chatbot />
    </div>
  );
};

export default Home;