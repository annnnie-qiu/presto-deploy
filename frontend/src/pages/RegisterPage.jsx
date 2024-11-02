import React from "react";
import PrestoLogo from "../assets/Presto.png";
import { Button, Checkbox, Form, Input } from "antd";
import CustomizedBtn from "../components/login/share/CustomizedBtn";
import { register } from "../../utils/API/Login_Register/login_register";
import { useNavigate } from "react-router-dom";

function RegisterPage() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [name, setName] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const navigate = useNavigate();
  const onFinish = (values) => {
    console.log("Success:", values);
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
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

        {/* Register Form */}
        <div
          id="registerForm"
          className="flex-1 h-full flex flex-col justify-center gap-4 p-3"
        >
          <h1 className="text-3xl font-bold">Registration</h1>

          <Form
            name="basic"
            labelCol={{
              span: 7,
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
            {/* email input */}
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
              />
            </Form.Item>

            {/* name input */}
            <Form.Item
              label="Name"
              name="Name"
              rules={[
                {
                  required: true,
                  message: "Please input your Name!",
                },
              ]}
            >
              <Input
                value={name}
                onChange={(text) => {
                  setName(text.target.value);
                }}
              />
            </Form.Item>

            {/* password input */}
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
              />
            </Form.Item>

            {/* confirm password input */}
            <Form.Item
              label="Confirm Password"
              name="confirmPassword"
              rules={[
                {
                  required: true,
                  message: "Please input your password!",
                },
              ]}
            >
              <Input.Password
                value={confirmPassword}
                onChange={(text) => {
                  setConfirmPassword(text.target.value);
                }}
              />
            </Form.Item>
          </Form>

          <div className="flex flex-col gap-1">
            <div className="flex flex-col gap-1">
              <CustomizedBtn
                id="registerBtn"
                content="Register"
                action={async () => {
                  const response = await register(email, password, name);
                  // save in the localStorage
                  // setlocalStorage("token", response.token);
                  navigate("/dashboard");
                }}
              />
              <a
                className="text-blue-500 text-center"
                onClick={() => {
                  navigate("/register");
                }}
              >
                Already have an account? Login here
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
