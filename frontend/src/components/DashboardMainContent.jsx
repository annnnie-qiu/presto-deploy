import { Flex } from 'antd';
// import React from 'react';
import DashboardBanner from './DashboardBanner';
import DashboardPresentationList from './DashboardPresentationList';

const DashboardMainContent = ({ presentations, refetchPresentations, onCreate }) => {
  return (
    <div style={{ flex: 1}}>
      <Flex vertical gap="2.3rem">
        <DashboardBanner onCreate={onCreate} />
        <DashboardPresentationList 
          presentations={presentations} 
          // setPresentations={setPresentations}
          refetchPresentations={refetchPresentations}
        />
      </Flex>
    </div>
  )
}

export default DashboardMainContent;