import React, { useMemo, useState, useRef, useEffect } from "react";
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
import PresentationText from "../components/presentationItem/PresentationText";
import PresentationImage from "../components/presentationItem/PresentationImage";
import PresentationCode from "../components/presentationItem/PresentationCode";
import PresentationVideo from "../components/presentationItem/PresentationVideo";
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
  handleLeftRightKeyPress
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
        handleLeftRightKeyPress
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
        setSelectedSlideId(currentSlides[targetIndex - 1].slideId);
      } else {
        showErrorToast("This is the first slide now");
      }

      if (hasTwoSlashes) {
        window.history.pushState(
          {},
          "",
          `/presentation/${presentationId}/${selectedSlideId}`
        );
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
      if (hasTwoSlashes) {
        window.history.pushState(
          {},
          "",
          `/presentation/${presentationId}/${selectedSlideId}`
        );
      }
    }
    // }

    if (e.key === "Escape") {
      setIsHidden(false);
      window.history.pushState({}, "", `/presentation/${presentationId}`);
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
        setSelectedSlideId(currentSlides[targetIndex - 1].slideId);
      } else {
        showErrorToast("This is the first slide now");
      }

      if (hasTwoSlashes) {
        window.history.pushState(
          {},
          "",
          `/presentation/${presentationId}/${selectedSlideId}`
        );
      }
    } else if (key === "Right") {
      const targetIndex = currentSlides.findIndex(
        (slide) => slide.slideId === selectedSlideId
      );
      if (targetIndex < currentSlides.length - 1) {
        setSelectedSlideId(currentSlides[targetIndex + 1].slideId);
      } else {
        showErrorToast("This is the last slide now");
      }
      if (hasTwoSlashes) {
        window.history.pushState(
          {},
          "",
          `/presentation/${presentationId}/${selectedSlideId}`
        );
      }
    }
    // }

    if (key === "Escape") {
      setIsHidden(false);
      window.history.pushState({}, "", `/presentation/${presentationId}`);
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
    <>
      <Layout>
        {isHidden && (
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
            text="Second"
          />
        )}
      </Layout>

      <Layout>
        {!isHidden && (
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
        {!isHidden && (
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
            </Content>
          </Layout>
        )}

        
      </Layout>
    </>
  );
}

export default PresentationPage;
