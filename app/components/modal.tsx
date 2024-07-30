import React, { useState } from "react";
import { Transcript } from "../room/components/transcription/transcript";

interface ModalProps {
  title: string;
  content: any;
  buttonText: string;
}

export const Modal: React.FC<ModalProps> = ({ title, content, buttonText }) => {
  const [visible, setVisible] = useState(false);
  const handleShowModal = () => {
    const modal = document.getElementById("my_modal_3") as HTMLDialogElement;
    if (modal) {
      modal.showModal();
    }
    setVisible(true);
    console.log(true);
  };

  const handleCloseModal = () => {
    const modal = document.getElementById("my_modal_3") as HTMLDialogElement;
    if (modal) {
      modal.close();
    }
    setVisible(false);
    console.log(false);
  };

  return (
    <>
      <button className="btn lk-button" onClick={handleShowModal}>
        {buttonText}
      </button>
      <dialog id="my_modal_3" className="modal" onClose={handleCloseModal}>
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
