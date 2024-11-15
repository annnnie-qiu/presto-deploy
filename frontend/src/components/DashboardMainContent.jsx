import { Flex } from 'antd';
import DashboardBanner from './DashboardBanner';
import DashboardPresentationList from './DashboardPresentationList';

const DashboardMainContent = ({ presentations, refetchPresentations, onCreate }) => {
  return (
    <div style={{ flex: 1}}>
      <Flex vertical gap="2.3rem">
        <DashboardBanner onCreate={onCreate} />
        <DashboardPresentationList 
          presentations={presentations} 
          refetchPresentations={refetchPresentations}
        />
      </Flex>
    </div>
  )
}

export default DashboardMainContent;