import React, { useState } from "react";

interface ModalProps {
  title: string;
  content: JSX.Element;
  buttonText: string;
  modelName: string;
  icon?: JSX.Element;
}

export const Modal: React.FC<ModalProps> = ({
  title,
  content,
  buttonText,
  modelName,
  icon,
}) => {
  const [visible, setVisible] = useState(false);
  const handleShowModal = () => {
    const modal = document.getElementById(modelName) as HTMLDialogElement;
    if (modal) {
      modal.showModal();
    }
    setVisible(true);
  };

  const handleCloseModal = () => {
    const modal = document.getElementById(modelName) as HTMLDialogElement;
    if (modal) {
      modal.close();
    }
    setVisible(false);
  };

  return (
    <>
      <button className="btn lk-button" onClick={handleShowModal}>
        {icon ? icon : ""}
        {buttonText}
      </button>
      <dialog id={modelName} className="modal">
        <div className="modal-box">
          <form method="dialog"></form>
          <h3 className="text-lg font-bold ">{title}</h3>
          <div>
            <div className="py-4 ">{visible && content}</div>
          </div>

          <button className="btn ml-[85%]" onClick={handleCloseModal}>
            Close
          </button>
        </div>

        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
};
