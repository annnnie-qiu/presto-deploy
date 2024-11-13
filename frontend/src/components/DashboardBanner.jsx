import { Button, Card, Flex, Typography } from 'antd';
import React from 'react';

const DashboardBanner = ( { darkMode, onCreate }) => {
  const [windowWidth, setWindowWidth] = React.useState(window.innerWidth);

  // Effect to track window resizing
  React.useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const styles = {
    bannerCard: {
      height: windowWidth <= 600 ? "auto" : 260,
      padding: windowWidth <= 600 ? "15px" : "20px",
      backgroundColor: darkMode ? "#113536" : "#fff",
      color: darkMode ? "#f5f5f5" : "#000",
      maxWidth: "100%",
      marginBottom: "20px",
      marginLeft: windowWidth < 450 ? "-20px" : "0",
    },
    creatBtn: {
      background: darkMode ? "#444" : 'linear-gradient(to right, #ffafbd, #ffc3a0)',
      border: 'none',
      alignSelf: windowWidth <= 600 ? "center" : "flex-start",
      fontSize: windowWidth <= 600 ? "14px" : "16px",
      marginTop: windowWidth <= 600 ? "10px" : "0",
    },
    titleText: {
      fontSize: windowWidth <= 600 ? "20px" : "24px",
      textAlign: windowWidth <= 600 ? "center" : "left",
    },
    descriptionText: {
      fontSize: windowWidth <= 600 ? "14px" : "16px",
      textAlign: windowWidth <= 600 ? "center" : "left",
    },
  }

  return (
    <Card style={styles.bannerCard}>
      <Flex vertical gap="30px">
        <Flex vertical align="flex-start">
          {/* <Typography.Title level={2} strong style={{ fontFamily: 'Quicksand, sans-serif', fontStyle: 'italic' }}> */}
          <Typography.Title
            level={2}
            strong
            style={{ ...styles.titleText, fontFamily: "Quicksand, sans-serif", fontStyle: "italic" }}
          >
            Create your new presentations 
          </Typography.Title>
          {/* <Typography.Text type='secondary' strong style={{ fontFamily: 'Quicksand, sans-serif', fontStyle: 'italic' }}> */}
          <Typography.Text
            type="secondary"
            strong
            style={{ ...styles.descriptionText, fontFamily: "Quicksand, sans-serif", fontStyle: "italic" }}
          >
            Prestro makes everthing happen
          </Typography.Text>
        </Flex>

        <Flex gap="large">
          <Button type="primary" style={styles.creatBtn} size="large" onClick={onCreate}>New presentation</Button>
        </Flex>
      </Flex>
    </Card>
  )
}

export default DashboardBanner;