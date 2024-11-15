import { useState } from "react";
import { Rnd } from "react-rnd";
import { getUpdateDetail } from "../../../utils/API/Send_ReceiveDetail/get_updateDetail";
import PresentationSlideMove from "./PresentationSlideMove";
import { Modal } from "antd";

const PresentationVideo = ({
  showVideoModal,
  data,
  setSelectedElementId,
  setVideoUrl,
  setVideoSizeLength,
  setVideoSizeWidth,
  setVideoAutoplay,
  boundsRef,
  currentSlides,
  selectedSlideId,
  setCurrentSlides,
  presentationId,
  isHidden,
  setTriggerByDoubleClick,
}) => {
  const [isMoveActive, setIsMoveActive] = useState(false);

  const handleDragStop = async (e, newPos) => {
    if (!isMoveActive) return;
    // save the text to the backend
    const targetIndex = currentSlides.findIndex(
      (slide) => slide.slideId === selectedSlideId
    );
    // Edit mode
    // Update existing content
    const newContent = currentSlides[targetIndex].content.map((element) =>
      element.id === data.id
        ? {
          ...element,
          position: { x: newPos.x, y: newPos.y },
        }
        : element
    );
    getUpdateDetail(
      presentationId,
      selectedSlideId,
      newContent,
      currentSlides,
      setCurrentSlides
    );
  };

  const handleResizeStop = (e, direction, ref, delta, position) => {
    const containerWidth = boundsRef.current.clientWidth;
    const containerHeight = boundsRef.current.clientHeight;

    // Calculate new dimensions in percentage relative to container
    // const newWidthPercentage = (ref.offsetWidth / containerWidth) * 100 * 0.7;
    const newWidthPercentage = (ref.offsetWidth / containerWidth) * 100;
    const newHeightPercentage = (ref.offsetHeight / containerHeight) * 100;
    // save the text to the backend
    const targetIndex = currentSlides.findIndex(
      (slide) => slide.slideId === selectedSlideId
    );
    // Edit mode
    // Update existing content
    const newContent = currentSlides[targetIndex].content.map((element) =>
      element.id === data.id
        ? {
          ...element,
          position: { x: position.x, y: position.y },
          videoSizeLength: newHeightPercentage,
          videoSizeWidth: newWidthPercentage,
        }
        : element
    );
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
    const now = Date.now();
    // check if the click is a double click
    if (now - lastClickTime <= 500) {
      onDoubleClick(); // double click if in 0.5s
    }
    // update the last click time
    setLastClickTime(now);
  };

  const onDoubleClick = async () => {
    setSelectedElementId(data.id);
    setVideoUrl(data.videoUrl);
    setVideoSizeLength(data.videoSizeLength);
    setVideoSizeWidth(data.videoSizeWidth);
    setVideoAutoplay(data.videoAutoplay);
    setTriggerByDoubleClick(true);
    showVideoModal();
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleContextMenu = (event) => {
    event.preventDefault();
    showModal();
  };

  const handleOk = () => {
    setIsModalOpen(false);
    // delete the presentation from the backend and navigate to the dashboard
    const targetIndex = currentSlides.findIndex(
      (slide) => slide.slideId === selectedSlideId
    );
    const newContent = currentSlides[targetIndex].content.filter(
      (element) => element.id !== data.id // Exclude the element with the matching id
    );
    getUpdateDetail(
      presentationId,
      selectedSlideId,
      newContent,
      currentSlides,
      setCurrentSlides
    );
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      {!isHidden && (
        <Rnd
          size={{
            width: `${data?.videoSizeWidth}%`,
            height: `${data?.videoSizeLength}%`,
          }}
          bounds={boundsRef.current}
          position={data?.position}
          className={"border border-gray-300"}
          style={{
            position: "window",
            overflow: "show",
            border: "2px dashed #000",
            zIndex: data.zIndex,
          }}
          onClick={() => {
            setIsMoveActive(!isMoveActive);
            handleClick();
          }}
          onDragStop={handleDragStop}
          onResizeStop={handleResizeStop}
          onContextMenu={handleContextMenu}
        >
          <div
            // className="w-full h-full"
            style={{
              width: "100%",
              height: "100%",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <iframe
              className="w-full h-full"
              // width="100%"
              // height="100%"
              src={`${data.videoUrl}${data.videoAutoplay ? "&autoplay=1" : ""}`}
              title="Embedded Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          {/* </div> */}
          {/* Corner Handles */}
          {isMoveActive && PresentationSlideMove()}

          <Modal
            title="Delete this"
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            okText="Yes"
            cancelText="No"
          >
            <p>Are you sure?</p>
          </Modal>
        </Rnd>
      )}

      {isHidden && (
        <div
          size={{
            width: `${data?.videoSizeWidth}%`,
            height: `${data?.videoSizeLength}%`,
          }}
          className={"border border-gray-300"}
          style={{
            position: "window",
            overflow: "show",
            border: "2px dashed #000",
            zIndex: data.zIndex,
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <iframe
              className="w-full h-full"
              src={`${data.videoUrl}${data.videoAutoplay ? "&autoplay=1" : ""}`}
              title="Embedded Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </>
  );
};

export default PresentationVideo;
