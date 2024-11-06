import React, { useState } from "react";
import { Avatar, Flex, Typography, Modal, Tooltip, Input } from "antd";
import { useNavigate } from "react-router-dom";
import { DeleteTwoTone } from "@ant-design/icons";
import Search from "antd/es/transfer/search";
import {
  MessageOutlined,
  NotificationOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useParams } from "react-router-dom";
import { getDetail } from "../../utils/API/Send_ReceiveDetail/send_receiveDetail";
import sendDetail from "../../utils/API/Send_ReceiveDetail/send_receiveDetail";

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

  const [newPresentationName, setNewPresentationName] = useState("");

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
              // update the current presentation na,e
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
    </Flex>
  );
}

export default HeaherPresent;
