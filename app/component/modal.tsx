import React from 'react';

export const Modal: React.FC = () => {
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
        Open Modal
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
          <h3 className="text-lg font-bold">Hello!</h3>
          <p className="py-4">Press ESC key or click on ✕ button to close</p>
        </div>
      </dialog>
    </>
  );
};

