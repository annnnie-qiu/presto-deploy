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
import { errorPopUp } from "../../utils/errorPopUp";

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
                const token = localStorage.getItem("token");
                const response = await getDetail(token);
                const { store } = response;

                // Find the next available slide ID from the store
                const nextAvailableSlideId = store.presentations.find(
                  (item) => item.id == presentationId
                ).nextSlideId;

                // Find the index of the selected slide
                const targetIndex = currentSlides.findIndex(
                  (slide) => slide.slideId === selectedSlideId
                );

                // Insert a new slide after it
                const newSlideList = currentSlides
                  .slice(0, targetIndex + 1)
                  .concat({
                    slideId: nextAvailableSlideId,
                    content: "",
                  })
                  .concat(currentSlides.slice(targetIndex + 1));

                setCurrentSlides(newSlideList);

                setSelectedSlideId(nextAvailableSlideId);

                // Find the corresponding presentation
                // And update the numSlides and change the slides array to the latest version
                for (let i = 0; i < store.presentations.length; i++) {
                  if (store.presentations[i].id == presentationId) {
                    store.presentations[i].numSlides = nextAvailableSlideId;
                    store.presentations[i].slides = newSlideList;
                    store.presentations[i].nextSlideId =
                      nextAvailableSlideId + 1;
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
                const token = localStorage.getItem("token");
                const response = await getDetail(token);
                const { store } = response;

                // Find the id of the next selected slide, if the current selected slide is the last slide, then the next slide is the previous slide
                // Otherwise, the next slide is the next slide
                const targetIndex = currentSlides.findIndex(
                  (slide) => slide.slideId === selectedSlideId
                );

                // Find the next slide ID
                let nextSlideId;
                if (targetIndex === 0 && currentSlides.length === 1) {
                  // only one slide - can not be delete - error popup
                  errorPopUp("Error", "Can not delete the only slide");
                  return;
                } else if (targetIndex === currentSlides.length - 1) {
                  nextSlideId = currentSlides[targetIndex - 1].slideId;
                } else {
                  nextSlideId = currentSlides[targetIndex + 1].slideId;
                }

                // Find the corresponding presentation
                for (let i = 0; i < store.presentations.length; i++) {
                  if (store.presentations[i].id == presentationId) {
                    // delete the slide with the given ID
                    store.presentations[i].slides = store.presentations[
                      i
                    ].slides.filter(
                      (slide) => slide.slideId != selectedSlideId
                    );
                    // update the nextSlideId
                    setCurrentSlides(store.presentations[i].slides);
                    setSelectedSlideId(nextSlideId);

                    // update the numSlides
                    store.presentations[i].numSlides =
                      store.presentations[i].slides.length;
                    await sendDetail(token, store);
                    break;
                  }
                }
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
  const [currentSlides, setCurrentSlides] = React.useState([]);

  // Function to handle the edit button click
  const handleArrowKeyPress = (e) => {
    if (e.key === "ArrowLeft") {
      console.log("left");
      // Move the selected slide to the previous slide
      const targetIndex = currentSlides.findIndex(
        (slide) => slide.slideId === selectedSlideId
      );
      console.log(targetIndex);
      console.log(selectedSlideId);
      console.log(currentSlides);
      if (targetIndex > 0) {
        setSelectedSlideId(currentSlides[targetIndex - 1].slideId);
      }
    } else if (e.key === "ArrowRight") {
      // Move the selected slide to the next slide
      const targetIndex = currentSlides.findIndex(
        (slide) => slide.slideId === selectedSlideId,
        console.log(currentSlides.length),
        console.log(selectedSlideId)
      );
      console.log(targetIndex);
      if (targetIndex < currentSlides.length - 1) {
        setSelectedSlideId(currentSlides[targetIndex + 1].slideId);
      }
    }
  };

  React.useEffect(() => {
    window.addEventListener("keydown", handleArrowKeyPress);

    return () => {
      window.removeEventListener("keydown", handleArrowKeyPress);
    };
  }, [currentSlides]);

  // get the current slides from the backend
  React.useEffect(() => {
    // Add event listener for keydown event
    const getPresentationDetail = async () => {
      const response = await getDetail(localStorage.getItem("token"));
      const presentation = response.store.presentations.find(
        (presentation) => presentation.id == presentationId
      );

      // Get the current presentation and slides
      setCurrentPresentation(presentation);
      setCurrentSlides((current) => presentation.slides);
    };

    getPresentationDetail();
  }, []);

  const [currentPresentation, setCurrentPresentation] =
    React.useState(undefined);

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
          <Splitter
            style={{
              boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Splitter.Panel style={{ flex: "none" }}>
              {" "}
              {/* Set flex to "none" for fixed width */}
              <div style={{ width: "300px" }}>
                {" "}
                {/* Fixed width container */}
                <DescList
                  currentSlides={currentSlides}
                  setCurrentSlides={setCurrentSlides}
                  selectedSlideId={selectedSlideId}
                  setSelectedSlideId={setSelectedSlideId}
                  presentationId={presentationId}
                />
              </div>
            </Splitter.Panel>

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
