import { Flex } from 'antd'
import React from 'react'
import DashboardBanner from './DashboardBanner';

const DashboardMainContent = () => {
  return (
    <div style={{ flex: 1}}>
      <Flex vertical gap="2.3rem">
        <DashboardBanner />
      </Flex>
    </div>
  )
}

export default DashboardMainContent;