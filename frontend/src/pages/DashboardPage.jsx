import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Flex, Layout, Modal, Input } from 'antd';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons'
import Sidebar from '../components/Sidebar';
import CustomHeader from '../components/Header';
import DashboardMainContent from '../components/DashboardMainContent';
// import DashboardSideContent from '../components/DashboardSideContent';

const { Sider, Header, Content } = Layout;

function DashboardPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [collapsed, setCollapsed] = React.useState(false);
  const [presentations, setPresentations] = React.useState([
    {
      id: 1,
      name: 'Presentation 1',
      thumbnail: '',
      description: 'This is the description',
      numSlides: 1,
    },
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newPresentationName, setNewPresentationName] = useState('');

  // React.useEffect(() => {
  //   // If no token is found, navigate back to the login page.
  //   if (!token) {
  //     navigate('/login')
  //   }
  // });

  const styles = {
    sider: {
      height: '100vh',
      position: 'sticky !important',
      left: 0,
      bottom: 0,
      top: 0,
    },
    header: {
      paddingTop: '12px',
      backgroundColor: '#fff',
    },
    content: {
      margin: '24px 16px',
      padding: '20px'
    },
    trigerbtn: {
      fontSize: '16px',
      width: '50px',
      height: '50px',
      position: 'fixed',
      bottom: '10px',
      left: '10px',
    }
  }

  // Function to handle showing the modal
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setNewPresentationName('');
  };

  const handleCreateNewPresentation = () => {
    if (newPresentationName.trim() === '') return;

    const newPresentation = {
      id: presentations.length + 1,
      name: newPresentationName,
      thumbnail: '',
      description: '',
      numSlides: 1,
    };
    setPresentations([...presentations, newPresentation]);
    setIsModalVisible(false);
    setNewPresentationName(''); // Reset input
  }

  return (
    <Layout>
      <Sider 
        theme="light" 
        trigger={null} 
        collapsible 
        collapsed={collapsed} 
        style={styles.sider}
      >
        <Sidebar />

        <Button 
          type='text' 
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          style={styles.trigerbtn}
        />
      </Sider>
      <Layout>
        <Header style={styles.header}>
          <CustomHeader />
        </Header>
        <Content style={styles.content}>
          <Flex gap="large">
            <DashboardMainContent
              presentations={presentations}
              onCreate={showModal}
            />
            {/* <DashboardSideContent /> */}
          </Flex>
        </Content>
      </Layout>

      {/* Modal for Creating New Presentation */}
      <Modal
        title="Create New Presentation"
        open={isModalVisible}
        onOk={handleCreateNewPresentation}
        onCancel={handleCancel}
        okText="Create"
      >
        <Input
          placeholder="Enter presentation name"
          value={newPresentationName}
          onChange={(e) => setNewPresentationName(e.target.value)}
        />
      </Modal>
    </Layout>
  );
};

export default DashboardPage;