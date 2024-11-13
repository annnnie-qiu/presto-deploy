import React from 'react'
import { Avatar, Flex, Typography } from 'antd';
import Search from 'antd/es/transfer/search';
import { UserOutlined} from '@ant-design/icons';
import { FaMoon, FaSun } from "react-icons/fa";

const CustomHeader = ({ darkMode, toggleDarkMode, style }) => {
  // State to track window width
  const [windowWidth, setWindowWidth] = React.useState(window.innerWidth);

  // Effect to update window width on resize
  React.useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);

    window.addEventListener('resize', handleResize);
    // Cleanup event listener on component unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const styles = {
    headerContainer: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      height: "60px", // Fixed height for the header
      padding: "0 15px",
      boxSizing: "border-box",
      overflow: "hidden",
      backgroundColor: darkMode ? "#113536" : "#fff",
      width: "100%",
    },
    headerIcon: {
      backgroundColor: '#d2e3c8',
      padding: '8px',
      borderRadius: '4px',
      fontSize: '15px',
      color: '#4f6f52',
      cursor: 'pointer',
    },
    modeBtn: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      fontSize: '20px',
      color: darkMode ? '#ffdd57' : '#4f6f52',
    },
    welcomeMessage: {
      display: windowWidth <= 500 ? "none" : "block",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      margin: 0,
      fontSize: windowWidth <= 600 ? "16px" : "24px",
      flexShrink: 1,
    },
    searchBox: {
      flexGrow: 1,
      maxWidth: "200px", // Limit width of the search box
      marginRight: "10px",
      display: windowWidth <= 600 ? "none" : "block",
    },
  }

  return (
    <Flex align="center" justify="space-between" style={{ ...styles.headerContainer, ...style }}>
      <Typography.Title level={3} type="secondary" style={styles.welcomeMessage}>
        Welcome back
      </Typography.Title>

      <Flex align="center" gap="3rem">
        <Search placeholder="Search" allowClear style={styles.searchBox}/>

        <Flex align="center" gap="10px">
          {/* <MessageOutlined style={styles.headerIcon} />
          <NotificationOutlined style={styles.headerIcon} /> */}
          <button 
            style={styles.modeBtn}
            onClick={toggleDarkMode}
          >{darkMode ? <FaSun/> : <FaMoon />}
          </button>
          <Avatar icon={<UserOutlined />}/>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default CustomHeader;