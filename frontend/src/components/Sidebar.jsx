import React from 'react';
import { Flex, Menu } from 'antd';
import PrestoLogo from "../assets/Presto.png";
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
  UserOutlined,
  ProfileOutlined,
  LogoutOutlined,
  OrderedListOutlined,
  SettingOutlined, 
} from '@ant-design/icons';

const StyledMenu = styled(Menu)`
.ant-menu-item-selected {
  background-color: #4f6f52 !important;
  color: #fff !important;
}
`;

const Sidebar = () => {

  const styles = {
    logo: {
      height: '3vw',
      marginTop: '10px',
      padding: '15px'
    },
    menubar: {
      marginTop: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      fontWeight: '500',
    }
  };

  const navigate = useNavigate();
  const location = useLocation();

  // Highlight the appropriate menu item based on the current route
  const getSelectedKey = () => {
    if (location.pathname.startsWith('/presentation')) {
      return '2';
    }
    switch (location.pathname) {
    case '/dashboard':
      return '1';
    case '/profile':
      return '3';
    case '/setting':
      return '4';
    default:
      return '';
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleDashboard = () => {
    navigate('/dashboard');
  }

  return (
    <>
      <Flex align="center" justify="center">
        <div className="logo">
          <img src={PrestoLogo} alt="Presto Logo" style={styles.logo}/>

        </div>
      </Flex>

      <StyledMenu 
        mode="inline" 
        selectedKeys={[getSelectedKey()]}
        style={styles.menubar} 
        items={[
          {
            key: '1',
            icon: <UserOutlined />,
            label: 'Dashboard',
            onClick: handleDashboard,
          },
          {
            key: '2',
            icon: <OrderedListOutlined />,
            label: 'My presentations',
          },
          {
            key: '3',
            icon: <ProfileOutlined />,
            label: 'Profile',
          },
          {
            key: '4',
            icon: <SettingOutlined />,
            label: 'Setting',
          },
          {
            key: '5',
            icon: <LogoutOutlined />,
            label: 'Logout',
            onClick: handleLogout,
          },
        ]}
      />
    </>
  );
};

export default Sidebar;