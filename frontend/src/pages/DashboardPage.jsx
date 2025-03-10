import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Flex, Layout, Modal, Input, Upload } from "antd";
import { MenuUnfoldOutlined, MenuFoldOutlined, UploadOutlined } from "@ant-design/icons";
import Sidebar from "../components/Sidebar";
import CustomHeader from "../components/Header";
import DashboardMainContent from "../components/DashboardMainContent";
import sendDetail from "../../utils/API/Send_ReceiveDetail/send_receiveDetail";
import { getDetail } from "../../utils/API/Send_ReceiveDetail/send_receiveDetail";
import "react-toastify/dist/ReactToastify.css";
import ToastNotification from "../components/ToastNotification";
import { showErrorToast, showSuccessToast } from "../../utils/toastUtils";

const { Sider, Content } = Layout;

function DashboardPage({ darkMode, toggleDarkMode }) {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [collapsed, setCollapsed] = React.useState(false);

  const [presentations, setPresentations] = React.useState([]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newPresentationName, setNewPresentationName] = useState("");
  const [newPresentationDescription, setNewPresentationDescription] = useState("");
  const [newPresentationThumbnail, setNewPresentationThumbnail] = useState("");

  // Function to refetch presentations
  const refetchPresentations = React.useCallback(async () => {
    try {
      const response = await getDetail(token);
      const presentations = response.store?.presentations || [];
      setPresentations(presentations);
    } catch (error) {
      showErrorToast("Failed to load presentations", error.message);
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
      overflowX: "hidden", // Prevent horizontal scrolling
    },
    sider: {
      position: "sticky",
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
      boxSizing: "border-box", // Include padding in the width calculations
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
    setNewPresentationDescription("");
    setNewPresentationThumbnail("");
  };

  const debounceTimeout = useRef(null);

  // Function to handle the create button by 'Enter' key
  const handleEnterKeyPress = (e) => {
    if (e.key === "Enter") {
      // clear the previous timer
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
      
      // set a new timer debounce
      debounceTimeout.current = setTimeout(() => {
        handleCreateNewPresentation();
      }, 500); // set a 500ms debounce
    }
  };

  const handleThumbnailUpload = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setNewPresentationThumbnail(e.target.result);
    };
    reader.readAsDataURL(file);
    return false; // Prevent default upload behavior
  };

  const handleCreateNewPresentation = async () => {
    if (newPresentationName.trim() === "") {
      showErrorToast("Please provide a name for your new presentation.");
      return;
    }

    const newPresentation = {
      id: presentations.length + 1,
      name: newPresentationName,
      // thumbnail: newThumbnailReference,
      thumbnail: newPresentationThumbnail, // Directly store the base64 thumbnail
      description: newPresentationDescription,
      numSlides: 1,
      nextSlideId: 2,
      slides: [
        {
          slideId: 1,
          content: [],
          nextElementId: 1,
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

    // Reset input
    setIsModalVisible(false);
    setNewPresentationName("");
    setNewPresentationDescription("");
    setNewPresentationThumbnail("");
    document.querySelector('.ant-upload-list-item')?.remove(); // try to remove the scr list?
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
        <Sidebar darkMode={darkMode} presentations={presentations} />

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
        {/* <Input
          placeholder="Enter presentation name"
          value={newPresentationName}
          onChange={(e) => setNewPresentationName(e.target.value)}
          onKeyDown={handleEnterKeyPress}
        /> */}
        <div style={{ marginBottom: "10px" }}>
          <Input
            name="name"
            placeholder="Enter presentation name"
            value={newPresentationName}
            onChange={(e) => setNewPresentationName(e.target.value)}
            onKeyDown={handleEnterKeyPress}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <Input.TextArea
            name="description"
            placeholder="Enter presentation description"
            value={newPresentationDescription}
            onChange={(e) => setNewPresentationDescription(e.target.value)}
            rows={4}
            // onKeyDown={handleEnterKeyPress}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <Upload beforeUpload={handleThumbnailUpload} accept="image/*">
            <Button icon={<UploadOutlined />}>Upload Thumbnail</Button>
          </Upload>
          {newPresentationThumbnail && (
            <img
              src={newPresentationThumbnail}
              alt="Thumbnail Preview"
              style={{ width: "100%", marginTop: 10 }}
            />
          )}
        </div>
      </Modal>

      {/* Include ToastNotification to handle toast notifications */}
      <ToastNotification />
    </Layout>
  );
}

export default DashboardPage;
