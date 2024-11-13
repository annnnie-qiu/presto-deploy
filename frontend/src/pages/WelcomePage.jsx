import React, { StrictMode, useEffect } from "react";
import CustomizedBtn from "../components/login/share/CustomizedBtn";
import { motion, useAnimation } from "framer-motion";
import CustomHeader from "../components/Header";
import PrestoLogo from "../assets/Presto.png";

function WelcomePage() {
  const controls = useAnimation();

  useEffect(() => {
    // Start the animation
    controls.start({
      scale: [1, 2, 2, 1, 1],
      rotate: [0, 0, 180, 180, 0],
      borderRadius: ["0%", "0%", "50%", "50%", "0%"],
      transition: {
        duration: 2,
        ease: "easeInOut",
        times: [0, 0.2, 0.5, 0.8, 1],
        repeat: Infinity,
        repeatDelay: 1,
      },
    });

    // Stop the animation after 20 seconds
    const timer = setTimeout(() => {
      controls.stop();
    }, 5000); // 5 seconds in milliseconds

    return () => clearTimeout(timer);
  }, [controls]);

  return (
    <div className=" h-screen w-screen">
      <CustomHeader />
      <div className="logo">
        <img className="items-center justify-center" src={PrestoLogo} alt="Presto Logo"/>
      </div>
      <div className="flex flex-col items-center justify-center">
        <motion.div className="box" animate={controls}>
          <StrictMode>
            <div className="text-7xl font-bold m-10 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
              Welcome to Presto
            </div>
          </StrictMode>
        </motion.div>

        {/* <h1 className="text-4xl font-bold">Welcome to Presto</h1> */}
        <CustomizedBtn id="login" content="Login" path="/login" />
        <CustomizedBtn id="register" content="Register" path="/register" />
      </div>
    </div>
  );
}

export default WelcomePage;
