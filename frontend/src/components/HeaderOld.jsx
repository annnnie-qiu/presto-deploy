import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons'

function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <header className="flex justify-between items-center p-4 bg-gray-800 text-white">
      {/* Logo - Clicking will navigate back to the dashboard */}
      <div
        className="text-2xl font-bold cursor-pointer"
        onClick={() => navigate('/dashboard')}
      >
        Presto
      </div>

      {/* Profile Image and Logout Button */}
      <div className="flex items-center space-x-4">
        <Avatar 
          size="large" 
          icon={<UserOutlined />} 
          className="cursor-pointer"
        />
        <Button type="primary" danger onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </header>
  )
}

export default Header
