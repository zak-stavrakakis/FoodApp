import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { mealsActions } from '../redux-store/meals-slice';
import { useDispatch } from 'react-redux';

const MealModal = forwardRef(function Modal(
  { id, name, price, description },
  ref,
) {
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
    const data = Object.fromEntries(formData.entries());

    const meal = {
      ...data,
      id,
    };

    console.log(meal);

    try {
      const token = localStorage.getItem('token');
      await fetch('http://localhost:3000/meals/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(meal),
      });
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
          <button type='button' onClick={onClose}>
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
