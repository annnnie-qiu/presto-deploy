import { useRef } from "react";
import PresentationText from "./PresentationText";
import PresentationImage from "./PresentationImage";
import PresentationCode from "./PresentationCode";
import PresentationVideo from "./PresentationVideo";

import { motion, AnimatePresence } from "framer-motion";

const DescSlide = ({
  currentSlides,
  presentationId,
  selectedSlideId,
  showTextModal,
  setTextSizeLength,
  setTextSizeWidth,
  setTextInput,
  setTextFontSize,
  setTextFontColor,
  setSelectedElementId,
  showImageModal,
  setImageSizeLength,
  setImageSizeWidth,
  setImageAlt,
  setUploadImage,
  showCodeModal,
  setCodeLeight,
  setCodeWidth,
  setCodeContent,
  setCodeFontSize,
  setCodeLanguage,
  setCurrentSlides,
  showVideoModal,
  setVideoUrl,
  setVideoSizeLength,
  setVideoSizeWidth,
  setVideoAutoplay,
  isHidden,
  setTriggerByDoubleClick,
}) => {
  const boundsRef = useRef(null);

  // Find the currently selected slide to extract its background settings
  const selectedSlide = currentSlides.find(
    (slide) => slide.slideId === selectedSlideId
  );

  // Determine the background style based on the type (solid, gradient, or image)
  let backgroundStyle = {};
  if (selectedSlide?.background) {
    if (selectedSlide.background.type === "solid") {
      backgroundStyle = { backgroundColor: selectedSlide.background.color };
    } else if (selectedSlide.background.type === "gradient") {
      const { start, end, direction } = selectedSlide.background.gradient;
      backgroundStyle = {
        background: `linear-gradient(${direction}, ${start}, ${end})`,
      };
    } else if (selectedSlide.background.type === "image") {
      backgroundStyle = {
        backgroundImage: `url(${selectedSlide.background.imageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      };
    }
  }
  return (
    <>
      {/* for preview page */}
      {isHidden && (
        <div className="flex h-full w-full justify-center  items-center">
          <AnimatePresence mode="popLayout">
            <motion.div
              key={selectedSlideId}
              initial={{ x: isHidden ? "100vw" : 0 }}
              animate={{ x: 0 }}
              exit={{ x: isHidden ? "-100vw" : 0 }}
              transition={{ duration: 0.1, ease: "linear" }}
              className={`rounded-lg border-solid border-2 border-inherit ${
                isHidden ? "w-full h-full  bg-white" : "w-11/12 h-5/6 bg-white"
              }`}
              style={{
                ...backgroundStyle,
              }}
              ref={boundsRef} // Assign the ref to this container for snapshot capturing
            >
              {currentSlides?.map((slide) => {
                if (slide.slideId === selectedSlideId) {
                  return slide.content?.map((element) => {
                    if (element.type === "text") {
                      return (
                        <PresentationText
                          showTextModal={showTextModal}
                          key={element.id}
                          data={element}
                          setTextSizeLength={setTextSizeLength}
                          setTextSizeWidth={setTextSizeWidth}
                          setTextInput={setTextInput}
                          setTextFontSize={setTextFontSize}
                          setTextFontColor={setTextFontColor}
                          setSelectedElementId={setSelectedElementId}
                          boundsRef={boundsRef}
                          currentSlides={currentSlides}
                          selectedSlideId={selectedSlideId}
                          setCurrentSlides={setCurrentSlides}
                          presentationId={presentationId}
                          isHidden={isHidden}
                          setTriggerByDoubleClick={setTriggerByDoubleClick}
                        />
                      ); // Use a unique key for each element
                    } else if (element.type === "image") {
                      return (
                        <PresentationImage
                          showImageModal={showImageModal}
                          key={element.id}
                          data={element}
                          setImageSizeLength={setImageSizeLength}
                          setImageSizeWidth={setImageSizeWidth}
                          setImageAlt={setImageAlt}
                          setSelectedElementId={setSelectedElementId}
                          setUploadImage={setUploadImage}
                          boundsRef={boundsRef}
                          currentSlides={currentSlides}
                          selectedSlideId={selectedSlideId}
                          setCurrentSlides={setCurrentSlides}
                          presentationId={presentationId}
                          setTriggerByDoubleClick={setTriggerByDoubleClick}
                        />
                      );
                    } else if (element.type === "code") {
                      return (
                        <PresentationCode
                          showCodeModal={showCodeModal}
                          key={element.id}
                          data={element}
                          setCodeLeight={setCodeLeight}
                          setCodeWidth={setCodeWidth}
                          setCodeContent={setCodeContent}
                          setCodeFontSize={setCodeFontSize}
                          setCodeLanguage={setCodeLanguage}
                          setSelectedElementId={setSelectedElementId}
                          boundsRef={boundsRef}
                          currentSlides={currentSlides}
                          selectedSlideId={selectedSlideId}
                          setCurrentSlides={setCurrentSlides}
                          presentationId={presentationId}
                          setTriggerByDoubleClick={setTriggerByDoubleClick}
                        />
                      );
                    } else if (element.type === "video") {
                      return (
                        <PresentationVideo
                          showVideoModal={showVideoModal}
                          key={element.id}
                          data={element}
                          setSelectedElementId={setSelectedElementId}
                          setVideoUrl={setVideoUrl}
                          setVideoSizeLength={setVideoSizeLength}
                          setVideoSizeWidth={setVideoSizeWidth}
                          setVideoAutoplay={setVideoAutoplay}
                          boundsRef={boundsRef}
                          currentSlides={currentSlides}
                          selectedSlideId={selectedSlideId}
                          setCurrentSlides={setCurrentSlides}
                          presentationId={presentationId}
                          setTriggerByDoubleClick={setTriggerByDoubleClick}
                        />
                      );
                    }
                    return null;
                  });
                }
                return null;
              })}
            </motion.div>
          </AnimatePresence>
        </div>
      )}
      {!isHidden && (
        <div className="flex h-full w-full justify-center  items-center">
          <div
            key={selectedSlideId}
            className={`rounded-lg border-solid border-2 border-inherit ${
              isHidden ? "w-full h-full" : "w-11/12 h-5/6 bg-white"
            }`}
            style={{
              ...backgroundStyle,
            }}
            ref={boundsRef} // Assign the ref to this container for snapshot capturing
          >
            {currentSlides?.map((slide) => {
              if (slide.slideId === selectedSlideId) {
                return slide.content?.map((element) => {
                  if (element.type === "text") {
                    return (
                      <PresentationText
                        showTextModal={showTextModal}
                        key={element.id}
                        data={element}
                        setTextSizeLength={setTextSizeLength}
                        setTextSizeWidth={setTextSizeWidth}
                        setTextInput={setTextInput}
                        setTextFontSize={setTextFontSize}
                        setTextFontColor={setTextFontColor}
                        setSelectedElementId={setSelectedElementId}
                        boundsRef={boundsRef}
                        currentSlides={currentSlides}
                        selectedSlideId={selectedSlideId}
                        setCurrentSlides={setCurrentSlides}
                        presentationId={presentationId}
                        isHidden={isHidden}
                        setTriggerByDoubleClick={setTriggerByDoubleClick}
                      />
                    ); // Use a unique key for each element
                  } else if (element.type === "image") {
                    return (
                      <PresentationImage
                        showImageModal={showImageModal}
                        key={element.id}
                        data={element}
                        setImageSizeLength={setImageSizeLength}
                        setImageSizeWidth={setImageSizeWidth}
                        setImageAlt={setImageAlt}
                        setSelectedElementId={setSelectedElementId}
                        setUploadImage={setUploadImage}
                        boundsRef={boundsRef}
                        currentSlides={currentSlides}
                        selectedSlideId={selectedSlideId}
                        setCurrentSlides={setCurrentSlides}
                        presentationId={presentationId}
                        isHidden={isHidden}
                        setTriggerByDoubleClick={setTriggerByDoubleClick}
                      />
                    );
                  } else if (element.type === "code") {
                    return (
                      <PresentationCode
                        showCodeModal={showCodeModal}
                        key={element.id}
                        data={element}
                        setCodeLeight={setCodeLeight}
                        setCodeWidth={setCodeWidth}
                        setCodeContent={setCodeContent}
                        setCodeFontSize={setCodeFontSize}
                        setCodeLanguage={setCodeLanguage}
                        setSelectedElementId={setSelectedElementId}
                        boundsRef={boundsRef}
                        currentSlides={currentSlides}
                        selectedSlideId={selectedSlideId}
                        setCurrentSlides={setCurrentSlides}
                        presentationId={presentationId}
                        isHidden={isHidden}
                        setTriggerByDoubleClick={setTriggerByDoubleClick}
                      />
                    );
                  } else if (element.type === "video") {
                    return (
                      <PresentationVideo
                        showVideoModal={showVideoModal}
                        key={element.id}
                        data={element}
                        setSelectedElementId={setSelectedElementId}
                        setVideoUrl={setVideoUrl}
                        setVideoSizeLength={setVideoSizeLength}
                        setVideoSizeWidth={setVideoSizeWidth}
                        setVideoAutoplay={setVideoAutoplay}
                        boundsRef={boundsRef}
                        currentSlides={currentSlides}
                        selectedSlideId={selectedSlideId}
                        setCurrentSlides={setCurrentSlides}
                        presentationId={presentationId}
                        isHidden={isHidden}
                        setTriggerByDoubleClick={setTriggerByDoubleClick}
                      />
                    );
                  }
                  return null;
                });
              }
              return null;
            })}
          </div>
        </div>
      )}
    </>
  );
};

export default DescSlide;
