import Draggable from "react-draggable";
import React, { useState } from "react";
import { getDetail } from "../../../utils/API/Send_ReceiveDetail/send_receiveDetail";

function PresentationText({ data }) {
  console.log("here: ", data);
  // console.log(data?.textSizeLength);
  // console.log(data?.textSizeWidth);
  console.log(data?.textFontColor);
  // console.log(data?.textFontSize);
  // console.log(data?.textInput);
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
