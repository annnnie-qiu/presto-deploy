import React from "react";

function LoginBtn() {
  const [counter, setCounter] = React.useState(0);

  React.useEffect(() => {
    console.log("LALALA");
  }, []);

  return (
    <button
      onClick={() => {
        console.log(counter);
        setCounter((current) => current + 1);
      }}
    >
      Click here to login
    </button>
  );
}

export default LoginBtn;
