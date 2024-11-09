import React, { useMemo, useState } from "react";
import HeaherPresent from "../components/HeaherPresent";
import { Button, Flex, Layout, Modal } from "antd";
import { Splitter, Form, ColorPicker, Input, InputNumber } from "antd";
const { Sider, Header, Content } = Layout;
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  FileTextOutlined,
  FileImageOutlined,
} from "@ant-design/icons";
import Sidebar from "../components/Sidebar";
import { ConfigProvider, Segmented, Tooltip } from "antd";
import {
  DeleteOutlined,
  PlusCircleOutlined,
  VideoCameraAddOutlined,
} from "@ant-design/icons";
import sendDetail from "../../utils/API/Send_ReceiveDetail/send_receiveDetail";
import { getDetail } from "../../utils/API/Send_ReceiveDetail/send_receiveDetail";
import { useParams } from "react-router-dom";
import { errorPopUp } from "../../utils/errorPopUp";
import { showErrorToast } from "../../utils/toastUtils";
import PresentationText from "../components/presentationItem/PresentationText";

const Tooltips = (
  currentSlides,
  setCurrentSlides,
  presentationId,
  selectedSlideId,
  setSelectedSlideId,
  showModal
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

                const nextAvailableSlideId = store.presentations.find(
                  (item) => item.id == presentationId
                ).nextSlideId;

                const newSlide = {
                  slideId: nextAvailableSlideId,
                  content: [],
                  nextElementId: 1,
                };

                const newSlideList = [...currentSlides, newSlide];
                setCurrentSlides(newSlideList);
                setSelectedSlideId(nextAvailableSlideId);

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

                const targetIndex = currentSlides.findIndex(
                  (slide) => slide.slideId === selectedSlideId
                );

                let nextSlideId;
                if (targetIndex === 0 && currentSlides.length === 1) {
                  errorPopUp("Error", "Cannot delete the only slide");
                  return;
                } else if (targetIndex === currentSlides.length - 1) {
                  nextSlideId = currentSlides[targetIndex - 1].slideId;
                } else {
                  nextSlideId = currentSlides[targetIndex + 1].slideId;
                }

                for (let i = 0; i < store.presentations.length; i++) {
                  if (store.presentations[i].id == presentationId) {
                    store.presentations[i].slides = store.presentations[
                      i
                    ].slides.filter(
                      (slide) => slide.slideId != selectedSlideId
                    );
                    setCurrentSlides(store.presentations[i].slides);
                    setSelectedSlideId(nextSlideId);
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

            <Tooltip
              placement="right"
              title={"put TEXT on the slide"}
              onClick={async () => {
                console.log("put text");
              }}
            >
              <Button onClick={showModal}>
                <FileTextOutlined />
              </Button>

            </Tooltip>

            <Tooltip
              placement="right"
              title={"put an IMAGE on the slide"}
              arrow={mergedArrow}
            >
              <Button>
                <FileImageOutlined />
              </Button>
            </Tooltip>

            <Tooltip placement="right" title={"put a VIDEO on the slide"}>
              <Button>
                <VideoCameraAddOutlined />
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
  showModal,
  handleCancel,
  isModalOpen,
}) => (
  <div className="flex h-full w-full px-2">
    <div className="grow flex flex-col gap-2 items-center max-h-[80vh] overflow-y-auto py-2">
      {currentSlides.map((slide, index) => (
        <div
          key={slide.slideId}
          className="flex w-full h-24 justify-center items-center gap-2 size-4"
        >
          <div className="self-end pb-2">{index + 1}</div>
          <div
            onClick={() => {
              setSelectedSlideId(slide.slideId);
            }}
            className={`bg-white h-24 w-3/4 rounded-lg border-solid border-2 ${
              selectedSlideId === slide.slideId
                ? "border-blue-500"
                : "border-inherit"
            }`}
          ></div>
        </div>
      ))}
    </div>
    <div className="w-8 h-full">
      {Tooltips(
        currentSlides,
        setCurrentSlides,
        presentationId,
        selectedSlideId,
        setSelectedSlideId,
        showModal,
        handleCancel,
        isModalOpen
      )}
    </div>
  </div>
);

const DescSlide = ({
  currentSlides,
  presentationId,
  selectedSlideId,
  showModal,
  setTextSizeLength,
  setTextSizeWidth,
  setTextInput,
  setTextFontSize,
  setTextFontColor,
  setSelectedElementId,
}) => (
  <div className="flex h-full w-full justify-center items-center">
    <div className="bg-white h-5/6 w-11/12 rounded-lg border-solid border-2 border-inherit">
      {currentSlides?.map((slide) => {
        if (slide.slideId === selectedSlideId) {
          return slide.content?.map((element) => {
            if (element.type === "text") {
              return (
                <PresentationText
                  showModal={showModal}
                  key={element.id}
                  data={element}
                  selectedSlideId={selectedSlideId}
                  presentationId={presentationId}
                  setTextSizeLength={setTextSizeLength}
                  setTextSizeWidth={setTextSizeWidth}
                  setTextInput={setTextInput}
                  setTextFontSize={setTextFontSize}
                  setTextFontColor={setTextFontColor}
                  setSelectedElementId={setSelectedElementId}
                />
              ); // Use a unique key for each element
            }
            return null;
          });
        }
        return null;
      })}
    </div>
  </div>
);

function PresentationPage() {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedSlideId, setSelectedSlideId] = useState(1);
  const { presentationId } = useParams();
  const [currentSlides, setCurrentSlides] = React.useState([]);

  // for the text input
  const [textSizeLength, setTextSizeLength] = useState(0);
  const [textSizeWidth, setTextSizeWidth] = useState(0);
  const [textInput, setTextInput] = useState("");
  const [textFontSize, setTextFontSize] = useState(2);
  const [textFontColor, setTextFontColor] = useState("#111111");
  const [zIndex, setZIndex] = useState(0);

  //
  const [selectedElementId, setSelectedElementId] = useState(undefined);

  
  const [form] = Form.useForm();
  const [formLayout, setFormLayout] = useState("horizontal");
  const onFormLayoutChange = ({ layout }) => {
    setFormLayout(layout);
  };
  const { TextArea } = Input;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleArrowKeyPress = (e) => {
    if (e.key === "ArrowLeft") {
      const targetIndex = currentSlides.findIndex(
        (slide) => slide.slideId === selectedSlideId
      );
      if (targetIndex > 0) {
        setSelectedSlideId(currentSlides[targetIndex - 1].slideId);
      } else {
        showErrorToast("This is the first slide now");
      }
    } else if (e.key === "ArrowRight") {
      const targetIndex = currentSlides.findIndex(
        (slide) => slide.slideId === selectedSlideId
      );
      if (targetIndex < currentSlides.length - 1) {
        setSelectedSlideId(currentSlides[targetIndex + 1].slideId);
      } else {
        showErrorToast("This is the last slide now");
      }
    }
  };

  React.useEffect(() => {
    window.addEventListener("keydown", handleArrowKeyPress);
    return () => {
      window.removeEventListener("keydown", handleArrowKeyPress);
    };
  }, [currentSlides, selectedSlideId]);

  React.useEffect(() => {
    const getPresentationDetail = async () => {
      const response = await getDetail(localStorage.getItem("token"));
      const presentation = response.store.presentations.find(
        (presentation) => presentation.id == presentationId
      );
      setCurrentPresentation(presentation);
      setCurrentSlides(presentation.slides);
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
            <Splitter.Panel
              defaultSize="20%"
              min="20%"
              max="70%"
              className="max-h-screen overflow-y-auto"
            >
              <div className="h-full">
                <DescList
                  currentSlides={currentSlides}
                  setCurrentSlides={setCurrentSlides}
                  selectedSlideId={selectedSlideId}
                  setSelectedSlideId={setSelectedSlideId}
                  presentationId={presentationId}
                  showModal={showModal}
                  handleCancel={handleCancel}
                  isModalOpen={isModalOpen}
                />
              </div>
            </Splitter.Panel>

            <Splitter.Panel>
              <DescSlide
                currentSlides={currentSlides}
                presentationId={presentationId}
                selectedSlideId={selectedSlideId}
                showModal={showModal}
                setTextSizeLength={setTextSizeLength}
                setTextSizeWidth={setTextSizeWidth}
                setTextInput={setTextInput}
                setTextFontSize={setTextFontSize}
                setTextFontColor={setTextFontColor}
                setSelectedElementId={setSelectedElementId}
                text="Second"
              />
            </Splitter.Panel>
          </Splitter>
        </Content>
      </Layout>

      <Modal
        title="Input Text"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form
          layout={formLayout}
          form={form}
          initialValues={{
            layout: formLayout,
          }}
          onValuesChange={onFormLayoutChange}
          style={{
            maxWidth: formLayout === "inline" ? "none" : 600,
          }}
        >
          <Form.Item label="Size length">
            <Input
              value={textSizeLength}
              placeholder="input placeholder"
              onChange={(e) => {
                setTextSizeLength(e.target.value);
              }}
            />
          </Form.Item>

          <Form.Item label="Size width">
            <Input
              value={textSizeWidth}
              placeholder="input placeholder"
              onChange={(e) => {
                setTextSizeWidth(e.target.value);
              }}
            />
          </Form.Item>

          <Form.Item label="Text in the textarea">
            <TextArea
              value={textInput}
              placeholder="input your text here"
              autoSize={{ minRows: 1, maxRows: 4 }}
              onChange={(e) => {
                setTextInput(e.target.value);
              }}
            />
          </Form.Item>
          <Form.Item label="Font size of the text ">
            <InputNumber
              min={1}
              max={100}
              defaultValue={3}
              value={textFontSize}
              addonAfter="em"
              changeOnWheel
              onChange={(e) => {
                setTextFontSize(e.target.value);
              }}
            />
          </Form.Item>

          <Form.Item label="Font color of the text">
            <ColorPicker
              value={textFontColor}
              defaultValue={"#111111"}
              allowClear
              onChange={(temp, _) => {
                setTextFontColor(temp.toHexString());
              }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
}

export default PresentationPage;
