import { Button, Card, Flex, Typography } from 'antd';
import React from 'react'

const DashboardBanner = ( { onCreate }) => {
  const styles = {
    creatBtn: {
      background: 'linear-gradient(to right, #ffafbd, #ffc3a0)',
      border: 'none',
    }
  }

  return (
    <Card style={{ height: 260, padding: "20px" }}>
      <Flex vertical gap="30px">
        <Flex vertical align="flex-start">
          <Typography.Title level={2} strong>
            Create your new presentations 
          </Typography.Title>
          <Typography.Text type='secondary' strong>
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