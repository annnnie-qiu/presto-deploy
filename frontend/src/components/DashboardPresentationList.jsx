import React from "react";
import { Button, Typography, Modal, Input } from "antd";
import { Avatar, Card } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import sendDetail from "../../utils/API/Send_ReceiveDetail/send_receiveDetail";
// import { apiCall } from "../../utils/API/apiCall";
import { showErrorToast, showSuccessToast } from "../../utils/toastUtils";
import { getDetail } from "../../utils/API/Send_ReceiveDetail/send_receiveDetail";

const { Meta } = Card;

const DashboardPresentationList = ({
  presentations = [],
  darkMode,
  refetchPresentations,
}) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

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

  // Function to handle the edit button click
  const handleEnterKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSave();
    }
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
  const handleSave = async () => {
    if (currentPresentation) {
      try {
        const updatedPresentation = {
          ...currentPresentation,
          name: presentationUpdates.name,
          description: presentationUpdates.description,
        };

        // Use the updated sendDetail to only modify the relevant presentation in the store
        try {
          // Get the current store details
          const response = await getDetail(token);
          const { store } = response;

          // Find the existing presentation by ID and update it
          store.presentations = store.presentations.map((presentation) =>
            presentation.id === updatedPresentation.id
              ? updatedPresentation
              : presentation
          );

          // Use sendDetail to update the entire store with the modified presentations list
          await sendDetail(token, store);

          await refetchPresentations(); // Refetch to update the local state
          // showSuccessToast("Presentation updated successfully!");
        } catch (error) {
          console.error("Error updating presentation:", error);
          // showErrorToast("Failed to update the presentation.");
        }

        await refetchPresentations(); // Refetch to update the local state
        showSuccessToast("Presentation updated successfully!");
      } catch (error) {
        console.error("Error updating presentation:", error);
        showErrorToast("Failed to update the presentation.");
      }
    }
    setIsModalVisible(false);
  };

  // Function to get the thumbnail from localStorage when displaying the presentation
  const getThumbnail = (thumbnailReference) => {
    if (thumbnailReference && localStorage.getItem(thumbnailReference)) {
      return localStorage.getItem(thumbnailReference);
    }
    return null;
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
        {presentations.length > 0 ? (
          presentations.map((presentation, index) =>
            presentation ? (
              <div
                key={`${presentation.id}-${index}`}
                style={styles.cardWrapper}
              >
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
                          src={getThumbnail(presentation.thumbnail)}
                          alt={presentation.name}
                          style={styles.thumbnail}
                        />
                      ) : (
                        <Avatar shape="square" style={styles.emptyThumbnail} />
                      )
                    }
                    title={presentation.name || "Untitled Presentation"}
                    description={
                      <>
                        <div style={styles.description}>
                          {presentation.description ||
                            "No description available"}
                        </div>
                        <div style={styles.numSlides}>
                          Slides: {presentation.numSlides || 0}
                        </div>
                      </>
                    }
                  />
                </Card>
                <Button
                  style={styles.editBtn}
                  type="text"
                  icon={<EditOutlined />}
                  onClick={(e) => handleEditClick(e, presentation)}
                />
              </div>
            ) : null
          )
        ) : (
          <Typography.Text>
            No presentations available. Create a new one!
          </Typography.Text>
        )}
      </div>

      {/* Modal for quick editing presentation details */}
      <Modal
        title="Modify the name or description?"
        open={isModalVisible}
        onOk={handleSave}
        onCancel={() => setIsModalVisible(false)}
        okText="Save"
      >
        <div style={{ marginBottom: "10px" }}>
          <Typography.Text strong>Name:</Typography.Text>
          <Input
            name="name"
            placeholder="Enter presentation name"
            value={presentationUpdates.name}
            onChange={handleInputChange}
            onKeyDown={handleEnterKeyPress}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <Typography.Text strong>Description:</Typography.Text>
          <Input.TextArea
            name="description"
            placeholder="Enter presentation description"
            value={presentationUpdates.description}
            onChange={handleInputChange}
            onKeyDown={handleEnterKeyPress}
            rows={4}
          />
        </div>
      </Modal>
    </>
  );
};

export default DashboardPresentationList;
