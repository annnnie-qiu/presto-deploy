import React from "react";
import Draggable from "react-draggable";

function PresentationImage({
  data,
  showImageModal,
  setImageSizeLength,
  setImageSizeWidth,
  setImageAlt,
  setSelectedElementId,
}) {
  return (
    <Draggable>
      <div
        style={{
          width: `${data?.textSizeLength}%`,
          height: `${data?.textSizeWidth}%`,
        }}
        className=" border border-gray-300 "
        onDoubleClick={async () => {
          console.log("double clicked");

          setImageSizeLength(data.imageSizeLength);
          setImageSizeWidth(data.imageSizeWidth);
          setImageAlt(data.imageAlt);
          setSelectedElementId(data.id);
          showImageModal();
        }}
      >
        {data ? (
          <span>
            {data.imageAlt}
          </span>
        ) : null}
      </div>
    </Draggable>
  );
}

export default PresentationImage;
