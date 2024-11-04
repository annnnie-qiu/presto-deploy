import React from "react";
import { Button, Flex, Typography, Row, Col, Modal, Input } from "antd";
import { Avatar, Card } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import sendDetail from "../../utils/API/Send_ReceiveDetail/send_receiveDetail";

const { Meta } = Card;

const DashboardPresentationList = ({ presentations = [] }) => {
  const navigate = useNavigate();

  // State for modal visibiliy and currently selected presentation
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [currentPresentation, setCurrentPresentation] = React.useState(null);
  const [presentationUpdates, setPresentationUpdates] = React.useState({
    name: "",
    description: "",
  });

  // Function to naviagte to the specific presentation page
  const handleCardClick = (id) => {
    navigate(`/presentation/${id}`);
  };

  const handleEditClick = (e, presentation) => {
    // Prevent navigation when the edit icon is clicked
    e.stopPropagation();
    setCurrentPresentation(presentation);
    setPresentationUpdates({
      name: presentation.name,
      description: presentation.description,
    });
    setIsModalVisible(true);
  };

  // Function to handle input changes in the modal
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPresentationUpdates((prev) => ({ ...prev, [name]: value }));
  };

  // Function to handle modal save
  const handleSave = () => {
    if (currentPresentation) {
      currentPresentation.name = presentationUpdates.name;
      currentPresentation.description = presentationUpdates.description;
    }
    // send the updated presentation to the backend
    const token = localStorage.getItem("token");
    sendDetail(
      token,
      currentPresentation.id,
      presentationUpdates.name,
      presentationUpdates.description,
      currentPresentation.thumbnail
    );
    setIsModalVisible(false);
  };

  const styles = {
    headerFlex: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: "20px",
    },
    gridContainer: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(100px, 300px))",
      gap: "24px",
      marginTop: "20px",
    },
    cardWrapper: {
      width: "100%",
      aspectRatio: "2 / 1",
      position: "relative",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      maxWidth: "400px",
    },
    card: {
      width: "100%",
      height: "100%",
      position: "relative",
      // overflow: "hidden",
      flex: "1 1 auto",
    },
    thumbnail: {
      width: 45,
      height: 45,
    },
    emptyThumbnail: {
      width: 45,
      height: 45,
      backgroundColor: "#ccc",
    },
    description: {
      maxHeight: "40px",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    },
    numSlides: {
      maxHeight: "40px",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    },
    editBtn: {
      marginTop: "-30px",
    },
  };

  return (
    <>
      <div style={styles.headerFlex}>
        <Typography.Title level={3} strong>
          Your Presentation List
        </Typography.Title>
        <Button type="link">View All</Button>
      </div>

      {/* Grid layout for consistent spacing without overlapping */}
      <div style={styles.gridContainer}>
        {presentations.map((presentation) => (
          <div key={presentation.id} style={styles.cardWrapper}>
            <Card
              onClick={() => handleCardClick(presentation.id)}
              hoverable
              style={styles.card}
            >
              <Meta
                avatar={
                  presentation.thumbnail ? (
                    <Avatar
                      shape="square"
                      src={presentation.thumbnail}
                      alt={presentation.name}
                      style={styles.thumbnail}
                    />
                  ) : (
                    <Avatar shape="square" style={styles.emptyThumbnail} />
                  )
                }
                title={presentation.name}
                description={
                  <>
                    <div style={styles.description}>
                      {presentation.description || "No description available"}
                    </div>
                    <div style={styles.numSlides}>
                      Slides: {presentation.numSlides}
                    </div>
                  </>
                }
              />
            </Card>
            <Button
              style={styles.editBtn}
              type="text"
              icon={<EditOutlined />}
              onClick={(e) => handleEditClick(e, presentation)} // Prevents navigation when icon is clicked
            />
          </div>
        ))}
      </div>

      {/* Modal for quick editing presentation details */}
      <Modal
        title="Modify the name or description?"
        open={isModalVisible}
        onOk={handleSave}
        onCancel={() => setIsModalVisible(false)}
        okText="Save"
      >
        <Input
          name="name"
          placeholder="Enter presentation name"
          value={presentationUpdates.name}
          onChange={handleInputChange}
        />
        <Input.TextArea
          name="description"
          placeholder="Enter presentation description"
          value={presentationUpdates.description}
          onChange={handleInputChange}
          rows={4}
        />
      </Modal>
    </>
  );
};

export default DashboardPresentationList;
