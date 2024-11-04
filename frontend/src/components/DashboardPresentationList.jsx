import React from "react";
import { Button, Flex, Typography, Row, Col } from "antd";
import { Avatar, Card } from "antd";
import {
  EditOutlined,
  EllipsisOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Meta } = Card;

const DashboardPresentationList = ({ presentations = [] }) => {
  // Styles moved to the top
  const navigate = useNavigate();
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
    card: {
      width: "100%",
      aspectRatio: "2 / 1",
      minWidth: "100px",
    },
    cardCoverContainer: (hasThumbnail) => ({
      backgroundColor: hasThumbnail ? "transparent" : "#ccc",
      height: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }),
    emptyThumbnail: {
      width: "80%",
      height: "80%",
      backgroundColor: "gray",
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
            <Card
              style={styles.card}
              cover={
                <div
                  style={styles.cardCoverContainer(!!presentation.thumbnail)}
                >
                  {presentation.thumbnail ? (
                    <img
                      alt={presentation.name}
                      src={presentation.thumbnail}
                      style={styles.cardImage}
                    />
                  ) : (
                    <div style={styles.emptyThumbnail}></div>
                  )}
                </div>
              }
              actions={[
                <SettingOutlined key="setting" />,
                <EditOutlined
                  key="edit"
                  onClick={() => {
                    console.log("Edit presentation", presentation.id);
                    navigate(`/presentation/${presentation.id}`);
                    console.log("navigate TO NEW PAGE");
                  }}
                />,
                <EllipsisOutlined key="ellipsis" />,
              ]}
            >
              <Meta
                avatar={
                  <Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=8" />
                }
                title={presentation.name}
                description={
                  <>
                    <div>
                      {presentation.description || "No description available"}
                    </div>
                    <div>Slides: {presentation.numSlides}</div>
                  </>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
};

export default DashboardPresentationList;
