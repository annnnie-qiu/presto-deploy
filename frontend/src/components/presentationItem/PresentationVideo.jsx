import React from "react";
import Draggable from "react-draggable";

const PresentationVideo = ({
  showVideoModal,
  data,
  setSelectedElementId,
  setVideoUrl,
  setVideoSizeLength,
  setVideoSizeWidth,
  setVideoAutoplay,
}) => {
  return (
    <Draggable>
      <div
        style={{
          position: "relative",
          border: "2px dashed #000",
          width: `${data.videoSizeWidth}%`,
          height: `${data.videoSizeLength}%`,
          margin: "0px",
          padding: "0px",
          zIndex: data.zIndex,
        }}
        onDoubleClick={() => {
          setSelectedElementId(data.id);
          setVideoUrl(data.videoUrl);
          setVideoSizeLength(data.videoSizeLength);
          setVideoSizeWidth(data.videoSizeWidth);
          setVideoAutoplay(data.videoAutoplay);
          showVideoModal();
        }}
      >
        <iframe
          width="100%"
          height="100%"
          src={`${data.videoUrl}${data.videoAutoplay ? "&autoplay=1" : ""}`}
          title="Embedded Video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    </Draggable>
  );
};

export default PresentationVideo;
