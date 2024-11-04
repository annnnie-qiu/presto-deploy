import React, { useMemo, useState } from "react";
import HeaherPresent from "../components/HeaherPresent";
import { Button, Flex, Layout, Modal, Input } from "antd";
import { Splitter, Typography } from "antd";
const { Sider, Header, Content } = Layout;
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons";
import Sidebar from "../components/Sidebar";
import { ConfigProvider, Segmented, Tooltip } from "antd";
import { DeleteOutlined, PlusCircleOutlined } from "@ant-design/icons";

const Tooltips = (setCurrentSlides) => {
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
              onClick={() => {
                console.log("add a new slide");
                setCurrentSlides((currentSlides) => {
                  return [
                    ...currentSlides,
                    {
                      slideId: currentSlides.length + 1,
                      content: "",
                    },
                  ];
                });
              }}
              arrow={mergedArrow}
            >
              <Button>
                <PlusCircleOutlined />
              </Button>
            </Tooltip>
            <Tooltip
              placement="right"
              title={"delete slide"}
              arrow={mergedArrow}
            >
              <Button>
                <DeleteOutlined />
              </Button>
            </Tooltip>
          </Flex>
        </Flex>
      </Flex>
    </ConfigProvider>
  );
};

const DescList = ({
  currentSlides,
  setCurrentSlides,
  selectedSlideId,
  setSelectedSlideId,
}) => (
  <div className="flex h-full w-full">
    <div className="grow flex flex-col gap-2 items-center h-full py-2">
      {currentSlides.map((slide) => (
        <div
          key={slide.slideId}
          className="flex w-full h-24 justify-center items-center gap-2"
        >
          {/* TODO: Implement the DescSlide component - hard code */}
          <div className=" self-start pt-2 ">{slide.slideId}</div>

          <div
            onClick={() => {
              setSelectedSlideId(slide.slideId);
            }}
            className={`bg-white h-24 w-3/4 rounded-lg border-solid border-2 ${
              selectedSlideId === slide.slideId
                ? "border-blue-500"
                : "border-inherit"
            }`}
          >
            {slide.content}
          </div>
        </div>
      ))}
    </div>
    <div className=" w-8 h-ful">{Tooltips(setCurrentSlides)}</div>
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
  const [selectedSlideId, setSelectedSlideId] = useState(1);

  // TODO: Implement the DescList component - hard code
  const [currentSlides, setCurrentSlides] = React.useState([
    {
      slideId: 1,
      content: "",
    },
  ]);

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
              <DescList
                currentSlides={currentSlides}
                setCurrentSlides={setCurrentSlides}
                selectedSlideId={selectedSlideId}
                setSelectedSlideId={setSelectedSlideId}
              />
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
