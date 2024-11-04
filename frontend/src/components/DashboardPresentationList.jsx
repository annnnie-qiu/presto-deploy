import React from "react";
import { Button, Flex, Typography, Row, Col, Modal, Input } from "antd";
import { Avatar, Card } from "antd";
import {
  EditOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

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
    navigate(`/presentation/${id}`)
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
    setIsModalVisible(false);
  };

  const styles = {
    headerFlex: {
      alignItems: "center",
      justifyContent: "space-between",
    },
    row: {
      marginTop: "20px",
    },
    col: {
      display: "flex",
      justifyContent: "center",
    },
    cardWrapper: {
      width: '100%',
      aspectRatio: '2 / 1',
      minWidth: '100px',
      position: 'relative',
    },
    card: {
      width: '100%',
      height: '100%',
      position: 'absolute',
      top: 0,
      left: 0,
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
    cardImage: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
    },
  };

  return (
    <>
      <Flex style={styles.headerFlex}>
        <Typography.Title level={3} strong>
          Your Presentation List
        </Typography.Title>
        <Button type="link">View All</Button>
      </Flex>

      <Row gutter={[16, 16]} style={styles.row}>
        {presentations.map((presentation) => (
          <Col
            key={presentation.id}
            xs={24}
            sm={12}
            md={8}
            lg={6}
            xl={4}
            style={styles.col}
          >
            <div style={styles.cardWrapper}>
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
                      <Avatar
                        shape="square"
                        style={styles.emptyThumbnail}
                      />
                    )
                  }
                  title={presentation.name}
                  description={
                    <>
                      <div>{presentation.description || "No description available"}</div>
                      <div>Slides: {presentation.numSlides}</div>
                    </>
                  }
                />
              </Card>
              <Button
                type="text"
                icon={<EditOutlined />}
                onClick={(e) => handleEditClick(e, presentation)} // Prevents navigation when icon is clicked
              />
            </div>
          </Col>
        ))}
      </Row>
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
