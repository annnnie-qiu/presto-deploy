import Draggable from "react-draggable";
import React, { useState } from "react";
import { getDetail } from "../../../utils/API/Send_ReceiveDetail/send_receiveDetail";

function PresentationText({
  data,
  showTextModal,
  setTextSizeLength,
  setTextSizeWidth,
  setTextInput,
  setTextFontSize,
  setTextFontColor,
  setSelectedElementId,
}) {
  const [isMoveActive, setIsMoveActive] = useState(false);

  return (
    <Draggable>
      <div
        style={{
          // width: "1000px",
          // height: "1000px",
          width: `${data?.textSizeLength}px`,
          height: `${data?.textSizeWidth}px`,
          color: data?.textFontColor,
          fontSize: `${data?.textFontSize}em`,
          overflow: "hidden",
          cursor: isMoveActive ? "move" : "default",
          position: "relative",
        }}
        className=" border border-gray-300 "
        onDoubleClick={async () => {
          console.log("double clicked");

          setTextSizeLength(data.textSizeLength);
          setTextSizeWidth(data.textSizeWidth);
          setTextInput(data.textInput);
          setTextFontSize(data.textFontSize);
          setTextFontColor(data.textFontColor);
          setSelectedElementId(data.id);
          showTextModal();
        }}
        onClick={() => {
          console.log("clicked");
          setIsMoveActive(!isMoveActive);
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
    </Draggable>
  );
}

export default PresentationText;
