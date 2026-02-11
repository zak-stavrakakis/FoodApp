import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { mealsActions } from '../redux-store/meals-slice';
import { useDispatch } from 'react-redux';
import useToken from '../hooks/useToken';

const MealModal = forwardRef(function Modal(
  { id, name, price, description },
  ref,
) {
  const token = useToken();
  const dispatch = useDispatch();
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

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const name = formData.get('name').trim();
    const price = formData.get('price');
    const description = formData.get('description').trim();

    if (!name) {
      alert('Name is required');
      return;
    }

    if (!description) {
      alert('Description is required');
      return;
    }

    if (!price || Number(price) <= 0) {
      alert('Price must be greater than 0');
      return;
    }
    const data = Object.fromEntries(formData.entries());

    const meal = {
      ...data,
      id,
    };

    try {
      const { id, ...rest } = meal;
      const res = await fetch(`http://localhost:3000/meals/${meal.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(rest),
      });
      if (!res.ok) {
        alert(`Failed to update meal ${rest.name}`);
        return;
      }
      dispatch(mealsActions.updateMeal(meal));
      onClose();
    } catch (error) {
      log(error);
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
    document.getElementById('meal-modal'),
  );
});

export default MealModal;
