import React from "react";
import CustomizedBtn from "../components/login/share/CustomizedBtn";

function WelcomePage() {
  return (
    <div className=" h-screen w-screen">
      <div className="flex flex-col items-center justify-center h-full w-full">
        <h1 className="text-4xl font-bold">Welcome to Presto</h1>
        <CustomizedBtn id="login" content="Login" path="/login" />
        <CustomizedBtn id="register" content="Register" path="/register" />
      </div>
    </div>
  );
}

export default WelcomePage;
