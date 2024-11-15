import React, { useEffect } from "react";
import { Button, Layout, Checkbox, Form, Input, Typography } from "antd";
const { Sider } = Layout;
import Sidebar from "../components/Sidebar";

function SettingPage() {
  const styles = {
    sider: {
      height: "100vh",
      position: "sticky !important",
      left: 0,
      bottom: 0,
      top: 0,
    },
    header: {
      paddingTop: "12px",
      backgroundColor: "#fff",
    },
    content: {
      margin: "24px 16px",
      padding: "20px",
    },
    trigerbtn: {
      fontSize: "16px",
      width: "50px",
      height: "50px",
      position: "fixed",
      bottom: "10px",
      left: "10px",
    },
  };

  const onFinish = (values) => {
    console.log("Success:", values);
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const [windowWidth, setWindowWidth] = React.useState(window.innerWidth);
  const [showDetail, setShowDetail] = React.useState(false);

  // Effect to track window resizing
  React.useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  // get token from local storage
  //   const token = localStorage.getItem("token");
  //   useEffect(() => {

  //     const detail = await getDetail(token);
  //     console.log(detail);
  //     }
  //     };

  return (
    <Layout style={styles.layout}>
      <Sider theme="light" trigger={null} style={styles.sider}>
        <Sidebar />

        <Button type="text" style={styles.trigerbtn} />
      </Sider>

      <Layout className="flex flex-col h-screen m-10">
        <Typography.Title
          level={2}
          strong
          style={{
            ...styles.titleText,
            fontFamily: "Quicksand, sans-serif",
            fontStyle: "italic",
            alignSelf: "center",
            justifySelf: "center",
            color: "#ffafbd",
          }}
        >
          Setting
        </Typography.Title>

        <Button
          style={{
            background: "linear-gradient(to right, #ffafbd, #ffc3a0)",
            border: "none",
            alignSelf: windowWidth <= 600 ? "center" : "flex-start",
            fontSize: windowWidth <= 600 ? "14px" : "16px",
            marginTop: windowWidth <= 600 ? "10px" : "0",
            marginBottom: "20px",
            alignSelf: "center",
            justifySelf: "center",
          }}
        >
          check here to motifiy your setting
        </Button>

        {showDetail && (
          <Form
            name="basic"
            labelCol={{
              span: 8,
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
              label="Username"
              name="username"
              rules={[
                {
                  required: true,
                  message: "Please input your username!",
                },
              ]}
            >
              <Input />
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
              <Input.Password />
            </Form.Item>

            <Form.Item label={null} className="justify-center">
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        )}
      </Layout>
    </Layout>
  );
}

export default SettingPage;
