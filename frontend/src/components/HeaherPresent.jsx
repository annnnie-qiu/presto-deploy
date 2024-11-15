import React, { useState } from "react";
import { Avatar, Flex, Typography, Modal, Tooltip, Input, Button } from "antd";
import { useNavigate } from "react-router-dom";
import { DeleteTwoTone, CloudUploadOutlined } from "@ant-design/icons";
import Search from "antd/es/transfer/search";
import {
  MessageOutlined,
  NotificationOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useParams } from "react-router-dom";
import { getDetail } from "../../utils/API/Send_ReceiveDetail/send_receiveDetail";
import sendDetail from "../../utils/API/Send_ReceiveDetail/send_receiveDetail";
import ToastNotification from "../components/ToastNotification";
import { showErrorToast, showSuccessToast } from "../../utils/toastUtils";

function HeaherPresent() {
  const styles = {
    headerIcon: {
      backgroundColor: "#d2e3c8",
      padding: "8px",
      borderRadius: "4px",
      fontSize: "15px",
      color: "#4f6f52",
      cursor: "pointer",
    },
    uploadThumbnail: {
      opacity: "0",
      position: "absolute",
      width: "100%",
      height: "100%",
      cursor: "pointer",
    }
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updateDetails, setUpdateDetails] = useState({});
  const navigate = useNavigate();

  const showModal = () => {
    setIsModalOpen(true);
  };

  const { presentationId } = useParams();
  const [currentPresentation, setCurrentPresentation] =
    React.useState(undefined);

  const handleOk = () => {
    setIsModalOpen(false);
    // delete the presentation from the backend and navigate to the dashboard
    const { store } = updateDetails;
    // pop out the presentation with the given ID
    store.presentations = store.presentations.filter(
      (presentation) => presentation.id != presentationId
    );

    // update to the backend
    sendDetail(localStorage.getItem("token"), store),
    // navigate to the dashboard
    navigate(`/dashboard`);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  // Function to handle the thumbnail upload
  const handleThumbnailUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result;

      try {
        const storeResponse = await getDetail(localStorage.getItem("token"));
        const { store } = storeResponse;

        // Find and update the current presentation with the new thumbnail base64 string
        store.presentations = store.presentations.map((presentation) => {
          if (presentation.id === parseInt(presentationId, 10)) {
            return {
              ...presentation,
              thumbnail: base64String,
            };
          }
          return presentation;
        });

        // Update the state with the new presentation
        setCurrentPresentation((prev) => ({
          ...prev,
          thumbnail: base64String,
        }));

        // Send the updated 'store' data to the backend to hold this change
        await sendDetail(localStorage.getItem("token"), store);
        showSuccessToast("Thumbnail uploaded successfully!");
      } catch (error) {
        console.error("Error updating thumbnail:", error);
        showErrorToast("Failed to upload thumbnail :(");
      }
    };

    reader.readAsDataURL(file);
  };

  // get the current slides from the backend
  React.useEffect(() => {
    const getPresentationDetail = async () => {
      const response = await getDetail(localStorage.getItem("token"));
      setUpdateDetails(response);
      const { store } = response;
      // Get the presentation with the given ID
      const presentation = store.presentations.find(
        (presentation) => presentation.id == presentationId
      );

      // Get the current presentation and slides
      setCurrentPresentation(presentation);
    };
    getPresentationDetail();
  }, []);

  return (
    <Flex align="center" justify="space-between">
      <Typography.Title level={3} type="secondary">
        <div className="flex gap-1">
          {/* display the current presentation name */}
          <Input
            value={currentPresentation?.name}
            onChange={(text) => {
              console.log("text", text.target.value);
              console.log("currentPresentation", currentPresentation);
              // update the name in the backend
              const { store } = updateDetails;
              console.log("store", store);
              // update the name of the presentation with the given ID
              store.presentations = store.presentations.map((presentation) =>{
                if (presentation.id == presentationId) {
                  // Update the name
                  return {
                    ...presentation,
                    name: text.target.value,
                  };
                }
                return presentation;
              });
              console.log("store", store);
              // update the current presentation name
              setCurrentPresentation({
                ...currentPresentation,
                name: text.target.value,
              });
              // update to the backend
              sendDetail(localStorage.getItem("token"), store);
            }}
          />
          {/* display the delete presentation icon */}
          <Tooltip placement="right" title={"Delete the current presentation"}>
            <DeleteTwoTone className="pl-2 text-sm" onClick={showModal} />
          </Tooltip>

          {/* Upload Thumbnail Icon */}
          <Tooltip placement="right" title={"Upload Thumbnail"}>
            <Button type="text" icon={<CloudUploadOutlined />}>
              <input
                type="file"
                accept="image/*"
                style={styles.uploadThumbnail}
                onChange={handleThumbnailUpload}
              />
            </Button>
          </Tooltip>
        </div>
      </Typography.Title>

      <Flex align="center" gap="3rem">
        <Search placeholder="Search" allowClear />

        <Flex align="center" gap="10px">
          <MessageOutlined style={styles.headerIcon} />
          <NotificationOutlined style={styles.headerIcon} />
          <Avatar icon={<UserOutlined />} />
        </Flex>
      </Flex>
      <Modal
        title="Delete Presentation"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Yes"
        cancelText="No"
      >
        <p>Are you sure?</p>
      </Modal>
      {/* Include ToastNotification to handle toast notifications */}
      <ToastNotification />
    </Flex>
  );
}

export default HeaherPresent;
