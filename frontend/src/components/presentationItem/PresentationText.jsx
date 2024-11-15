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
  setSelectedElementId,
  boundsRef,
  currentSlides,
  selectedSlideId,
  setCurrentSlides,
  presentationId,
  isHidden,
  setTriggerByDoubleClick,
}) {
  const [isMoveActive, setIsMoveActive] = useState(false);

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

    setTextSizeLength(data.textSizeLength);
    setTextSizeWidth(data.textSizeWidth);
    setTextInput(data.textInput);
    setTextFontSize(data.textFontSize);
    setTextFontColor(data.textFontColor);
    setSelectedElementId(data.id);
    setTriggerByDoubleClick(true);
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
    const targetIndex = currentSlides.findIndex(
      (slide) => slide.slideId === selectedSlideId
    );
    const newContent = currentSlides[targetIndex].content.filter(
      (element) => element.id !== data.id // Exclude the element with the matching id
    );
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

  const handleResizeStop = (e, direction, ref, delta, position) => {
    if (!isMoveActive) return;
    const containerWidth = boundsRef.current.clientWidth;
    const containerHeight = boundsRef.current.clientHeight;

    // Calculate new dimensions in percentage relative to container
    const newWidthPercentage = (ref.offsetWidth / containerWidth) * 100;
    const newHeightPercentage = (ref.offsetHeight / containerHeight) * 100;
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
  };

  const handleDragStop = async (e, newPos) => {
    if (!isMoveActive) return;

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
          position: { x: newPos.x, y: newPos.y },
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
  };

  return (
    <>
      {!isHidden && (
        <Rnd
          size={{
            width: `${data?.textSizeWidth}%`,
            height: `${data?.textSizeLength}%`,
          }}
          position={data?.position}
          className={`${isHidden ? "" : "border border-gray-300"}`}
          bounds={boundsRef.current}
          style={{
            // width: `${data?.textSizeWidth}`,
            // height: `${data?.textSizeLength}`,
            color: data?.textFontColor,
            fontSize: `${data?.textFontSize}em`,
            fontFamily: data?.textFontFamily || "Quicksand, sans-serif",
            overflow: "show",
            cursor: isMoveActive ? "move" : "default",
            position: "window",
            // position: "relative",
          }}
          onClick={() => {
            setIsMoveActive((current) => !current);
            handleClick();
          }}
          onDragStop={handleDragStop}
          onResizeStop={handleResizeStop}
          onContextMenu={handleContextMenu}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
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
      )}

      {isHidden && (
        <div
          size={{
            width: `${data?.textSizeWidth}%`,
            height: `${data?.textSizeLength}%`,
          }}
          className={`${isHidden ? "" : "border border-gray-300"}`}
          style={{
            // width: `${data?.textSizeWidth}`,
            // height: `${data?.textSizeLength}`,
            color: data?.textFontColor,
            fontSize: `${data?.textFontSize}em`,
            fontFamily: data?.textFontFamily || "Quicksand, sans-serif",
            overflow: "show",
            cursor: isMoveActive ? "move" : "default",
            // position: "window",
            position: "absolute",
            // left: `${data?.position.x}px`,
            // top: `${data?.position.y}px`,
            // position: "relative",
          }}
          onClick={() => {
            setIsMoveActive(!isMoveActive);
            handleClick();
          }}
        >
          <div
            style={{
              // width: `${data?.textSizeWidth}`,
              // height: `${data?.textSizeLength}`,
              width: "100%",
              height: "100%",
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
        </div>
      )}
    </>
  );
}

export default PresentationText;
