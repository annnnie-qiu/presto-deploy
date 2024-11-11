import { getDetail } from "./send_receiveDetail";
import sendDetail from "./send_receiveDetail";

export async function getUpdateDetail(presentationId, selectedSlideId, newContent, currentSlides, setCurrentSlides) {
  // get detail from backend
  const token = localStorage.getItem("token");
  const detail = await getDetail(token);
  const { store } = detail;
  console.log("store", store);
  console.log("presentationId", presentationId);
  // find the current presentation
  const presentation = store.presentations.find(
    (presentation) => presentation.id == presentationId
  );
  console.log("presentation", presentation);
  // find the current slide

  // Update the current slide with new content
  const newSlideList = currentSlides.map((slide) => {
    if (slide.slideId === selectedSlideId) {
      return { ...slide, content: newContent };
    }
    return slide;
  });

  // Update the state to reflect changes
  setCurrentSlides(newSlideList);

  // Update the backend store to save the changes
  for (let i = 0; i < store.presentations.length; i++) {
    if (store.presentations[i].id == presentationId) {
      store.presentations[i].slides = newSlideList;
      break;
    }
  }
  await sendDetail(token, store);
}
