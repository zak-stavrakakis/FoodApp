import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Cart from './Cart';
import UserForm from './UserForm';

const CartModal = forwardRef(function Modal({ title, cartQuantity }, ref) {
  const dialog = useRef();
  const [showForm, setShowForm] = useState(false);

  useImperativeHandle(ref, () => {
    return {
      open: () => {
        dialog.current.showModal();
      },
    };
  });

  function onClose() {
    dialog.current.close();
    setShowForm(false);
  }

  function onCheckout() {
    setShowForm(true);
  }

  return createPortal(
    <dialog className='modal' ref={dialog}>
      <h2>{title}</h2>
      {showForm ? (
        <UserForm onClose={onClose}/>
      ) : (
        <Cart onClose={onClose} onCheckout={onCheckout} />
      )}
    </dialog>,
    document.getElementById('modal'),
  );
});

export default CartModal;
