import React from "react";
import { Avatar, Flex, Typography } from 'antd';
import Search from 'antd/es/transfer/search';
import { MessageOutlined, NotificationOutlined, UserOutlined} from '@ant-design/icons'

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

  return (
    <Flex align="center" justify="space-between">
      <Typography.Title level={3} type="secondary">
        Welcome back
      </Typography.Title>

      <Flex align="center" gap="3rem">
        <Search placeholder="Search" allowClear />

        <Flex align="center" gap="10px">
          <MessageOutlined style={styles.headerIcon} />
          <NotificationOutlined style={styles.headerIcon} />
          <Avatar icon={<UserOutlined />} />
        </Flex>
      </Flex>
    </Flex>
  );
}

export default HeaherPresent;
