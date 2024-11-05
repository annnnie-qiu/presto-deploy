import React, { useState } from "react";
import { Avatar, Flex, Typography, Button, Modal } from "antd";
import { DeleteTwoTone } from "@ant-design/icons";
import Search from "antd/es/transfer/search";
import {
  MessageOutlined,
  NotificationOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useParams } from "react-router-dom";
import { getDetail } from "../../utils/API/Send_ReceiveDetail/send_receiveDetail";

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

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const { presentationId } = useParams();
  const [currentPresentation, setCurrentPresentation] =
    React.useState(undefined);

  // get the current slides from the backend
  React.useEffect(() => {
    const getPresentationDetail = async () => {
      const response = await getDetail(localStorage.getItem("token"));
      console.log("response:", response);
      const { store } = response;
      console.log("store:", store);
      // Get the presentation with the given ID
      const presentation = store.presentations.find(
        (presentation) => presentation.id == presentationId
      );

      // Get the current presentation and slides
      console.log("presentation:", presentation);
      setCurrentPresentation(presentation);
      // console.log("currentPresentation:", currentPresentation);
      // console.log("currentPresentation.name:", currentPresentation.name);
    };
    getPresentationDetail();
  }, []);

  return (
    <Flex align="center" justify="space-between">
      <Typography.Title level={3} type="secondary">
        {currentPresentation?.name}
        <DeleteTwoTone className="pl-2 text-sm" onClick={showModal} />
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
        title="Basic Modal"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Modal>
    </Flex>
  );
}

export default HeaherPresent;
