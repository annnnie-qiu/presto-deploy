import React from 'react';
import { Flex, Menu } from 'antd';
import PrestoLogo from "../assets/Presto.png";
import {
  UserOutlined,
  ProfileOutlined,
  LogoutOutlined,
  OrderedListOutlined,
  SettingOutlined, 
} from '@ant-design/icons';

const Sidebar = () => {
  const styles = {
    logo: {
      height: '3vw',
      marginTop: '10px',
    }
  };

  return (
    <>
      <Flex align="center" justify="center">
        <div className="logo">
          <img src={PrestoLogo} alt="Presto Logo" style={styles.logo}/>

        </div>
      </Flex>

      <Menu 
        mode="inline" 
        defaultSelectedKeys={['1']} 
        className="menu-bar" 
        items={[
          {
            key: '1',
            icon: <UserOutlined />,
            label: 'Dashboard',
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
          },
        ]}
      />
    </>
  );
};

export default Sidebar;