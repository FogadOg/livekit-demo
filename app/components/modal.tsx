import React, { useState } from "react";

interface ModalProps {
  title: string;
  content: any;
  buttonText: string;
  modelName: string;
}

export const Modal: React.FC<ModalProps> = ({ title, content, buttonText, modelName }) => {
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
        {buttonText}
      </button>
      <dialog id={modelName} className="modal" onClose={handleCloseModal}>
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
