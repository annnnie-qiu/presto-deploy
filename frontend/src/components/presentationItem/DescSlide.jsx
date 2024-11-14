import React, { useRef } from "react";
// import html2canvas from "html2canvas"; // Import html2canvas for snapshot capturing
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
}) => {
  const boundsRef = useRef(null);

  // Function to take a snapshot of the slide
  // const takeSnapshot = async (element, slideId) => {
  //   if (!element) return;

  //   try {
  //     const canvas = await html2canvas(element);
  //     const snapshotUrl = canvas.toDataURL("image/png");

  //     return { slideId, snapshotUrl };
  //   } catch (error) {
  //     console.error("Error taking snapshot:", error);
  //   }
  // };

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

  // Take a snapshot of the slide whenever it is updated
  // useEffect(() => {
  //   const takeAndStoreSnapshot = async () => {
  //     if (boundsRef.current) {
  //       const snapshot = await takeSnapshot(boundsRef.current, selectedSlideId);
  //       if (snapshot) {
  //         setCurrentSlides((slides) =>
  //           slides.map((slide) =>
  //             slide.slideId === snapshot.slideId
  //               ? { ...slide, snapshotUrl: snapshot.snapshotUrl }
  //               : slide
  //           )
  //         );
  //       }
  //     }
  //   };

  //   if (selectedSlide) {
  //     takeAndStoreSnapshot();
  //   }
  // }, [selectedSlide, setCurrentSlides]); // Trigger whenever the selectedSlide changes

  return (
    <div className="flex h-screen w-screen justify-center  items-center">
      <AnimatePresence mode="popLayout">
        <motion.div
          key={selectedSlideId}
          initial={{ x: isHidden ? "100vw" : 0 }}
          animate={{ x: 0 }}
          exit={{ x: isHidden ? "-100vw" : 0 }}
          transition={{ duration: 0.1, ease: "linear" }}
          className={`rounded-lg border-solid border-2 border-inherit ${
            isHidden ? "w-full h-full" : "w-11/12 h-5/6"
          }`}
          style={{
            //   position: "relative",
            //   overflow: "hidden",
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
  );
};

export default DescSlide;
