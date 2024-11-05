import { Button, Card, Flex, Typography } from 'antd';
// import React from 'react';

const DashboardBanner = ( { darkMode, onCreate }) => {
  const styles = {
    creatBtn: {
      background: darkMode ? "#444" : 'linear-gradient(to right, #ffafbd, #ffc3a0)',
      border: 'none',
    },
    bannerCard: {
      height: 260,
      padding: "20px",
      backgroundColor: darkMode ? "#113536" : "#fff",
      color: darkMode ? "#f5f5f5" : "#000",
    }
  }

  return (
    <Card style={styles.bannerCard}>
      <Flex vertical gap="30px">
        <Flex vertical align="flex-start">
          <Typography.Title level={2} strong style={{ fontFamily: 'Quicksand, sans-serif', fontStyle: 'italic' }}>
            Create your new presentations 
          </Typography.Title>
          <Typography.Text type='secondary' strong style={{ fontFamily: 'Quicksand, sans-serif', fontStyle: 'italic' }}>
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