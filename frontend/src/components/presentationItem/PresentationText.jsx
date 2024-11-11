import Draggable from "react-draggable";
import React, { useState } from "react";
import { getDetail } from "../../../utils/API/Send_ReceiveDetail/send_receiveDetail";
import { Rnd } from "react-rnd";

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
}) {
  const [isMoveActive, setIsMoveActive] = useState(false);

  return (
    <Rnd
      className="border border-gray-300"
      bounds="window"
      style={{
        width: `${data?.textSizeLength}%`,
        height: `${data?.textSizeWidth}%`,
        color: data?.textFontColor,
        fontSize: `${data?.textFontSize}em`,
        fontFamily: data?.textFontFamily || "Quicksand, sans-serif",
        overflow: "hidden",
        cursor: isMoveActive ? "move" : "default",
        position: "relative",
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
