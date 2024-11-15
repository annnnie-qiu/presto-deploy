import { useNavigate } from "react-router-dom";

function CustomizedBtn({ id, content, path = "", action }) {
  const navigate = useNavigate();

  const navigateTO = (path) => {
    navigate(path);
  };

  return (
    <button
      id={id}
      type="button"
      className="text-white bg-gradient-to-br from-pink-500 to-orange-400 font-medium rounded-lg text-lg px-5 py-2.5 text-center me-2 mb-2"
      onClick={(e) => {
        if (path === "") {
          action(e);
        } else {
          navigateTO(path);
        }
      }}
    >
      {content}
    </button>
  );
}

export default CustomizedBtn;
