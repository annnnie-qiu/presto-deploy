
function PresentationSlideMove() {
  return (
    <>
      <div style={{overflow: "visible" }}>
        <div
          style={{
            position: "absolute",
            width: "5px",
            height: "5px",
            backgroundColor: "black",
            top: "-2.5px",
            left: "-2.5px",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: "5px",
            height: "5px",
            backgroundColor: "black",
            top: "-2.5px",
            right: "-2.5px",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: "5px",
            height: "5px",
            backgroundColor: "black",
            bottom: "-2.5px",
            left: "-2.5px",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: "5px",
            height: "5px",
            backgroundColor: "black",
            bottom: "-2.5px",
            right: "-2.5px",
          }}
        />
      </div>
    </>
  );
}

export default PresentationSlideMove;
