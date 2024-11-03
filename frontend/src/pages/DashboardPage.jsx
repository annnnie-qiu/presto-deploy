import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import Header from '../components/Header';
import { Layout } from 'antd';
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

    },
    content: {

    },
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
      </Sider>
      <Layout>
        <Header style={styles.header}></Header>
        <Content style={styles.content}></Content>
      </Layout>
    </Layout>
  );
};

export default DashboardPage;