import { forwardRef, useImperativeHandle, useRef } from 'react';
import { createPortal } from 'react-dom';
import { mealsActions } from '../redux-store/meals-slice';
import { useDispatch } from 'react-redux';
import useToken from '../hooks/useToken';
import { AppConfig } from '../config';
import type { ModalHandle } from '../types';

interface MealModalProps {
  id: string;
  name: string;
  price: number;
  description: string;
}

const MealModal = forwardRef<ModalHandle, MealModalProps>(function Modal(
  { id, name, price, description },
  ref,
) {
  const token = useToken();
  const dispatch = useDispatch();
  const dialog = useRef<HTMLDialogElement>(null);

  useImperativeHandle(ref, () => {
    return {
      open: () => {
        dialog.current?.showModal();
      },
    };
  });

  function onClose() {
    dialog.current?.close();
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const formName = (formData.get('name') as string).trim();
    const formPrice = formData.get('price') as string;
    const formDescription = (formData.get('description') as string).trim();

    if (!formName) {
      alert('Name is required');
      return;
    }

    if (!formDescription) {
      alert('Description is required');
      return;
    }

    if (!formPrice || Number(formPrice) <= 0) {
      alert('Price must be greater than 0');
      return;
    }
    const data = Object.fromEntries(formData.entries());

    const meal = {
      ...data,
      id,
    };

    try {
      const { id: mealId, ...rest } = meal;
      const res = await fetch(AppConfig.toApiUrl(`/meals/${mealId}`), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(rest),
      });
      if (!res.ok) {
        alert(`Failed to update meal ${formName}`);
        return;
      }
      dispatch(
        mealsActions.updateMeal({
          id,
          name: formName,
          price: Number(formPrice),
          description: formDescription,
        }),
      );
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return createPortal(
    <dialog
      className='bg-modal-beige rounded-md border-none shadow-[0_2px_8px_rgba(0,0,0,0.6)] p-4 w-4/5 max-w-[40rem] animate-fade-slide-up'
      ref={dialog}
    >
      <h2 className='text-dark-brown font-lato font-bold text-2xl mb-4'>
        {name}
      </h2>
      <form onSubmit={handleSubmit} className='my-2 flex flex-col'>
        <div className='my-2 flex flex-col'>
          <label className='font-bold mb-2 text-dark-brown'>Name</label>
          <input
            name='name'
            defaultValue={name}
            required
            className='w-full max-w-80 font-inherit p-2 rounded border border-input-border'
          />
        </div>

        <div className='my-2 flex flex-col'>
          <label className='font-bold mb-2 text-dark-brown'>Price</label>
          <input
            type='number'
            defaultValue={price}
            name='price'
            required
            className='w-full max-w-80 font-inherit p-2 rounded border border-input-border'
          />
        </div>

        <div className='my-2 flex flex-col'>
          <label className='font-bold mb-2 text-dark-brown'>Description</label>
          <input
            name='description'
            defaultValue={description}
            required
            className='w-full max-w-80 font-inherit p-2 rounded border border-input-border'
          />
        </div>
        <div className='flex justify-end gap-4 mt-4'>
          <button
            type='button'
            className='font-inherit cursor-pointer bg-gold border border-gold text-dark-brown py-2 px-6 rounded hover:bg-gold-dark hover:border-gold-dark'
            onClick={onClose}
          >
            Close
          </button>

          <button
            className='font-inherit cursor-pointer bg-gold border border-gold text-dark-brown py-2 px-6 rounded hover:bg-gold-dark hover:border-gold-dark'
            type='submit'
          >
            Submit
          </button>
        </div>
      </form>
    </dialog>,
    document.getElementById('meal-modal')!,
  );
});

export default MealModal;
