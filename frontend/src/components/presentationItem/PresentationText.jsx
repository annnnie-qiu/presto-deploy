import Draggable from "react-draggable";
import React, { useState } from "react";
import { getDetail } from "../../../utils/API/Send_ReceiveDetail/send_receiveDetail";

function PresentationText({
  data,
  showModal,
  presentationId,
  selectedSlideId,
  setTextSizeLength,
  setTextSizeWidth,
  setTextInput,
  setTextFontSize,
  setTextFontColor,
  setSelectedElementId,
}) {
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
          console.log(data.id);
          console.log(data);

          setTextSizeLength(data.textSizeLength);
          setTextSizeWidth(data.textSizeWidth);
          setTextInput(data.textInput);
          setTextFontSize(data.textFontSize);
          setTextFontColor(data.textFontColor);
          setSelectedElementId(data.id);

          // find the details of the presentation TODO: change to the current presentation
          const response = await getDetail(localStorage.getItem("token"));
          const { store } = response;
          // loop through the presentations to find the current presentation element using the nextElementId
          console.log("presentationId: ", presentationId);
          console.log("store: ", store);
          const presentation = store.presentations.find(
            (presentation) => presentation.id == presentationId
          );
          console.log("presentation: ", presentation);
          // find the current slide
          const currentSlide = presentation.slides.find(
            (slide) => slide.slideId == selectedSlideId
          );
          console.log("currentSlide: ", currentSlide);
          // find the current element
          const currentElement = currentSlide.content.find(
            (element) => element.id == data.id
          );
          console.log("currentElement: ", currentElement);
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
