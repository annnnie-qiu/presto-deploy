import { Flex, Menu } from "antd";
import PrestoLogo from "../assets/Presto.png";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { showErrorToast } from "../../utils/toastUtils";
import {
  UserOutlined,
  LogoutOutlined,
  OrderedListOutlined,
  SettingOutlined,
  SwapLeftOutlined,
} from "@ant-design/icons";

const StyledMenu = styled(Menu)`
  .ant-menu-item-selected {
    background-color: #4f6f52;
    color: #fff;
  }
`;

const Sidebar = ({ darkMode, presentations }) => {
  const styles = {
    logo: {
      height: "3vw",
      marginTop: "10px",
      padding: "15px",
    },
    menubar: {
      marginTop: "20px",
      display: "flex",
      flexDirection: "column",
      gap: "10px",
      fontWeight: "500",
      backgroundColor: darkMode ? "#113536" : "#fff",
      color: darkMode ? "#f5f5f5" : "#000",
    },
  };

  const navigate = useNavigate();
  const location = useLocation();

  // Highlight the appropriate menu item based on the current route
  const getSelectedKey = () => {
    if (location.pathname.startsWith("/presentation")) {
      return "2";
    }
    switch (location.pathname) {
      case "/dashboard":
        return "1";
      case "/setting":
        return "4";
      default:
        return "";
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleDashboard = () => {
    navigate("/dashboard");
  };

  const handleMyPresentations = () => {
    if (presentations.length > 0) {
      const latestPresentation = presentations[presentations.length - 1];
      navigate(`/presentation/${latestPresentation.id}/1`);
    } else {
      showErrorToast("No presentations available.");
    }
  };

  const isPresentationPage = location.pathname.startsWith("/presentation");

  return (
    <>
      <Flex align="center" justify="center">
        <div className="logo">
          <img src={PrestoLogo} alt="Presto Logo" style={styles.logo} />
        </div>
      </Flex>

      <StyledMenu
        mode="inline"
        selectedKeys={[getSelectedKey()]}
        style={styles.menubar}
        items={[
          {
            key: "1",
            icon: isPresentationPage ? <SwapLeftOutlined /> : <UserOutlined />,
            label: isPresentationPage ? "Back" : "Dashboard",
            onClick: handleDashboard,
          },
          {
            key: "2",
            icon: <OrderedListOutlined />,
            label: isPresentationPage ? "My presentations" : "My Recent One",
            onClick: handleMyPresentations,
          },
          {
            key: "4",
            icon: <SettingOutlined />,
            label: "Setting",
            onClick: () => navigate("/setting"),
          },
          {
            key: "5",
            icon: <LogoutOutlined />,
            label: "Logout",
            onClick: handleLogout,
          },
        ]}
      />
    </>
  );
};

export default Sidebar;
