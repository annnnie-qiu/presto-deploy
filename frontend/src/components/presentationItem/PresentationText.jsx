import Draggable from "react-draggable";
import React, { useState } from "react";
import { getDetail } from "../../../utils/API/Send_ReceiveDetail/send_receiveDetail";

function PresentationText({ data, showModal, presentationId, selectedSlideId }) {
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
        className=" border border-gray-300 "
        onDoubleClick={async () => {
          console.log("double clicked");
          // find the details of the presentation TODO: change to the current presentation
          const response = await getDetail(localStorage.getItem("token"));
          const { store } = response;
          // find the presentation with the given ID
          const presentation = store.presentations.find(
            (presentation) => presentation.id == presentationId
          );
          console.log("presentation: ", presentation);
          console.log("presentationId: ", presentationId);
          console.log("selectedSlideId: ", selectedSlideId);
          // find the slide with the given ID
          const slide = presentation.slides.find(
            (slide) => slide.slideId == selectedSlideId
          );
          console.log("slide: ", slide);
          // find the data with the given ID

          console.log("data: ", data);
          
          showModal();
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
