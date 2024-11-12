import React, { useState } from "react";
import { Rnd } from "react-rnd";
import { getUpdateDetail } from "../../../utils/API/Send_ReceiveDetail/get_updateDetail";
import PresentationSlideMove from "./PresentationSlideMove";
import { Modal } from "antd";

const PresentationVideo = ({
  showVideoModal,
  data,
  setSelectedElementId,
  setVideoUrl,
  setVideoSizeLength,
  setVideoSizeWidth,
  setVideoAutoplay,
  boundsRef,
  currentSlides,
  selectedSlideId,
  setCurrentSlides,
  presentationId,
}) => {
  const [isMoveActive, setIsMoveActive] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState({ width: 0, height: 0 });

  const handleDragStop = async (e, position) => {
    console.log("drag stopped", position);
    setPosition({ x: position.x, y: position.y });
    // save the text to the backend
    const targetIndex = currentSlides.findIndex(
      (slide) => slide.slideId === selectedSlideId
    );
    console.log("targetIndex", targetIndex);
    console.log("currentSlides", currentSlides);
    console.log("data", data);
    // Edit mode
    // Update existing content
    const newContent = currentSlides[targetIndex].content.map((element) =>
      element.id === data.id
        ? {
            ...element,
            position: { x: position.x, y: position.y },
          }
        : element
    );
    console.log("newContent", newContent);
    getUpdateDetail(
      presentationId,
      selectedSlideId,
      newContent,
      currentSlides,
      setCurrentSlides
    );
  };

  const handleResizeStop = (e, direction, ref, delta, position) => {
    setSize({
      width: ref.style.width,
      height: ref.style.height,
    });
    setPosition({
      x: position.x,
      y: position.y,
    });
    // save the text to the backend
    const targetIndex = currentSlides.findIndex(
      (slide) => slide.slideId === selectedSlideId
    );
    console.log("targetIndex", targetIndex);
    console.log("currentSlides", currentSlides);
    console.log("data", data);
    // Edit mode
    // Update existing content
    const newContent = currentSlides[targetIndex].content.map((element) =>
      element.id === data.id
        ? {
            ...element,
            position: { x: position.x, y: position.y },
            videoSizeLength: size.height,
            videoSizeWidth: size.width,
          }
        : element
    );
    console.log("newContent", newContent);
    getUpdateDetail(
      presentationId,
      selectedSlideId,
      newContent,
      currentSlides,
      setCurrentSlides
    );
  };

  const [lastClickTime, setLastClickTime] = useState(0);
  const handleClick = () => {
    const now = Date.now();
    // check if the click is a double click
    if (now - lastClickTime <= 500) {
      onDoubleClick(); // double click if in 0.5s
    }
    // update the last click time
    setLastClickTime(now);
  };

  const onDoubleClick = async () => {
    setSelectedElementId(data.id);
    setVideoUrl(data.videoUrl);
    setVideoSizeLength(data.videoSizeLength);
    setVideoSizeWidth(data.videoSizeWidth);
    setVideoAutoplay(data.videoAutoplay);
    showVideoModal();
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleContextMenu = (event) => {
    event.preventDefault();
    showModal();
  };

  const handleOk = () => {
    setIsModalOpen(false);
    // delete the presentation from the backend and navigate to the dashboard
    console.log("delete the text");
    console.log("currentSlides", currentSlides);
    const targetIndex = currentSlides.findIndex(
      (slide) => slide.slideId === selectedSlideId
    );
    console.log("targetIndex", targetIndex);
    console.log("data.id", data.id);
    console.log(
      "currentSlides[targetIndex].content",
      currentSlides[targetIndex].content
    );
    const newContent = currentSlides[targetIndex].content.filter(
      (element) => element.id !== data.id // Exclude the element with the matching id
    );
    console.log("newContent", newContent);
    getUpdateDetail(
      presentationId,
      selectedSlideId,
      newContent,
      currentSlides,
      setCurrentSlides
    );
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <Rnd
      default={{
        x: `${data?.position.x}`,
        y: `${data?.position.y}`,
      }}
      bounds={boundsRef.current}
      style={{
        position: "relative",
        border: "2px dashed #000",
        width: `${data.videoSizeWidth}%`,
        height: `${data.videoSizeLength}%`,
        margin: "0px",
        padding: "0px",
        zIndex: data.zIndex,
      }}
      onClick={(e) => {
        console.log("click event111", e);
        setIsMoveActive(!isMoveActive);
        handleClick();
      }}
      onDragStop={handleDragStop}
      onResizeStop={handleResizeStop}
      onContextMenu={handleContextMenu}
    >
      <div
        style={{
          width: `${data.videoSizeWidth}%`,
          height: `${data.videoSizeLength}%`,
        }}
      >
        <iframe
          width="100%"
          height="100%"
          src={`${data.videoUrl}${data.videoAutoplay ? "&autoplay=1" : ""}`}
          title="Embedded Video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>

      <Modal
        title="Delete this"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Yes"
        cancelText="No"
      >
        <p>Are you sure?</p>
      </Modal>
    </Rnd>
  );
};

export default PresentationVideo;
