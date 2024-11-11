import Draggable from "react-draggable";
import React, { useState } from "react";
import { getDetail } from "../../../utils/API/Send_ReceiveDetail/send_receiveDetail";
import { Rnd } from "react-rnd";
import sendDetail  from "../../../utils/API/Send_ReceiveDetail/send_receiveDetail";

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
  const [position, setPosition] = useState({ x: 150, y: 205 });

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
    // get detail from backend
    const token = localStorage.getItem("token");
    const detail = await getDetail(token);
    const { store } = detail;
    console.log("store", store);
    console.log("presentationId", presentationId);
    // find the current presentation
    const presentation = store.presentations.find(
      (presentation) => presentation.id == presentationId
    );
    console.log("presentation", presentation);
    // find the current slide

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
          <>
            <div
              style={{
                position: "absolute",
                width: "5px",
                height: "5px",
                backgroundColor: "black",
                top: "-2.5px",
                left: "-2.5px",
              }}
            />
            <div
              style={{
                position: "absolute",
                width: "5px",
                height: "5px",
                backgroundColor: "black",
                top: "-2.5px",
                right: "-2.5px",
              }}
            />
            <div
              style={{
                position: "absolute",
                width: "5px",
                height: "5px",
                backgroundColor: "black",
                bottom: "-2.5px",
                left: "-2.5px",
              }}
            />
            <div
              style={{
                position: "absolute",
                width: "5px",
                height: "5px",
                backgroundColor: "black",
                bottom: "-2.5px",
                right: "-2.5px",
              }}
            />
          </>
        )}
      </div>
    </Rnd>
  );
}

export default PresentationText;
