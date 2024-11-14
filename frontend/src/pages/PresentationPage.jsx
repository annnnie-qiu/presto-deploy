import React, { useMemo, useState, useRef, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { MyDroppable } from "./MyDroppable";

import { useNavigate } from "react-router-dom";
import HeaherPresent from "../components/HeaherPresent";
import { Button, Flex, Layout, Modal, Upload, Select } from "antd";
import { Splitter, Form, ColorPicker, Input, InputNumber } from "antd";
const { Sider, Header, Content } = Layout;
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  FileTextOutlined,
  FileImageOutlined,
  FullscreenExitOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import Sidebar from "../components/Sidebar";
import { ConfigProvider, Segmented, Tooltip } from "antd";
import {
  DeleteOutlined,
  PlusCircleOutlined,
  VideoCameraAddOutlined,
  CodeOutlined,
  UploadOutlined,
  FontSizeOutlined,
  BgColorsOutlined,
  FullscreenOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import sendDetail from "../../utils/API/Send_ReceiveDetail/send_receiveDetail";
import { getDetail } from "../../utils/API/Send_ReceiveDetail/send_receiveDetail";
import { useParams } from "react-router-dom";
import { errorPopUp } from "../../utils/errorPopUp";
import { showErrorToast } from "../../utils/toastUtils";
import DescSlide from "../components/presentationItem/DescSlide";

const Tooltips = (
  currentSlides,
  setCurrentSlides,
  presentationId,
  selectedSlideId,
  setSelectedSlideId,
  showTextModal,
  showImageModal,
  handleTextCancel,
  isTextModalOpen,
  showCodeModal,
  isCodeModalOpen,
  handleFontCancel,
  isFontModalOpen,
  showFontModal,
  handleVideoCancel,
  isVideoModalOpen,
  showVideoModal,
  setIsHidden,
  isBackgroundModalOpen,
  handleBackgroundCancel,
  showBackgroundModal,
  handleLeftRightKeyPress,
  setIsListHidden
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
            {/* add a new slide */}
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
                // const slideElement = document.getElementById(`slide-${nextAvailableSlideId}`);
                // const snapshot = await takeSnapshot(slideElement, nextAvailableSlideId);
                // if (snapshot) {
                //   setCurrentSlides((slides) =>
                //     slides.map((slide) =>
                //       slide.slideId === snapshot.slideId
                //         ? { ...slide, snapshotUrl: snapshot.snapshotUrl }
                //         : slide
                //     )
                //   );
                // }
              }}
              arrow={mergedArrow}
            >
              <Button>
                <PlusCircleOutlined />
              </Button>
            </Tooltip>

            {/* delete a slide */}
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

            {/* change to the previous page */}
            <Tooltip placement="right" title={"change to the previous page"}>
              <Button onClick={() => handleLeftRightKeyPress("Left")}>
                <ArrowLeftOutlined />
              </Button>
            </Tooltip>

            {/* change to the next page */}
            <Tooltip placement="right" title={"change to the next page"}>
              <Button onClick={() => handleLeftRightKeyPress("Right")}>
                <ArrowRightOutlined />
              </Button>
            </Tooltip>

            {/* put text */}
            <Tooltip placement="right" title={"put TEXT on the slide"}>
              <Button onClick={showTextModal}>
                <FileTextOutlined />
              </Button>
            </Tooltip>

            {/* put image */}
            <Tooltip
              placement="right"
              title={"put an IMAGE on the slide"}
              arrow={mergedArrow}
            >
              <Button onClick={showImageModal}>
                <FileImageOutlined />
              </Button>
            </Tooltip>

            {/* put video */}
            <Tooltip placement="right" title={"put a VIDEO on the slide"}>
              <Button onClick={showVideoModal}>
                <VideoCameraAddOutlined />
              </Button>
            </Tooltip>

            {/* put code */}
            <Tooltip
              placement="right"
              title={"put CODE on the slide"}
              // arrow={mergedArrow}
            >
              <Button onClick={showCodeModal}>
                <CodeOutlined />
              </Button>
            </Tooltip>

            {/* put font change */}
            <Tooltip placement="right" title={"Change Font for All Text Boxes"}>
              <Button onClick={showFontModal}>
                <FontSizeOutlined />
              </Button>
            </Tooltip>

            {/* Set Slide Background */}
            <Tooltip placement="right" title={"Set slide background"}>
              <Button onClick={showBackgroundModal}>
                <BgColorsOutlined />
              </Button>
            </Tooltip>

            {/* Preview viewing */}
            <Tooltip
              placement="right"
              title={"Click for Preview viewing your current presentation"}
            >
              <Button
                onClick={() => {
                  try {
                    setIsHidden(true);
                    console.log("presentationId", presentationId);
                    console.log("selectedSlideId", selectedSlideId);
                    window.history.pushState(
                      {},
                      "",
                      `/presentation/${presentationId}/${selectedSlideId}`
                    );
                  } catch (error) {
                    console.log(error);
                    errorPopUp(
                      "Error",
                      "An error occurred while navigating to the preview page"
                    );
                  }
                }}
              >
                <FullscreenOutlined />
              </Button>
            </Tooltip>

            {/* Slide Re-arranging */}
            <Tooltip placement="right" title={"Slide Re-arranging"}>
              <Button
                onClick={() => {
                  console.log("currentSlides", currentSlides);
                  setIsListHidden(false);
                }}
              >
                <AppstoreOutlined />
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
  showTextModal,
  handleTextCancel,
  isTextModalOpen,
  showImageModal,
  isCodeModalOpen,
  showCodeModal,
  isFontModalOpen,
  showFontModal,
  handleFontCancel,
  isVideoModalOpen,
  showVideoModal,
  handleVideoCancel,
  setIsHidden,
  isBackgroundModalOpen,
  handleBackgroundCancel,
  showBackgroundModal,
  handleLeftRightKeyPress,
  setIsListHidden,
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
        showTextModal,
        showImageModal,
        handleTextCancel,
        isTextModalOpen,
        showCodeModal,
        isCodeModalOpen,
        handleFontCancel,
        isFontModalOpen,
        showFontModal,
        handleVideoCancel,
        isVideoModalOpen,
        showVideoModal,
        setIsHidden,
        isBackgroundModalOpen,
        handleBackgroundCancel,
        showBackgroundModal,
        handleLeftRightKeyPress,
        setIsListHidden
      )}
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

  const [isFontModalOpen, setIsFontModalOpen] = useState(false);
  const [textFontFamily, setTextFontFamily] = useState("Quicksand, sans-serif");

  // for the image input
  const [imageSizeLength, setImageSizeLength] = useState(0);
  const [imageSizeWidth, setImageSizeWidth] = useState(0);
  const [imageAlt, setImageAlt] = useState("");
  const [uploadImage, setUploadImage] = useState("");

  // for the video input
  const [isVideoModalOpen, setisVideoModalOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [videoSizeLength, setVideoSizeLength] = useState(0);
  const [videoSizeWidth, setVideoSizeWidth] = useState(0);
  const [videoAutoplay, setVideoAutoplay] = useState(false);

  // for the code input
  // const [codeBlockSize, setCodeBlockSize] = useState({ length: 0, width: 0 });
  const [codeLeight, setCodeLeight] = useState(0);
  const [codeWidth, setCodeWidth] = useState(0);
  const [codeContent, setCodeContent] = useState("");
  const [codeFontSize, setCodeFontSize] = useState(1);

  // New states for managing background settings
  const [isBackgroundModalOpen, setIsBackgroundModalOpen] = useState(false);
  const [backgroundType, setBackgroundType] = useState("solid");
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [backgroundGradient, setBackgroundGradient] = useState({
    start: "#ffffff",
    end: "#000000",
    direction: "to bottom",
  });
  const [backgroundImage, setBackgroundImage] = useState("");

  const [selectedElementId, setSelectedElementId] = useState(undefined);

  const [isHidden, setIsHidden] = useState(false);
  const [isListHidden, setIsListHidden] = useState(true);

  const [form] = Form.useForm();
  const [formLayout, setFormLayout] = useState("horizontal");
  const onFormLayoutChange = ({ layout }) => {
    setFormLayout(layout);
  };
  const { TextArea } = Input;

  const [isTextModalOpen, setisTextModalOpen] = useState(false);
  const [isImageModalOpen, setisImageModalOpen] = useState(false);
  const [isCodeModalOpen, setisCodeModalOpen] = useState(false);
  const showTextModal = () => {
    setisTextModalOpen(true);
  };

  // const takeSnapshot = async (element, slideId) => {
  //   if (!element) return;

  //   try {
  //     const canvas = await html2canvas(element);
  //     const snapshotUrl = canvas.toDataURL("image/png");

  //     return { slideId, snapshotUrl };
  //   } catch (error) {
  //     console.error("Error taking snapshot:", error);
  //   }
  // };

  const showImageModal = () => {
    setisImageModalOpen(true);
  };

  const handleTextCancel = () => {
    setisTextModalOpen(false);
  };

  const handleImageCancel = () => {
    setisImageModalOpen(false);
  };

  const showCodeModal = () => {
    setisCodeModalOpen(true);
  };

  const handleCodeCancel = () => {
    setisCodeModalOpen(false);
  };

  const showFontModal = () => {
    setIsFontModalOpen(true);
  };

  const handleFontCancel = () => {
    setIsFontModalOpen(false);
  };

  const showVideoModal = () => {
    setisVideoModalOpen(true);
  };

  const handleVideoCancel = () => {
    setisVideoModalOpen(false);
  };

  const showBackgroundModal = () => {
    setIsBackgroundModalOpen(true);
  };

  const handleBackgroundCancel = () => {
    setIsBackgroundModalOpen(false);
  };

  const handleArrowKeyPress = (e) => {
    console.log("key pressed", e.key);
    console.log("active element", document.activeElement);
    console.log("body", document.body);
    const pathname = window.location.pathname;
    const hasTwoSlashes = pathname.match(/\/presentation\/\d+\/\d+/);
    // if (document.activeElement === document.body) {
    if (e.key === "ArrowLeft") {
      const targetIndex = currentSlides.findIndex(
        (slide) => slide.slideId === selectedSlideId
      );

      if (targetIndex > 0) {
        const newSlideId = currentSlides[targetIndex - 1].slideId;
        setSelectedSlideId(newSlideId);
        window.history.pushState(
          {},
          "",
          `/presentation/${presentationId}/${newSlideId}`
        );
        // if (hasTwoSlashes) {
        //   console.log("targetIndex", targetIndex);
        //   console.log("has two slashes");
        //   window.history.pushState(
        //     {},
        //     "",
        //     `/presentation/${presentationId}/${newSlideId}`
        //   );
        // }
      } else {
        showErrorToast("This is the first slide now");
      }
    } else if (e.key === "ArrowRight") {
      const targetIndex = currentSlides.findIndex(
        (slide) => slide.slideId === selectedSlideId
      );

      if (targetIndex < currentSlides.length - 1) {
        const newSlideId = currentSlides[targetIndex + 1].slideId;
        setSelectedSlideId(newSlideId);
        window.history.pushState(
          {},
          "",
          `/presentation/${presentationId}/${newSlideId}`
        );
        // if (hasTwoSlashes) {
        //   window.history.pushState(
        //     {},
        //     "",
        //     `/presentation/${presentationId}/${newSlideId}`
        //   );
        // }
      } else {
        showErrorToast("This is the last slide now");
      }
    }
    // }

    if (e.key === "Escape") {
      setIsHidden(false);
      // window.history.pushState({}, "", `/presentation/${presentationId}`);
    }
  };

  const handleLeftRightKeyPress = (key) => {
    console.log("key pressed", key);
    console.log("active element", document.activeElement);
    console.log("body", document.body);
    const pathname = window.location.pathname;
    const hasTwoSlashes = pathname.match(/\/presentation\/\d+\/\d+/);
    // if (document.activeElement === document.body) {
    if (key === "Left") {
      const targetIndex = currentSlides.findIndex(
        (slide) => slide.slideId === selectedSlideId
      );

      if (targetIndex > 0) {
        const newSlideId = currentSlides[targetIndex - 1].slideId;
        setSelectedSlideId(newSlideId);
        window.history.pushState(
          {},
          "",
          `/presentation/${presentationId}/${newSlideId}`
        );
        // if (hasTwoSlashes) {
        //   console.log("targetIndex", targetIndex);
        //   console.log("has two slashes");
        //   window.history.pushState(
        //     {},
        //     "",
        //     `/presentation/${presentationId}/${newSlideId}`
        //   );
        // }
      } else {
        showErrorToast("This is the first slide now");
      }
    } else if (key === "Right") {
      const targetIndex = currentSlides.findIndex(
        (slide) => slide.slideId === selectedSlideId
      );
      if (targetIndex < currentSlides.length - 1) {
        const newSlideId = currentSlides[targetIndex + 1].slideId;
        setSelectedSlideId(newSlideId);
        window.history.pushState(
          {},
          "",
          `/presentation/${presentationId}/${newSlideId}`
        );
        // if (hasTwoSlashes) {
        //   window.history.pushState(
        //     {},
        //     "",
        //     `/presentation/${presentationId}/${newSlideId}`
        //   );
        // }
      } else {
        showErrorToast("This is the last slide now");
      }
    }
    // }

    if (key === "Escape") {
      setIsHidden(false);
      // window.history.pushState({}, "", `/presentation/${presentationId}`);
    }
  };

  const handleTextOk = async () => {
    handleTextCancel();
    // save the text to the backend
    const token = localStorage.getItem("token");
    const response = await getDetail(token);
    const { store } = response;
    const targetIndex = currentSlides.findIndex(
      (slide) => slide.slideId === selectedSlideId
    );
    // Check if content already exists (edit mode) or is new (add mode)
    const existingElementIndex = currentSlides[targetIndex].content.findIndex(
      (element) => element.id === selectedElementId // Assuming `selectedElementId` is set for editing
    );
    let newContent;
    if (existingElementIndex !== -1) {
      console.log("existing", currentSlides);
      // Edit mode
      // Update existing content
      newContent = currentSlides[targetIndex].content.map((element, index) =>
        index === existingElementIndex
          ? {
              ...element,
              textInput: textInput,
              textSizeLength: textSizeLength,
              textSizeWidth: textSizeWidth,
              textFontSize: textFontSize,
              textFontColor: textFontColor,
              zIndex: zIndex,
            }
          : element
      );
    } else {
      console.log("new", currentSlides);
      // put them into content list and update the currentSlides
      newContent = [
        ...currentSlides[targetIndex].content,
        {
          type: "text",
          textInput: textInput,
          textSizeLength: textSizeLength,
          textSizeWidth: textSizeWidth,
          textFontSize: textFontSize,
          textFontColor: textFontColor,
          zIndex: zIndex,
          id: currentSlides[targetIndex].nextElementId,
          position: { x: 0, y: 0 },
        },
      ];
    }

    setZIndex(zIndex + 1);

    const newSlideList = currentSlides.map((slide) => {
      if (slide.slideId === selectedSlideId) {
        slide.content = newContent;
        slide.nextElementId = slide.nextElementId + 1;
      }
      return slide;
    });

    setCurrentSlides(newSlideList);

    for (let i = 0; i < store.presentations.length; i++) {
      if (store.presentations[i].id == presentationId) {
        store.presentations[i].slides = newSlideList;
        break;
      }
    }
    await sendDetail(token, store);

    // Take snapshot after updating slide content
    //   const slideElement = document.getElementById(`slide-${selectedSlideId}`);
    //   const snapshot = await takeSnapshot(slideElement, selectedSlideId);
    //   if (snapshot) {
    //     setCurrentSlides((slides) =>
    //       slides.map((slide) =>
    //         slide.slideId === snapshot.slideId
    //           ? { ...slide, snapshotUrl: snapshot.snapshotUrl }
    //           : slide
    //       )
    //     );
    //   }
  };

  const handleFontOk = async () => {
    handleFontCancel(false);

    // Save the font family to the backend or update the state accordingly
    const token = localStorage.getItem("token");
    const response = await getDetail(token);
    const { store } = response;

    // Find the index of the current slide that is selected
    const targetIndex = currentSlides.findIndex(
      (slide) => slide.slideId === selectedSlideId
    );

    // Update the font family for all text elements on the selected slide
    const newContent = currentSlides[targetIndex].content.map((element) => {
      if (element.type === "text") {
        // Update font family of all text elements
        return { ...element, textFontFamily };
      }
      return element;
    });

    // Update the current slide with new content
    const newSlideList = currentSlides.map((slide) => {
      if (slide.slideId === selectedSlideId) {
        return { ...slide, content: newContent };
      }
      return slide;
    });

    // Update the state to reflect changes
    setCurrentSlides(newSlideList);

    // Update the backend store to save the changes
    for (let i = 0; i < store.presentations.length; i++) {
      if (store.presentations[i].id == presentationId) {
        store.presentations[i].slides = newSlideList;
        break;
      }
    }
    await sendDetail(token, store);
  };

  const handleImageOk = async () => {
    handleImageCancel();
    // save the text to the backend
    const token = localStorage.getItem("token");
    const response = await getDetail(token);
    const { store } = response;
    const targetIndex = currentSlides.findIndex(
      (slide) => slide.slideId === selectedSlideId
    );
    // Check if content already exists (edit mode) or is new (add mode)
    const existingElementIndex = currentSlides[targetIndex].content.findIndex(
      (element) => element.id === selectedElementId
    );
    let newContent;
    if (existingElementIndex !== -1) {
      // Edit mode
      // Update existing content
      newContent = currentSlides[targetIndex].content.map((element, index) =>
        index === existingElementIndex
          ? {
              ...element,
              imageSizeLength: imageSizeLength,
              imageSizeWidth: imageSizeWidth,
              imageAlt: imageAlt,
              uploadImage: uploadImage,
              zIndex: zIndex,
            }
          : element
      );
    } else {
      // put them into content list and update the currentSlides
      newContent = [
        ...currentSlides[targetIndex].content,
        {
          type: "image",
          imageSizeLength: imageSizeLength,
          imageSizeWidth: imageSizeWidth,
          imageAlt: imageAlt,
          uploadImage: uploadImage,
          id: currentSlides[targetIndex].nextElementId,
          zIndex: zIndex,
          position: { x: 0, y: 0 },
        },
      ];
    }

    setZIndex(zIndex + 1);

    const newSlideList = currentSlides.map((slide) => {
      if (slide.slideId === selectedSlideId) {
        slide.content = newContent;
        slide.nextElementId = slide.nextElementId + 1;
      }
      return slide;
    });

    console.log("newSlideList", newSlideList);

    setCurrentSlides(newSlideList);

    for (let i = 0; i < store.presentations.length; i++) {
      if (store.presentations[i].id == presentationId) {
        store.presentations[i].slides = newSlideList;
        break;
      }
    }

    console.log("store", store);
    await sendDetail(token, store);
  };

  const handleCodeOk = async () => {
    handleCodeCancel();
    const token = localStorage.getItem("token");
    const response = await getDetail(token);
    const { store } = response;
    const targetIndex = currentSlides.findIndex(
      (slide) => slide.slideId === selectedSlideId
    );

    const newContent = [
      ...currentSlides[targetIndex].content,
      {
        type: "code",
        codeLeight,
        codeWidth,
        // codeBlockSize,
        codeContent,
        codeFontSize,
        // codeLanguage,
        id: currentSlides[targetIndex].nextElementId,
        position: { x: 0, y: 0 },
      },
    ];
    console.log("newContent", newContent);

    const newSlideList = currentSlides.map((slide) => {
      if (slide.slideId === selectedSlideId) {
        slide.content = newContent;
        slide.nextElementId += 1;
      }
      return slide;
    });

    setCurrentSlides(newSlideList);

    for (let i = 0; i < store.presentations.length; i++) {
      if (store.presentations[i].id == presentationId) {
        store.presentations[i].slides = newSlideList;
        break;
      }
    }
    await sendDetail(token, store);
  };

  const handleVideoOk = async () => {
    handleVideoCancel();
    // Save video details to backend
    const token = localStorage.getItem("token");
    const response = await getDetail(token);
    const { store } = response;

    const targetIndex = currentSlides.findIndex(
      (slide) => slide.slideId === selectedSlideId
    );

    // Check if content already exists (edit modal) or is new (add modal)
    const existingElementIndex = currentSlides[targetIndex].content.findIndex(
      (element) => element.id === selectedElementId // Assuming `selectedElementId` is set for editing
    );

    let newContent;

    if (existingElementIndex !== -1) {
      // Edit mode
      // Update existing content
      newContent = currentSlides[targetIndex].content.map((element, index) =>
        index === existingElementIndex
          ? {
              ...element,
              videoUrl: videoUrl,
              videoSizeLength: videoSizeLength,
              videoSizeWidth: videoSizeWidth,
              videoAutoplay: videoAutoplay,
              zIndex: zIndex,
            }
          : element
      );
    } else {
      // Add mode
      // Add new content to the slide
      newContent = [
        ...currentSlides[targetIndex].content,
        {
          type: "video",
          videoUrl,
          videoSizeLength,
          videoSizeWidth,
          videoAutoplay,
          id: currentSlides[targetIndex].nextElementId,
          position: { x: 0, y: 0 },
          zIndex: zIndex,
        },
      ];
    }

    setZIndex(zIndex + 1);

    const newSlideList = currentSlides.map((slide) => {
      if (slide.slideId === selectedSlideId) {
        slide.content = newContent;
        slide.nextElementId += 1;
      }
      return slide;
    });

    setCurrentSlides(newSlideList);

    for (let i = 0; i < store.presentations.length; i++) {
      if (store.presentations[i].id == presentationId) {
        store.presentations[i].slides = newSlideList;
        break;
      }
    }
    await sendDetail(token, store);
  };

  const handleImageUplod = (file) => {
    // Create a FileReader to read the file
    const reader = new FileReader();

    // Once the file is read, get the Base64 string
    reader.onload = (e) => {
      setUploadImage(e.target.result);
      console.log("Base64 of uploaded image:", e.target.result);
    };

    // Read the file as a Data URL (Base64)
    reader.readAsDataURL(file);
    // Prevent actual upload by returning false
    return false;
  };

  const handleBackground = async () => {
    setIsBackgroundModalOpen(false);
    // Update the selected slide's background
    const targetIndex = currentSlides.findIndex(
      (slide) => slide.slideId === selectedSlideId
    );

    let newBackground = {};
    if (backgroundType === "solid") {
      newBackground = { type: "solid", color: backgroundColor };
    } else if (backgroundType === "gradient") {
      newBackground = {
        type: "gradient",
        gradient: {
          start: backgroundGradient.start,
          end: backgroundGradient.end,
          direction: backgroundGradient.direction,
        },
      };
    } else if (backgroundType === "image") {
      newBackground = { type: "image", imageUrl: backgroundImage };
    }

    const newSlides = currentSlides.map((slide, index) =>
      index === targetIndex
        ? {
            ...slide,
            background: newBackground,
          }
        : slide
    );

    setCurrentSlides(newSlides);

    // Save the background change to the backend
    const token = localStorage.getItem("token");
    const response = await getDetail(token);
    const { store } = response;

    for (let i = 0; i < store.presentations.length; i++) {
      if (store.presentations[i].id == presentationId) {
        store.presentations[i].slides = newSlides;
        break;
      }
    }
    await sendDetail(token, store);

    // Take snapshot after changing background
    //   const slideElement = document.getElementById(`slide-${selectedSlideId}`);
    //   const snapshot = await takeSnapshot(slideElement, selectedSlideId);
    //   if (snapshot) {
    //     setCurrentSlides((slides) =>
    //       slides.map((slide) =>
    //         slide.slideId === snapshot.slideId
    //           ? { ...slide, snapshotUrl: snapshot.snapshotUrl }
    //           : slide
    //       )
    //     );
    //   }
  };

  const handleBackgroundImageUpload = (file) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const base64String = e.target.result;

      // Update the state to reflect the background image upload for the slide
      setBackgroundImage(base64String);
      console.log("Base64 of uploaded background image:", base64String);
    };

    reader.readAsDataURL(file); // Convert the file to base64

    return false; // Prevent actual file upload
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

  const handleDragEnd = (result) => {
    console.log("result", result);
    if (!result.destination) return;

    const reorderedSlides = Array.from(currentSlides);
    console.log("reorderedSlides", reorderedSlides);
    const [movedSlide] = reorderedSlides.splice(result.source.index, 1);
    console.log("movedSlide", movedSlide);
    reorderedSlides.splice(result.destination.index, 0, movedSlide);

    setCurrentSlides(reorderedSlides);
  };

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
    <>
      <Layout>
        {isHidden && isListHidden && (
          <div className="flex h-screen w-screen">
            <div className="w-10 h-full">
              <Tooltip
                placement="right"
                title={"Click for back to your current presentation list"}
              >
                <Button
                  onClick={() => {
                    try {
                      setIsHidden(false);
                      window.history.pushState(
                        {},
                        "",
                        `/presentation/${presentationId}/${selectedSlideId}`
                      );
                    } catch (error) {
                      console.log(error);
                      errorPopUp(
                        "Error",
                        "An error occurred while navigating to the preview page"
                      );
                    }
                  }}
                >
                  <FullscreenExitOutlined />
                </Button>
              </Tooltip>

              {/* change to the previous page */}
              <Tooltip placement="right" title={"change to the previous page"}>
                <Button
                  onClick={() => {
                    handleLeftRightKeyPress("Left");
                  }}
                >
                  <ArrowLeftOutlined />
                </Button>
              </Tooltip>

              {/* change to the next page */}
              <Tooltip placement="right" title={"change to the next page"}>
                <Button onClick={() => handleLeftRightKeyPress("Right")}>
                  <ArrowRightOutlined />
                </Button>
              </Tooltip>
            </div>
            <DescSlide
              currentSlides={currentSlides}
              presentationId={presentationId}
              selectedSlideId={selectedSlideId}
              showTextModal={showTextModal}
              setTextSizeLength={setTextSizeLength}
              setTextSizeWidth={setTextSizeWidth}
              setTextInput={setTextInput}
              setTextFontSize={setTextFontSize}
              setTextFontColor={setTextFontColor}
              setSelectedElementId={setSelectedElementId}
              showImageModal={showImageModal}
              setImageSizeLength={setImageSizeLength}
              setImageSizeWidth={setImageSizeWidth}
              setImageAlt={setImageAlt}
              setUploadImage={setUploadImage}
              showCodeModal={showCodeModal}
              // setCodeBlockSize={setCodeBlockSize}
              setCodeLeight={setCodeLeight}
              setCodeWidth={setCodeWidth}
              setCurrentSlides={setCurrentSlides}
              showVideoModal={showVideoModal}
              setVideoUrl={setVideoUrl}
              setVideoSizeLength={setVideoSizeLength}
              setVideoSizeWidth={setVideoSizeWidth}
              setVideoAutoplay={setVideoAutoplay}
              showBackgroundModal={showBackgroundModal}
              setBackgroundColor={setBackgroundColor}
              setBackgroundGradient={setBackgroundGradient}
              setBackgroundImage={setBackgroundImage}
              setBackgroundType={setBackgroundType}
              isHidden={isHidden}
              text="Second"
            />
          </div>
        )}
      </Layout>

      <Layout>
        {!isHidden && !isListHidden && (
          <div className="flex h-screen w-screen">
            <DragDropContext onDragEnd={handleDragEnd}>
              <MyDroppable droppableId="slides" direction="horizontal">
                {(provided) => (
                  <div
                    className="slides grow flex flex-row gap-2 items-center py-2"
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {currentSlides.map((slide, index) => {
                      return (
                        <Draggable
                          key={slide.slideId.toString()}
                          draggableId={slide.slideId.toString()}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`flex w-48 h-24 justify-center items-center gap-2 size-4 ${
                                selectedSlideId === slide.slideId
                                  ? "border-blue-500"
                                  : "border-inherit"
                              }`}
                              onClick={() => setSelectedSlideId(slide.slideId)}
                            >
                              <div className="self-end pb-2">{index + 1}</div>
                              <div className="bg-white h-24 w-full rounded-lg border-solid border-2"></div>
                            </div>
                          )}
                        </Draggable>
                      );
                    })}
                    {provided.placeholder}
                  </div>
                )}
              </MyDroppable>
            </DragDropContext>

            <div className="w-8 h-full">
              <Tooltip placement="right" title={"Click"}>
                <Button
                  onClick={() => {
                    setIsListHidden(true);
                  }}
                >
                  <FullscreenExitOutlined />
                </Button>
              </Tooltip>
            </div>
          </div>
        )}
      </Layout>

      <Layout>
        {!isHidden && isListHidden && (
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
        )}
        {!isHidden && isListHidden && (
          <Layout className="flex flex-col h-screen">
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
                  className="flex-grow overflow-y-auto max-h-screen"
                >
                  <div>
                    <DescList
                      currentSlides={currentSlides}
                      setCurrentSlides={setCurrentSlides}
                      selectedSlideId={selectedSlideId}
                      setSelectedSlideId={setSelectedSlideId}
                      presentationId={presentationId}
                      showTextModal={showTextModal}
                      handleTextCancel={handleTextCancel}
                      isTextModalOpen={isTextModalOpen}
                      showImageModal={showImageModal}
                      isCodeModalOpen={isCodeModalOpen}
                      showCodeModal={showCodeModal}
                      isFontModalOpen={isFontModalOpen}
                      showFontModal={showFontModal}
                      handleFontCancel={handleFontCancel}
                      isVideoModalOpen={isVideoModalOpen}
                      showVideoModal={showVideoModal}
                      handleVideoCancel={handleVideoCancel}
                      showBackgroundModal={showBackgroundModal}
                      isBackgroundModalOpen={isBackgroundModalOpen}
                      handleBackgroundCancel={handleBackgroundCancel}
                      setIsHidden={setIsHidden}
                      handleLeftRightKeyPress={handleLeftRightKeyPress}
                      setIsListHidden={setIsListHidden}
                    />
                  </div>
                </Splitter.Panel>
                <Splitter.Panel>
                  <DescSlide
                    currentSlides={currentSlides}
                    presentationId={presentationId}
                    selectedSlideId={selectedSlideId}
                    showTextModal={showTextModal}
                    setTextSizeLength={setTextSizeLength}
                    setTextSizeWidth={setTextSizeWidth}
                    setTextInput={setTextInput}
                    setTextFontSize={setTextFontSize}
                    setTextFontColor={setTextFontColor}
                    setSelectedElementId={setSelectedElementId}
                    showImageModal={showImageModal}
                    setImageSizeLength={setImageSizeLength}
                    setImageSizeWidth={setImageSizeWidth}
                    setImageAlt={setImageAlt}
                    setUploadImage={setUploadImage}
                    showCodeModal={showCodeModal}
                    setCurrentSlides={setCurrentSlides}
                    showVideoModal={showVideoModal}
                    setVideoUrl={setVideoUrl}
                    setVideoSizeLength={setVideoSizeLength}
                    setVideoSizeWidth={setVideoSizeWidth}
                    setVideoAutoplay={setVideoAutoplay}
                    showBackgroundModal={showBackgroundModal}
                    setBackgroundColor={setBackgroundColor}
                    setBackgroundGradient={setBackgroundGradient}
                    setBackgroundImage={setBackgroundImage}
                    setBackgroundType={setBackgroundType}
                    text="Second"
                  />
                </Splitter.Panel>
              </Splitter>

              {/* <DescSlide
                currentSlides={currentSlides}
                presentationId={presentationId}
                selectedSlideId={selectedSlideId}
                showTextModal={showTextModal}
                setTextSizeLength={setTextSizeLength}
                setTextSizeWidth={setTextSizeWidth}
                setTextInput={setTextInput}
                setTextFontSize={setTextFontSize}
                setTextFontColor={setTextFontColor}
                setSelectedElementId={setSelectedElementId}
                showImageModal={showImageModal}
                setImageSizeLength={setImageSizeLength}
                setImageSizeWidth={setImageSizeWidth}
                setImageAlt={setImageAlt}
                setUploadImage={setUploadImage}
                showCodeModal={showCodeModal}
                setCurrentSlides={setCurrentSlides}
                showVideoModal={showVideoModal}
                setVideoUrl={setVideoUrl}
                setVideoSizeLength={setVideoSizeLength}
                setVideoSizeWidth={setVideoSizeWidth}
                setVideoAutoplay={setVideoAutoplay}
                showBackgroundModal={showBackgroundModal}
                setBackgroundColor={setBackgroundColor}
                setBackgroundGradient={setBackgroundGradient}
                setBackgroundImage={setBackgroundImage}
                setBackgroundType={setBackgroundType}
                text="Second"
              /> */}
            </Content>
          </Layout>
        )}

        {/* modal for input text */}
        <Modal
          title="Input Text"
          open={isTextModalOpen}
          onOk={handleTextOk}
          onCancel={handleTextCancel}
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
              {/* <Input
              value={textSizeLength}
              placeholder="input placeholder"
              addonAfter="px"
              onChange={(e) => {
                setTextSizeLength(e.target.value);
              }}
            /> */}
              <Input
                value={textSizeLength}
                placeholder="Please enter the length (0-100)"
                addonAfter="%"
                type="number"
                min={0}
                max={100}
                onChange={(e) => {
                  setTextSizeLength(e.target.value);
                }}
              />
            </Form.Item>

            <Form.Item label="Size width">
              {/* <Input
              value={textSizeWidth}
              placeholder="input placeholder"
              addonAfter="px"
              onChange={(e) => {
                setTextSizeWidth(e.target.value);
              }}
            /> */}
              <Input
                value={textSizeWidth}
                placeholder="Please enter the width (0-100)"
                addonAfter="%"
                type="number"
                min={0}
                max={100}
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
                  setTextFontSize(e);
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

        {/* modal for image input */}
        <Modal
          title="Input Image"
          open={isImageModalOpen}
          onOk={handleImageOk}
          onCancel={handleImageCancel}
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
            {/* for image length */}
            <Form.Item label="Size length">
              <Input
                value={imageSizeLength}
                type="number"
                placeholder="Please enter the length (0-100)"
                // addonAfter="px"
                addonAfter="%"
                onChange={(e) => {
                  setImageSizeLength(e.target.value);
                }}
              />
            </Form.Item>

            {/* for image width */}
            <Form.Item label="Size width">
              <Input
                value={imageSizeWidth}
                type="number"
                placeholder="Please enter the width (0-100)"
                // addonAfter="px"
                addonAfter="%"
                onChange={(e) => {
                  setImageSizeWidth(e.target.value);
                }}
              />
            </Form.Item>

            {/* for image alt text */}
            <Form.Item label="alt">
              <TextArea
                value={imageAlt}
                placeholder="Input your alt here"
                onChange={(e) => {
                  setImageAlt(e.target.value);
                }}
              />
            </Form.Item>

            {/* for uploading image */}
            <Form.Item label="upload image">
              <Upload beforeUpload={handleImageUplod}>
                <Button
                  value={uploadImage}
                  onChange={(e) => {
                    setUploadImage(e.target.value);
                  }}
                  icon={<UploadOutlined />}
                >
                  Upload
                </Button>
              </Upload>
            </Form.Item>
          </Form>
        </Modal>

        {/* Modal for video input */}
        <Modal
          title="Input Video"
          open={isVideoModalOpen}
          onOk={handleVideoOk}
          onCancel={handleVideoCancel}
        >
          <Form layout="vertical">
            <Form.Item label="Size Length (%)">
              <Input
                placeholder="Please enter the length (0-100)"
                type="number"
                min={0}
                max={100}
                value={videoSizeLength}
                onChange={(e) => setVideoSizeLength(e.target.value)}
              />
            </Form.Item>
            <Form.Item label="Size Width (%)">
              <Input
                placeholder="Please enter the width (0-100)"
                type="number"
                min={0}
                max={100}
                value={videoSizeWidth}
                onChange={(e) => setVideoSizeWidth(e.target.value)}
              />
            </Form.Item>
            <Form.Item label="Video URL (YouTube Embed)">
              <Input
                placeholder="https://www.youtube.com/embed/dQw4w9WgXcQ?si=ZVLBiX_k2dqcfdBt"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
              />
            </Form.Item>
            <Form.Item label="Autoplay">
              <Select
                value={videoAutoplay}
                onChange={(value) => setVideoAutoplay(value)}
              >
                <Select.Option value={false}>No</Select.Option>
                <Select.Option value={true}>Yes</Select.Option>
              </Select>
            </Form.Item>
          </Form>
        </Modal>

        {/* Modal for code input */}
        <Modal
          title="Input Code"
          open={isCodeModalOpen}
          onOk={handleCodeOk}
          onCancel={handleCodeCancel}
        >
          <Form layout="vertical">
            <Form.Item label="Block Size Length (%)">
              <Input
                placeholder="Please enter the length (0-100)"
                type="number"
                min={0}
                max={100}
                value={codeLeight}
                // value={codeBlockSize.length}
                onChange={(e) =>
                  // setCodeBlockSize({ ...codeBlockSize, length: e.target.value })
                  setCodeLeight(e.target.value)
                }
              />
            </Form.Item>
            <Form.Item label="Block Size Width (%)">
              <Input
                placeholder="Please enter the width (0-100)"
                type="number"
                min={0}
                max={100}
                // value={codeBlockSize.width}
                value={codeWidth}
                onChange={(e) => setCodeWidth(e.target.value)}
              />
            </Form.Item>
            <Form.Item label="Code Content">
              <TextArea
                value={codeContent}
                onChange={(e) => setCodeContent(e.target.value)}
                autoSize={{ minRows: 5 }}
              />
            </Form.Item>
            <Form.Item label="Font Size (em)">
              <InputNumber
                placeholder="Number"
                type="number"
                min={0.5}
                max={5}
                step={0.1}
                value={codeFontSize}
                onChange={(value) => setCodeFontSize(value)}
              />
            </Form.Item>
          </Form>
        </Modal>
        {/* Modal for font change inside the text box */}
        <Modal
          title="Select Font Family"
          open={isFontModalOpen}
          onOk={handleFontOk}
          onCancel={handleFontCancel}
        >
          <Form layout="vertical">
            <Form.Item label="Font Family">
              <Select
                value={textFontFamily}
                onChange={(value) => setTextFontFamily(value)}
              >
                <Select.Option value="Quicksand, sans-serif">
                  Quicksand
                </Select.Option>
                <Select.Option value="Edu AU VIC WA NT Pre, cursive">
                  Edu AU VIC WA NT Pre
                </Select.Option>
                <Select.Option value="Courier New, monospace">
                  Courier New
                </Select.Option>
                <Select.Option value="Kode Mono, monospace">
                  Kode Mono
                </Select.Option>
              </Select>
            </Form.Item>
          </Form>
        </Modal>
        {/* Modal for setting slide background */}
        <Modal
          title="Set Slide Background"
          open={isBackgroundModalOpen}
          onOk={handleBackground}
          onCancel={handleBackgroundCancel}
        >
          <Form layout="vertical">
            <Form.Item label="Background Type">
              <Select
                value={backgroundType}
                onChange={(value) => setBackgroundType(value)}
              >
                <Select.Option value="solid">Solid Colour</Select.Option>
                <Select.Option value="gradient">Gradient</Select.Option>
                <Select.Option value="image">Image</Select.Option>
              </Select>
            </Form.Item>

            {backgroundType === "solid" && (
              <Form.Item label="Background Colour">
                <ColorPicker
                  value={backgroundColor}
                  defaultValue={"#ffffff"}
                  allowClear
                  onChange={(temp, _) => {
                    setBackgroundColor(temp.toHexString());
                  }}
                />
              </Form.Item>
            )}

            {backgroundType === "gradient" && (
              <>
                <Form.Item label="Gradient Start Colour">
                  <ColorPicker
                    value={backgroundGradient.start}
                    defaultValue={"#ffffff"}
                    allowClear
                    onChange={(temp, _) => {
                      setBackgroundGradient((prev) => ({
                        ...prev,
                        start: temp.toHexString(),
                      }));
                    }}
                  />
                </Form.Item>
                <Form.Item label="Gradient End Colour">
                  <ColorPicker
                    value={backgroundGradient.end}
                    defaultValue={"#000000"}
                    allowClear
                    onChange={(temp, _) => {
                      setBackgroundGradient((prev) => ({
                        ...prev,
                        end: temp.toHexString(),
                      }));
                    }}
                  />
                </Form.Item>
                <Form.Item label="Gradient Direction">
                  <Select
                    value={backgroundGradient.direction}
                    onChange={(value) =>
                      setBackgroundGradient((prev) => ({
                        ...prev,
                        direction: value,
                      }))
                    }
                  >
                    <Select.Option value="to bottom">
                      Top to Bottom
                    </Select.Option>
                    <Select.Option value="to right">
                      Left to Right
                    </Select.Option>
                    <Select.Option value="to bottom right">
                      Top Left to Bottom Right
                    </Select.Option>
                  </Select>
                </Form.Item>
              </>
            )}

            {backgroundType === "image" && (
              <Form.Item label="Upload Background Image">
                <Upload beforeUpload={handleBackgroundImageUpload}>
                  <Button icon={<UploadOutlined />}>Upload Image</Button>
                </Upload>
              </Form.Item>
            )}
          </Form>
        </Modal>
      </Layout>
    </>
  );
}

export default PresentationPage;
