import React, { useMemo, useState } from "react";
import HeaherPresent from "../components/HeaherPresent";
import { Button, Flex, Layout, Modal, Input } from "antd";
import { Splitter, Typography } from "antd";
const { Sider, Header, Content } = Layout;
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons";
import Sidebar from "../components/Sidebar";
import { ConfigProvider, Segmented, Tooltip } from "antd";
import { DeleteOutlined, PlusCircleOutlined } from "@ant-design/icons";

const Tooltips = () => {
  const [arrow, setArrow] = useState("Show");
  const mergedArrow = useMemo(() => {
    if (arrow === "Hide") {
      return false;
    }
    if (arrow === "Show") {
      return true;
    }
    return {
      pointAtCenter: true,
    };
  }, [arrow]);
  return (
    <ConfigProvider
      button={{
        style: {
          width: 30,
          margin: 4,
        },
      }}
    >
      <Segmented value={arrow} onChange={setArrow} />
      <Flex vertical justify="center" align="center" className="demo">
        <Flex justify="space-between" align="center">
          <Flex align="center" vertical>
            <Tooltip
              placement="rightTop"
              title={"add a new slide"}
              arrow={mergedArrow}
            >
              <Button>
                <PlusCircleOutlined />
              </Button>
              <Button>
                <DeleteOutlined />
              </Button>
            </Tooltip>
            {/* <Tooltip
              placement="right"
              title={"delete slide"}
              arrow={mergedArrow}
            >
              <Button>
                <DeleteOutlined />
              </Button>
            </Tooltip> */}
          </Flex>
        </Flex>
      </Flex>
    </ConfigProvider>
  );
};

// TODO: Implement the DescList component - hard code
const currentSlides = [
  {
    id: 1,
    content: "Slide 1",
  },
];

const DescList = (props) => (
  <div className="flex h-full w-full">
    <div className="grow flex flex-col gap-2 items-center h-full py-2">
      {currentSlides.map((slide) => (
        <div key={slide.id} className="bg-red-300 h-24 w-3/4 rounded-lg">
          {slide.content}
        </div>
      ))}
    </div>
    <div className=" w-8 h-ful">{Tooltips()}</div>
  </div>
);

const DescSlide = (props) => (
  <Flex
    justify="center"
    align="center"
    style={{
      height: "100%",
    }}
  >
    <Typography.Title
      type="secondary"
      level={5}
      style={{
        whiteSpace: "nowrap",
      }}
    >
      {props.text}
    </Typography.Title>
  </Flex>
);

function PresentationPage() {
  const [collapsed, setCollapsed] = useState(false);
  const styles = {
    sider: {
      height: "100vh",
      position: "sticky !important",
      left: 0,
      bottom: 0,
      top: 0,
    },
    header: {
      paddingTop: "12px",
      backgroundColor: "#fff",
    },
    content: {
      margin: "24px 16px",
      padding: "20px",
    },
    trigerbtn: {
      fontSize: "16px",
      width: "50px",
      height: "50px",
      position: "fixed",
      bottom: "10px",
      left: "10px",
    },
  };
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
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          style={styles.trigerbtn}
        />
      </Sider>
      <Layout>
        <Header style={styles.header}>
          <HeaherPresent />
        </Header>
        <Content style={styles.content}>
          {/* check */}
          <Splitter
            style={{
              boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Splitter.Panel defaultSize="20%" min="20%" max="70%">
              <DescList text="First" />
            </Splitter.Panel>
            {/* add a tooltip */}

            <Splitter.Panel>
              <DescSlide text="Second" />
            </Splitter.Panel>
          </Splitter>
        </Content>
      </Layout>
    </Layout>
  );
}

export default PresentationPage;
