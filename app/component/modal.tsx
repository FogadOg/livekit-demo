import React from 'react';
import { Transcript } from '../room/transcription/transcript';

interface ModalProps {
  title: string;
  content: any;
  buttonText: string;

}

export const Modal: React.FC<ModalProps> = ({ title, content, buttonText}) => {
  const handleShowModal = () => {
    const modal = document.getElementById('my_modal_3') as HTMLDialogElement;
    if (modal) {
      modal.showModal();
    }
  };

  const handleCloseModal = () => {
    const modal = document.getElementById('my_modal_3') as HTMLDialogElement;
    if (modal) {
      modal.close();
    }
  };

  return (
    <>
      <button className="btn" onClick={handleShowModal}>
        {buttonText}
      </button>
      <dialog id="my_modal_3" className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={handleCloseModal}
            >
              ✕
            </button>
          </form>
          <h3 className="text-lg font-bold text-slate-600">{title}</h3>
          <div>
            <p className="py-4 text-slate-600">{content}</p>
          </div>
        </div>
      </dialog>
    </>
  );
};

