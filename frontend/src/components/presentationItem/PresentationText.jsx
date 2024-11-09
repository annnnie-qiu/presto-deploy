import Draggable from "react-draggable";
import React, { useState } from "react";
import { getDetail } from "../../../utils/API/Send_ReceiveDetail/send_receiveDetail";

function PresentationText({ selectedSlideId, currentSlides }) {
  // Define state to hold the details of the current slide
  const [currentSlide, setCurrentSlide] = useState(null);
  // get the details of the current presentation
  const getPresentationDetails = async () => {
    try {
      const targetIndex = currentSlides.findIndex(
        (slide) => slide.slideId === selectedSlideId
      );
      const slide = currentSlides[targetIndex];
      console.log("Slide details:", slide);

      // Set the current slide in state
      setCurrentSlide(slide);
    } catch (error) {
      console.error("Error fetching presentations:", error);
    }
  };
  React.useEffect(() => {
    getPresentationDetails();
  }, []);

  console.log(currentSlide?.textSizeLength);
  console.log(currentSlide?.textSizeWidth);
  console.log(currentSlide?.textFontColor);
  console.log(currentSlide?.textFontSize);
  console.log(currentSlide?.textInput);
  return (
    <Draggable>
      <div
        style={{
          // width: "1000px",
          // height: "1000px",
          width: `${currentSlide?.textSizeLength}px`,
          height: `${currentSlide?.textSizeWidth}px`,
          color: currentSlide?.textFontColor,
          fontSize: `${currentSlide?.textFontSize}em`,
          overflow: "hidden",
        }}
      >
        {currentSlide ? (
          <span
          >
            {currentSlide.textInput.split("\n").map((line, index) => (
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
