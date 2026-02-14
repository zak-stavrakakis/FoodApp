import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Cart from './Cart';
import UserForm from './UserForm';
import type { ModalHandle } from '../types';

interface CartModalProps {
  title: string;
}

const CartModal = forwardRef<ModalHandle, CartModalProps>(function Modal(
  { title },
  ref,
) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [showForm, setShowForm] = useState(false);

  useImperativeHandle(ref, () => {
    return {
      open: () => {
        dialog.current?.showModal();
      },
    };
  });

  function onClose() {
    dialog.current?.close();
    setShowForm(false);
  }

  function onCheckout() {
    setShowForm(true);
  }

  return createPortal(
    <dialog
      className='bg-modal-beige rounded-md border-none shadow-[0_2px_8px_rgba(0,0,0,0.6)] p-4 w-4/5 max-w-[40rem] animate-fade-slide-up'
      ref={dialog}
    >
      <h2 className='text-dark-brown font-lato font-bold text-2xl mb-4'>
        {title}
      </h2>
      {showForm ? (
        <UserForm onClose={onClose} onGoBack={() => setShowForm(false)} />
      ) : (
        <Cart onClose={onClose} onCheckout={onCheckout} />
      )}
    </dialog>,
    document.getElementById('modal')!,
  );
});

export default CartModal;
