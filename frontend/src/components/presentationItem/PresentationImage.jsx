import React, { useState } from "react";
import { Rnd } from "react-rnd";
import PresentationSlideMove from "./PresentationSlideMove";
import { getUpdateDetail } from "../../../utils/API/Send_ReceiveDetail/get_updateDetail";
import { Modal } from "antd";

function PresentationImage({
  data,
  showImageModal,
  setImageSizeLength,
  setImageSizeWidth,
  setImageAlt,
  setSelectedElementId,
  setUploadImage,
  boundsRef,
  currentSlides,
  selectedSlideId,
  setCurrentSlides,
  presentationId,
  isHidden,
}) {
  const [isMoveActive, setIsMoveActive] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleDragStop = async (e, newPos) => {
    if (!isMoveActive) return;
    console.log("drag stopped", newPos);
    setPosition({ x: newPos.x, y: newPos.y });
    // save the text to the backend
    const targetIndex = currentSlides.findIndex(
      (slide) => slide.slideId === selectedSlideId
    );
    // Update existing content
    const newContent = currentSlides[targetIndex].content.map((element) =>
      element.id === data.id
        ? {
            ...element,
            position: { x: newPos.x, y: newPos.y },
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

  const handleResizeStop = (e, direction, ref, delta, position) => {
    if (!isMoveActive) return;
    const containerWidth = boundsRef.current.clientWidth;
    const containerHeight = boundsRef.current.clientHeight;

    // Calculate new dimensions in percentage relative to container
    const newWidthPercentage = (ref.offsetWidth / containerWidth) * 100;
    const newHeightPercentage = (ref.offsetHeight / containerHeight) * 100;

    // setPosition({
    //   x: position.x,
    //   y: position.y,
    // });
    // save the text to the backend
    const targetIndex = currentSlides.findIndex(
      (slide) => slide.slideId === selectedSlideId
    );

    // Edit mode
    // Update existing content
    const newContent = currentSlides[targetIndex].content.map((element) =>
      element.id === data.id
        ? {
            ...element,
            position: { x: position.x, y: position.y },
            imageSizeLength: newHeightPercentage,
            imageSizeWidth: newWidthPercentage,
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

  const onDoubleClick = async () => {
    console.log("double clicked");
    setImageSizeLength(data.imageSizeLength);
    setImageSizeWidth(data.imageSizeWidth);
    setImageAlt(data.imageAlt);
    setSelectedElementId(data.id);
    setUploadImage(data.uploadImage);
    showImageModal();
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
    <>
      {!isHidden && (
        <Rnd
          size={{
            width: `${data?.imageSizeWidth}%`,
            height: `${data?.imageSizeLength}%`,
          }}
          position={{
            x: data?.position.x || 0,
            y: data?.position.y || 0,
          }}
          style={{
            position: "window",
            overflow: "show",
            cursor: isMoveActive ? "move" : "default",
          }}
          className="border border-gray-300"
          bounds={boundsRef.current}
          onClick={() => {
            setIsMoveActive(!isMoveActive);
            handleClick();
          }}
          onDragStop={handleDragStop}
          onResizeStop={handleResizeStop}
          onContextMenu={handleContextMenu}
        >
          <div
            size={{
              width: "100%",
              height: "100%",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {data ? (
              <span>
                <img
                  src={`${data.uploadImage}`}
                  alt={`${data.imageAlt}`}
                  // className="w-full h-full"
                />
              </span>
            ) : null}
          </div>
          {/* Corner Handles */}
          {isMoveActive && PresentationSlideMove()}

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
      )}

      {isHidden && (
        <div
          size={{
            width: `${data?.imageSizeWidth}%`,
            height: `${data?.imageSizeLength}%`,
          }}
          style={{
            position: "window",
            overflow: "show",
            cursor: isMoveActive ? "move" : "default",
          }}
        >
          <div
            size={{
              width: "100%",
              height: "100%",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {data ? (
              <span>
                <img
                  src={`${data.uploadImage}`}
                  alt={`${data.imageAlt}`}
                  // className="w-full h-full"
                />
              </span>
            ) : null}
          </div>
        </div>
      )}
    </>
  );
}

export default PresentationImage;
