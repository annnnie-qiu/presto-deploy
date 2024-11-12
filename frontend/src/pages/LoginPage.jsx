import React, { useRef } from "react";
import { Button, Checkbox, Form, Input } from "antd";
import PrestoLogo from "../assets/Presto.png";
import CustomizedBtn from "../components/login/share/CustomizedBtn";
import { login, register } from "../../utils/API/Login_Register/login_register";
import { useNavigate } from "react-router-dom";
import { errorPopUp } from "../../utils/errorPopUp";

import { GoogleLogin } from "@react-oauth/google";
import { GoogleOAuthProvider } from "@react-oauth/google";
import jwt_decode from "jwt-decode";
import ReCAPTCHA from "react-google-recaptcha";

function LoginPage() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const navigate = useNavigate();

  const onFinish = (values) => {
    console.log("Success:", values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const handleEnterKeyPress = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  const handleLogin = async (event) => {
    event.preventDefault(); // prevent the default form submission

    // catch the value of the ReCAPTCHA
    const captchaValue = recaptcha.current.getValue();

    // check if the user has verified the reCAPTCHA
    if (!captchaValue) {
      alert("Please do the human-machine verification!");
      return;
    }
    try {
      const response = await login(email, password);
      localStorage.setItem("token", response.token);
      navigate("/dashboard");
    } catch (error) {
      console.log(error);
      errorPopUp("There was an error logging in", "invalid email or password");
    }
  };

  const handleSuccess = async (credentialResponse) => {
    console.log(credentialResponse);
    const decoded = jwt_decode(credentialResponse.credential);
    const userEmail = decoded.email;
    const userName = decoded.name; // Access the user's name

    console.log("User Email:", userEmail);
    setEmail(userEmail);
    const encoder = new TextEncoder();
    const data = encoder.encode(userEmail);

    const hashBuffer = await window.crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const password = hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    setPassword(password);
    // try to login first
    try {
      const response = await login(userEmail, password);
      localStorage.setItem("token", response.token);
      navigate("/dashboard");
    } catch (error) {
      // if login failed, try to register
      try {
        const response = await register(userEmail, password, userName);
        // save in the localStorage
        localStorage.setItem("token", response.token);
        navigate("/dashboard");
      } catch (error) {
        console.log(error);
        errorPopUp(
          "There was an error logging in",
          "invalid email or password"
        );
      }
    }
  };
  const handleError = () => {
    console.log("Login Failed");
  };

  const recaptcha = useRef();

  // check if the user press enter key to login TODO: not working
  React.useEffect(() => {
    window.addEventListener("keydown", handleEnterKeyPress);

    return () => {
      window.removeEventListener("keydown", handleEnterKeyPress);
    };
  }, [email, password]);

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-violet-500">
      <div className="w-4/6 h-4/6 border-solid border-2 bg-white border-gray-100 shadow-md rounded-lg flex justify-center items-center">
        <div className="flex-1 h-full flex flex-col justify-center items-start gap-4">
          <img
            src={PrestoLogo}
            alt="Presto Logo"
            className="object-contain max-h-38 max-w-full sm:max-h-24 md:max-h-32 lg:max-h-38 w-full fade-in-up-logo hide-on-mobile"
          />

          <div className="text-xl font-bold ml-16 text-gray-600 fade-in-up-logo Playwrite hide-on-mobile">
            {/* <h1 className="mb-2">Endless learning, Limitless sharing</h1>
            <h1>All on Qanda 🚀</h1> */}
          </div>
        </div>

        {/* Divider */}
        <div className="w-0.5 h-5/6 bg-gray-200 hide-on-mobile"></div>

        {/* Login Form */}
        <div className="flex-1 h-full flex flex-col justify-center gap-4 p-3">
          <h1 className="text-3xl font-bold">Login</h1>

          <Form
            name="basic"
            labelCol={{
              span: 6,
            }}
            wrapperCol={{
              span: 16,
            }}
            style={{
              maxWidth: 600,
            }}
            initialValues={{
              remember: true,
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              label="Email"
              name="Email"
              rules={[
                {
                  required: true,
                  message: "Please input your Email!",
                },
              ]}
            >
              <Input
                value={email}
                onChange={(text) => {
                  setEmail(text.target.value);
                }}
                onKeyDown={handleEnterKeyPress}
              />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please input your password!",
                },
              ]}
            >
              <Input.Password
                value={password}
                onChange={(text) => {
                  setPassword(text.target.value);
                }}
                onKeyDown={handleEnterKeyPress}
              />
            </Form.Item>
          </Form>

          <div className="flex flex-col gap-1">
            <CustomizedBtn id="loginBtn" content="Login" action={handleLogin} />
            <a
              className="text-blue-500 text-center"
              onClick={() => {
                navigate("/register");
              }}
            >
              Don't have an account? Register here
            </a>
          </div>

          <GoogleOAuthProvider clientId="398166640926-mt5lmsm2bqp87ek57lp5er93etmlh41l.apps.googleusercontent.com">
            {/* Your app components go here */}
            <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
          </GoogleOAuthProvider>

          <ReCAPTCHA
            ref={recaptcha}
            sitekey={import.meta.env.VITE_REACT_APP_SITE_KEY}
          />
          {/* <ReCAPTCHA sitekey={import.meta.env.VITE_REACT_APP_SITE_KEY} /> */}
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
