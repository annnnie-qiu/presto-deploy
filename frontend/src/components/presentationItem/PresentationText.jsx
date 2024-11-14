import React, { useState } from "react";
import { Rnd } from "react-rnd";
import { getUpdateDetail } from "../../../utils/API/Send_ReceiveDetail/get_updateDetail";
import PresentationSlideMove from "./PresentationSlideMove";
import { Modal } from "antd";
// import { CodepenSquareFilled } from "@ant-design/icons";

function PresentationText({
  data,
  showTextModal,
  setTextSizeLength,
  setTextSizeWidth,
  setTextInput,
  setTextFontSize,
  setTextFontColor,
  setTextFontFamily,
  setSelectedElementId,
  boundsRef,
  currentSlides,
  selectedSlideId,
  setCurrentSlides,
  presentationId,
}) {
  // Adjust the initial position and dimensions
  const adjustedPosition = {
    x: data.position.x * 0.615,
    y: data.position.y * 0.687,
  };
  const adjustedWidth = data.textSizeWidth * 0.615;
  const adjustedHeight = data.textSizeLength * 0.687;

  const [isMoveActive, setIsMoveActive] = useState(false);
  // const [position, setPosition] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [position, setPosition] = useState(adjustedPosition);

  const handleDragStop = async (e, position) => {
    console.log("drag stopped", position);
    setPosition({ x: position.x, y: position.y });
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
    console.log("currentSlides drage", currentSlides);
  };

  const handleResizeStop = (e, direction, ref, delta, position) => {
    console.log("resize stopped", ref.style.width, ref.style.height);
    console.log("boundsRef", boundsRef);
    // if (boundsRef.current) {
    const containerWidth = boundsRef.current.clientWidth;
    const containerHeight = boundsRef.current.clientHeight;

    // Calculate new dimensions in percentage relative to container
    // const newWidthPercentage = (ref.offsetWidth / containerWidth) * 100 * 0.7;
    const newWidthPercentage = (ref.offsetWidth / containerWidth) * 100;
    const newHeightPercentage =
      (ref.offsetHeight / containerHeight) * 100;

    console.log("newWidthPercentage", newWidthPercentage);
    console.log("newHeightPercentage", newHeightPercentage);

    setSize({
      // width: ref.style.width,
      // height: ref.style.height,
      width: newWidthPercentage,
      height: newHeightPercentage,
    });
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
            // textSizeLength: ref.style.height,
            // textSizeWidth: ref.style.width,
            textSizeLength: newHeightPercentage,
            textSizeWidth: newWidthPercentage,
          }
        : element
    );

    getUpdateDetail(
      presentationId,
      selectedSlideId,
      newContent,
      currentSlides,
      setCurrentSlides
    );
    console.log("currentSlides resize", currentSlides);
    // }
  };

  const [lastClickTime, setLastClickTime] = useState(0);
  const handleClick = () => {
    // console.log("click event", e);
    // if (e.type === "click") {
    //   console.log("left click");
    // } else if (e.type === "contextmenu") {
    //   console.log("Right click");
    // }
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

    setTextSizeLength(data.textSizeLength);
    setTextSizeWidth(data.textSizeWidth);
    setTextInput(data.textInput);
    setTextFontSize(data.textFontSize);
    setTextFontColor(data.textFontColor);
    // setTextFontFamily(data.textFontFamily);
    setSelectedElementId(data.id);
    showTextModal();
  };

  const handleContextMenu = (event) => {
    event.preventDefault(); // Prevent default right-click menu
    showModal();
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
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
  console.log("data", data);

  return (
    <Rnd
      // default={{
      //   x: `${data?.position.x}%`,
      //   y: `${data?.position.y}%`,
      // }}
      size={{
        // width: `${adjustedWidth}%`,
        // height: `${adjustedHeight}%`,
        width: `${data?.textSizeWidth}%`,
        height: `${data?.textSizeLength}%`,
      }}
      position={position}
      className="border border-gray-300"
      bounds={boundsRef.current}
      style={{
        width: `${data?.textSizeWidth}`,
        height: `${data?.textSizeLength}`,
        color: data?.textFontColor,
        fontSize: `${data?.textFontSize}em`,
        fontFamily: data?.textFontFamily || "Quicksand, sans-serif",
        overflow: "show",
        cursor: isMoveActive ? "move" : "default",
        position: "window",
        // position: "relative",
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
          width: `${data?.textSizeWidth}`,
          height: `${data?.textSizeLength}`,
          // width: "100%",
          // height: "100%",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {data ? (
          <span>
            {data.textInput.split("\n").map((line, index) => (
              <React.Fragment key={index}>
                {line}
                <br />
              </React.Fragment>
            ))}
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
  );
}

export default PresentationText;
