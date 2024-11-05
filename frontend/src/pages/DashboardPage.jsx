import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Flex, Layout, Modal, Input } from "antd";
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons";
import Sidebar from "../components/Sidebar";
import CustomHeader from "../components/Header";
import DashboardMainContent from "../components/DashboardMainContent";
import sendDetail from "../../utils/API/Send_ReceiveDetail/send_receiveDetail";
import { getDetail } from "../../utils/API/Send_ReceiveDetail/send_receiveDetail";
// import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import ToastNotification from "../components/ToastNotification";
import { showErrorToast, showSuccessToast } from "../../utils/toastUtils";
import { apiCall } from "../../utils/API/apiCall";
// import DashboardSideContent from '../components/DashboardSideContent';

const { Sider, Header, Content } = Layout;

function DashboardPage({ darkMode, toggleDarkMode }) {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [collapsed, setCollapsed] = React.useState(false);
  // const [presentations, setPresentations] = React.useState([
  //   {
  //     id: 1,
  //     name: "Presentation 1",
  //     thumbnail: "",
  //     description: "This is the description",
  //     numSlides: 1,
  //   },
  // ]);
  const [presentations, setPresentations] = React.useState([]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newPresentationName, setNewPresentationName] = useState("");

  // Function to refetch presentations
  const refetchPresentations = React.useCallback(async () => {
    try {
      const response = await getDetail(token);
      console.log("Response from /store:", response);
      const presentations = response.store?.presentations || [];
      setPresentations(presentations);
    } catch (error) {
      console.error("Error fetching presentations:", error);
      showErrorToast("Failed to load presentations");
    }
  }, [token, setPresentations]);

  // Fetch presentations when the component loads
  React.useEffect(() => {
    // If no token is found, navigate back to the login page.
    if (!token) {
      navigate("/login");
    } else {
      refetchPresentations(); // Fetch presentations when the component mounts
    }
  }, [token, navigate, refetchPresentations]);

  const styles = {
    layout: {
      minHeight: "100vh",
      backgroundColor: darkMode ? "#203175" : "#fff",
    },
    sider: {
      position: "sticky !important",
      left: 0,
      bottom: 0,
      top: 0,
      backgroundColor: darkMode ? "#113536" : "#fff",
    },
    header: {
      paddingTop: "20px",
      // backgroundColor: "#fff",
      backgroundColor: darkMode ? "#113536" : "white",
    },
    content: {
      margin: "24px 16px",
      padding: "20px",
      backgroundColor: darkMode ? "#113536" : "",
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

  // Function to handle showing the modal
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setNewPresentationName("");
  };

  // Function to handle the create button by 'Enter' key
  const handleEnterKeyPress = (e) => {
    if (e.key === "Enter") {
      handleCreateNewPresentation();
    }
  };

  const handleCreateNewPresentation = async () => {
    if (newPresentationName.trim() === "") {
      showErrorToast("Please provide a name for your new presentation.");
      return;
    }

    const newPresentation = {
      id: presentations.length + 1,
      name: newPresentationName,
      thumbnail: "",
      description: "",
      numSlides: 1,
      nextSlideId: 2,
      slides: [
        {
          slideId: 1,
          content: "",
        },
      ],
    };

    try {
      // Get the current store details
      const response = await getDetail(token);
      const { store } = response;

      // Update the presentations list in the store with the new presentation
      const updatedPresentations = [
        ...(store.presentations || []),
        newPresentation,
      ];
      store.presentations = updatedPresentations;

      // Use PUT to update the store via the API
      await sendDetail(token, store);

      refetchPresentations();
      showSuccessToast("🦄 Presentation created successfully!");
    } catch (error) {
      console.error("Error creating presentation:", error);
      showErrorToast("Failed to create the presentation.");
    }

    setIsModalVisible(false);
    setNewPresentationName(""); // Reset input
  };

  return (
    <Layout style={styles.layout}>
      <Sider
        theme="light"
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={styles.sider}
      >
        <Sidebar darkMode={darkMode} />

        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          style={styles.trigerbtn}
        />
      </Sider>
      <Layout>
        {/* <Header style={styles.header}>
          <CustomHeader />
        </Header> */}
        <CustomHeader style={styles.header} darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        <Content style={styles.content}>
          <Flex gap="large">
            <DashboardMainContent
              presentations={presentations}
              onCreate={showModal}
              setPresentations={setPresentations}
              refetchPresentations={refetchPresentations}
            />
            {/* <DashboardSideContent /> */}
          </Flex>
        </Content>
      </Layout>

      {/* Modal for Creating New Presentation */}
      <Modal
        title="Create New Presentation"
        open={isModalVisible}
        onOk={handleCreateNewPresentation}
        onCancel={handleCancel}
        okText="Create"
      >
        <Input
          placeholder="Enter presentation name"
          value={newPresentationName}
          onChange={(e) => setNewPresentationName(e.target.value)}
          onKeyDown={handleEnterKeyPress}
        />
      </Modal>

      {/* Include ToastNotification to handle toast notifications */}
      <ToastNotification />
    </Layout>
  );
}

export default DashboardPage;
