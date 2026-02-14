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
    <dialog className='modal' ref={dialog}>
      <h2>{name}</h2>
      <form onSubmit={handleSubmit} className='control'>
        <div className='control'>
          <label>Name</label>
          <input name='name' defaultValue={name} required />
        </div>

        <div className='control'>
          <label>Price</label>
          <input type='number' defaultValue={price} name='price' required />
        </div>

        <div className='control'>
          <label>Description</label>
          <input name='description' defaultValue={description} required />
        </div>
        <div className='modal-actions'>
          <button type='button' className='button' onClick={onClose}>
            Close
          </button>

          <button className='button' type='submit'>
            Submit
          </button>
        </div>
      </form>
    </dialog>,
    document.getElementById('meal-modal')!,
  );
});

export default MealModal;
