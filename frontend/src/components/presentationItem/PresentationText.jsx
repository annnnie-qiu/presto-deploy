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
  setTextFontFamily,
  setSelectedElementId,
}) {
  return (
    <Draggable>
      <div
        style={{
          // width: "1000px",
          // height: "1000px",
          width: `${data?.textSizeLength}%`,
          height: `${data?.textSizeWidth}%`,
          color: data?.textFontColor,
          fontSize: `${data?.textFontSize}em`,
          fontFamily: data?.textFontFamily || 'Quicksand, sans-serif',
          overflow: "hidden",
        }}
        className=" border border-gray-300 "
        onDoubleClick={async () => {
          console.log("double clicked");

          setTextSizeLength(data.textSizeLength);
          setTextSizeWidth(data.textSizeWidth);
          setTextInput(data.textInput);
          setTextFontSize(data.textFontSize);
          setTextFontColor(data.textFontColor);
          setTextFontFamily(data.textFontFamily);
          setSelectedElementId(data.id);
          showTextModal();
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
    </Draggable>
  );
}

export default PresentationText;
