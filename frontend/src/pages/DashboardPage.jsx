import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import Header from '../components/Header';
import { Button, Layout } from 'antd';
import {MenuUnfoldOutlined, MenuFoldOutlined} from '@ant-design/icons'
import Sidebar from '../components/Sidebar';

const { Sider, Header, Content } = Layout;

function DashboardPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [collapsed, setCollapsed] = useState(false);

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

  // React.useEffect(() => {
  //   // If no token is found, navigate back to the login page.
  //   if (!token) {
  //     navigate('/login')
  //   }
  // });

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
        <Header style={styles.header}></Header>
        <Content style={styles.content}></Content>
      </Layout>
    </Layout>
  );
};

export default DashboardPage;