import { Modal } from "antd";

export const errorPopUp = (title, content) => {
  Modal.error({
    title: title,
    content: content,
  });
};
