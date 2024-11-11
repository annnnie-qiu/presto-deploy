import Draggable from "react-draggable";
import React, { useState } from "react";
import { getDetail } from "../../../utils/API/Send_ReceiveDetail/send_receiveDetail";
import { Rnd } from "react-rnd";
import sendDetail  from "../../../utils/API/Send_ReceiveDetail/send_receiveDetail";
import { getUpdateDetail } from "../../../utils/API/Send_ReceiveDetail/get_updateDetail";
import PresentationSlideMove from "./PresentationSlideMove";


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
  const [isMoveActive, setIsMoveActive] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

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
    getUpdateDetail(presentationId, selectedSlideId, newContent, currentSlides, setCurrentSlides);
  };

  console.log("data", data);

  return (
    <Rnd
      default={{
        x: `${data?.position.x}`,
        y: `${data?.position.y}`,
      }}
      className="border border-gray-300"
      bounds={boundsRef.current}
      // bounds="window"
      style={{
        width: `${data?.textSizeLength}%`,
        height: `${data?.textSizeWidth}%`,
        color: data?.textFontColor,
        fontSize: `${data?.textFontSize}em`,
        fontFamily: data?.textFontFamily || "Quicksand, sans-serif",
        overflow: "hidden",
        cursor: isMoveActive ? "move" : "default",
        position: "window",
      }}
      onDoubleClick={async () => {
        console.log("double clicked");

        setTextSizeLength(data.textSizeLength);
        setTextSizeWidth(data.textSizeWidth);
        setTextInput(data.textInput);
        setTextFontSize(data.textFontSize);
        setTextFontColor(data.textFontColor);
        // setTextFontFamily(data.textFontFamily);
        setSelectedElementId(data.id);
        showTextModal();
      }}
      onClick={() => {
        console.log("clicked");
        setIsMoveActive(!isMoveActive);
      }}
      onDragStop={handleDragStop}
    >
      <div>
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

        {/* Corner Handles */}
        {isMoveActive && (
          PresentationSlideMove
        )}
      </div>
    </Rnd>
  );
}

export default PresentationText;
