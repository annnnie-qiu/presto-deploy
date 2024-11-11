import React from "react";
import Draggable from "react-draggable";
import { Rnd } from "react-rnd";

function PresentationImage({
  data,
  showImageModal,
  setImageSizeLength,
  setImageSizeWidth,
  setImageAlt,
  setSelectedElementId,
  setUploadImage,
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
          setUploadImage(data.uploadImage);
          showImageModal();
        }}
      >
        {data ? (
          <span>
            <img
              src={`${data.uploadImage}`}
              alt= {`${data.imageAlt}`}
              width="100%"
              height="100%"
            />
          </span>
        ) : null}
      </div>
    </Draggable>
  );
}

export default PresentationImage;
