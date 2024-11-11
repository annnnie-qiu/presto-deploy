import React, { useEffect, useRef, useState } from "react";
import Draggable from "react-draggable";
import hljs from "highlight.js";
import "highlight.js/styles/github.css";
import Handlebars from "handlebars";
import { Rnd } from "react-rnd";
import { getUpdateDetail } from "../../../utils/API/Send_ReceiveDetail/get_updateDetail";
import PresentationSlideMove from "./PresentationSlideMove";

function PresentationCode({
  data,
  showCodeModal,
  setCodeBlockSize,
  setCodeContent,
  setCodeFontSize,
  setSelectedElementId,
  boundsRef,
  currentSlides,
  selectedSlideId,
  setCurrentSlides,
  presentationId,
}) {
  const codeRef = useRef(null);

  // escape HTML using Handlebars
  const escapeHtml = (unsafeHtml) => {
    return Handlebars.Utils.escapeExpression(unsafeHtml);
  };

  useEffect(() => {
    if (codeRef.current) {
      codeRef.current.removeAttribute("data-highlighted");
      codeRef.current.classList.remove(
        ...Array.from(codeRef.current.classList).filter((cls) =>
          cls.startsWith("hljs")
        )
      );

      // Set the escaped content to the code element
      codeRef.current.innerHTML = escapeHtml(data.codeContent);

      // Highlight the element
      hljs.highlightElement(codeRef.current);
    }
  }, [data.codeContent]);

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
            codeBlockSize: {
              // Add codeBlockSize
              width: parseFloat(size.width),
              length: parseFloat(size.height),
            },
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

    setCodeBlockSize(data.codeBlockSize);
    setCodeContent(data.codeContent);
    setCodeFontSize(data.codeFontSize);
    setSelectedElementId(data.id);
    showCodeModal();
  };

  return (
    <Rnd
      default={{
        x: `${data?.position.x}`,
        y: `${data?.position.y}`,
      }}
      className="border border-gray-300"
      bounds={boundsRef.current}
      style={{
        width: `${data?.codeBlockSize?.width}%`,
        height: `${data?.codeBlockSize?.length}%`,
        fontSize: `${data?.codeFontSize}em`,
        overflow: "hidden",
        margin: "0px",
        padding: "0px",
        backgroundColor: "transparent",
      }}
      onClick={(e) => {
        console.log("click event111", e);
        setIsMoveActive(!isMoveActive);
        handleClick();
      }}
      onDragStop={handleDragStop}
      onResizeStop={handleResizeStop}
    >
      <div
        style={{
          width: `${data?.codeBlockSize?.width}%`,
          height: `${data?.codeBlockSize?.length}%`,
        }}
      >
        <pre
          style={{
            margin: "0",
            padding: "0",
            textAlign: "left",
            overflow: "auto",
            height: "100%",
            width: "100%",
          }}
        >
          <code
            ref={codeRef}
            style={{
              margin: "0",
              padding: "0",
              textAlign: "left",
              display: "block",
            }}
          ></code>
        </pre>
      </div>
    </Rnd>
  );
}

export default PresentationCode;
