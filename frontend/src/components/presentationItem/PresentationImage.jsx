import React, { useState } from "react";
import { Rnd } from "react-rnd";
import PresentationSlideMove from "./PresentationSlideMove";
import { getUpdateDetail } from "../../../utils/API/Send_ReceiveDetail/get_updateDetail";

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
}) {
  const [isMoveActive, setIsMoveActive] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleDragStop = async (e, position) => {
    console.log("drag stopped", position);
    setPosition({ x: position.x, y: position.y });
    // save the text to the backend
    const targetIndex = currentSlides.findIndex(
      (slide) => slide.slideId === selectedSlideId
    );
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
    console.log("double clicked");
    setImageSizeLength(data.imageSizeLength);
    setImageSizeWidth(data.imageSizeWidth);
    setImageAlt(data.imageAlt);
    setSelectedElementId(data.id);
    setUploadImage(data.uploadImage);
    showImageModal();
  };
  console.log("data", data);
  console.log("boundsRef", boundsRef);
  return (
    <Rnd
      default={{
        x: `${data?.position.x}`,
        y: `${data?.position.y}`,
      }}
      className="border border-gray-300"
      bounds={boundsRef.current}
      style={{
        width: `${data?.imageSizeLength}%`,
        height: `${data?.imageSizeWidth}%`,
        color: data?.textFontColor,
        overflow: "hidden",
        cursor: isMoveActive ? "move" : "default",
        position: "window",
      }}
      onClick={() => {
        setIsMoveActive(!isMoveActive);
        handleClick();
      }}
      onDragStop={handleDragStop}
    >
      <div>
        {data ? (
          <span>
            <img
              src={`${data.uploadImage}`}
              alt={`${data.imageAlt}`}
              width="100%"
              height="100%"
            />
          </span>
        ) : null}

        {/* Corner Handles */}
        {isMoveActive && PresentationSlideMove}
      </div>
    </Rnd>
  );
}

export default PresentationImage;
