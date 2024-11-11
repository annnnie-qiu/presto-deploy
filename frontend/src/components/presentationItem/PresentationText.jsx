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
    // <Draggable>
    // <Rnd
    //   default={{
    //     x: 150,
    //     y: 205,
    //     width: 500,
    //     height: 190,
    //   }}
    //   minWidth={500}
    //   minHeight={190}
    //   bounds="window"
    // >
    //   <div
    //     style={{
    //       // width: "1000px",
    //       // height: "1000px",
    //       width: `${data?.textSizeLength}%`,
    //       height: `${data?.textSizeWidth}%`,
    //       color: data?.textFontColor,
    //       fontSize: `${data?.textFontSize}em`,
    //       fontFamily: data?.textFontFamily || "Quicksand, sans-serif",
    //       overflow: "hidden",
    //       cursor: isMoveActive ? "move" : "default",
    //       position: "relative",
    //     }}
    //     className=" border border-gray-300 "
    //     onDoubleClick={async () => {
    //       console.log("double clicked");

    //       setTextSizeLength(data.textSizeLength);
    //       setTextSizeWidth(data.textSizeWidth);
    //       setTextInput(data.textInput);
    //       setTextFontSize(data.textFontSize);
    //       setTextFontColor(data.textFontColor);
    //       // setTextFontFamily(data.textFontFamily);
    //       setSelectedElementId(data.id);
    //       showTextModal();
    //     }}
    //     onClick={() => {
    //       console.log("clicked");
    //       setIsMoveActive(!isMoveActive);
    //     }}
    //   >
    //     <div style={{ margin: 0, height: "100%", paddingBottom: "40px" }}>
    //       {data ? (
    //         <span>
    //           {data.textInput.split("\n").map((line, index) => (
    //             <React.Fragment key={index}>
    //               {line}
    //               <br />
    //             </React.Fragment>
    //           ))}
    //         </span>
    //       ) : null}
    //     </div>
    //   </div>
    // </Rnd>
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
      </div>
    </Rnd>
  );
}

export default PresentationText;
