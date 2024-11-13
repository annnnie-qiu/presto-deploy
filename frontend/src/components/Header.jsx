import React from 'react'
import { Avatar, Flex, Typography } from 'antd';
import Search from 'antd/es/transfer/search';
import { UserOutlined} from '@ant-design/icons';
import { FaMoon, FaSun } from "react-icons/fa";

const CustomHeader = ({ darkMode, toggleDarkMode, style }) => {
  const styles = {
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
      marginLeft: "30px"
    }
  }

  return (
    <Flex align="center" justify="space-between" style={style}>
      <Typography.Title level={3} type="secondary" style={styles.welcomeMessage}>
        Welcome back
      </Typography.Title>

      <Flex align="center" gap="3rem">
        <Search placeholder="Search" allowClear />

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