import React, { useMemo, useState } from "react";
import HeaherPresent from "../components/HeaherPresent";
import { Button, Flex, Layout, Modal, Input } from "antd";
import { Splitter, Typography } from "antd";
const { Sider, Header, Content } = Layout;
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons";
import Sidebar from "../components/Sidebar";
import { ConfigProvider, Segmented, Tooltip } from "antd";
import { DeleteOutlined, PlusCircleOutlined } from "@ant-design/icons";
import sendDetail from "../../utils/API/Send_ReceiveDetail/send_receiveDetail";
import { getDetail } from "../../utils/API/Send_ReceiveDetail/send_receiveDetail";
import { useParams } from "react-router-dom";

const Tooltips = (
  currentSlides,
  setCurrentSlides,
  presentationId,
  selectedSlideId,
  setSelectedSlideId
) => {
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
              onClick={async () => {
                console.log("add a new slide");
                const token = localStorage.getItem("token");
                const response = await getDetail(token);
                console.log("哈哈: ", response);
                const { store } = response;

                // Update the current slides array with the new slide
                const numberOfSlides = currentSlides.length + 1;
                // Find the index of the selected slide
                const targetIndex = currentSlides.findIndex(
                  (slide) => slide.slideId === selectedSlideId
                );

                // Insert a new slide after it
                const newSlideList = currentSlides
                  .slice(0, targetIndex + 1)
                  .concat({
                    slideId: numberOfSlides,
                    content: "",
                  })
                  .concat(currentSlides.slice(targetIndex + 1));

                setCurrentSlides(newSlideList);

                setSelectedSlideId(numberOfSlides);

                // Find the corresponding presentation
                // And update the numSlides and change the slides array to the latest version
                for (let i = 0; i < store.presentations.length; i++) {
                  if (store.presentations[i].id == presentationId) {
                    store.presentations[i].numSlides = numberOfSlides;
                    store.presentations[i].slides = newSlideList;
                    break;
                  }
                }
                await sendDetail(token, store);
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
              onClick={async () => {
                console.log("delete slide");
                const token = localStorage.getItem("token");
                const response = await getDetail(token);
                console.log(response);
                const { store } = response;
                // check response is matching with presentationId
                for (let i = 0; i < store.presentations.length; i++) {
                  if (store.presentations[i].id == presentationId) {
                    store.presentations[i].numSlides -= 1;
                    await sendDetail(
                      token,
                      presentationId,
                      store.presentations[i]
                    );
                  }
                }
                setCurrentSlides((currentSlides) => {
                  console.log(currentSlides);
                  // should be delete current slide
                  return currentSlides.filter(
                    (slide) => slide.slideId !== currentSlides.length
                  );
                  // console.log(currentSlides);
                });
              }}
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
  presentationId,
}) => (
  <div className="flex h-full w-full">
    <div className="grow flex flex-col gap-2 items-center h-full py-2">
      {currentSlides.map((slide, index) => (
        <div
          key={slide.slideId}
          className="flex w-full h-24 justify-center items-center gap-2"
        >
          {/* TODO: Implement the DescSlide component - hard code */}
          <div className=" self-end pb-2 ">{index + 1}</div>

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
    <div className=" w-8 h-ful">
      {Tooltips(
        currentSlides,
        setCurrentSlides,
        presentationId,
        selectedSlideId,
        setSelectedSlideId
      )}
    </div>
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
  const { presentationId } = useParams();

  // get the current slides from the backend
  React.useEffect(() => {
    const getPresentationDetail = async () => {
      const response = await getDetail(localStorage.getItem("token"));
      const presentation = response.store.presentations.find(
        (presentation) => presentation.id == presentationId
      );

      // Get the current presentation and slides
      console.log("这里: ", presentation);
      setCurrentPresentation(presentation);
      setCurrentSlides(presentation.slides);
    };
    getPresentationDetail();
  }, []);

  const [currentPresentation, setCurrentPresentation] =
    React.useState(undefined);

  const [currentSlides, setCurrentSlides] = React.useState([]);

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
                presentationId={presentationId}
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
