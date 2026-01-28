import { forwardRef, useImperativeHandle, useRef } from 'react';
import { createPortal } from 'react-dom';
import Cart from './Cart';

const CartModal = forwardRef(function Modal({ title, actions }, ref) {
  const dialog = useRef();

  useImperativeHandle(ref, () => {
    return {
      open: () => {
        dialog.current.showModal();
      },
    };
  });

  return createPortal(
    <dialog className='modal' ref={dialog}>
      <h2>{title}</h2>
      <Cart />
      <form method='dialog' className='modal-actions'>
        {actions}
      </form>
    </dialog>,
    document.getElementById('modal'),
  );
});

export default CartModal;
