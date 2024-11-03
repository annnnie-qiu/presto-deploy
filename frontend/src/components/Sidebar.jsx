import React from 'react';
import { Flex, Menu } from 'antd';
import PrestoLogo from "../assets/Presto.png";

const Sidebar = () => {
  const styles = {
    logo: {
      height: '3vw',
    }
  };

  return (
    <>
      <Flex align="center" justify="center">
        <div className="logo">
          <img src={PrestoLogo} alt="Presto Logo" style={styles.logo}/>

        </div>
      </Flex>

      <Menu mode="inline" defaultSelectedKeys={['1']} className="menu-bar" />
    </>
  );
};

export default Sidebar;