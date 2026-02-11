import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

const MealModal = forwardRef(function Modal(
  { id, name, price, description },
  ref,
) {
  const dialog = useRef();

  useImperativeHandle(ref, () => {
    return {
      open: () => {
        dialog.current.showModal();
      },
    };
  });

  function onClose() {
    dialog.current.close();
  }

  return createPortal(
    <dialog className='modal' ref={dialog}>
      <h2>
        {name} {id} {description} {price}
      </h2>
      <button className='button' onClick={onClose}>
        Close
      </button>
    </dialog>,
    document.getElementById('meal-modal'),
  );
});

export default MealModal;
