import React from "react";
import { Button, Checkbox, Form, Input } from "antd";
import PrestoLogo from "../assets/Presto.png";
import CustomizedBtn from "../components/login/share/CustomizedBtn";
import { login } from "../../utils/API/Login_Register/login_register";
import { useNavigate } from "react-router-dom";
import { errorPopUp } from "../../utils/errorPopUp";

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

  const handleLogin = async () => {
    try {
      const response = await login(email, password);
      localStorage.setItem("token", response.token);
      navigate("/dashboard");
    } catch (error) {
      console.log(error);
      errorPopUp("There was an error logging in", "invalid email or password");
    }
  };

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
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
