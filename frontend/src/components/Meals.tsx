import type { ReactNode } from 'react';

interface MealsProps {
  children: ReactNode;
}

export default function Meals({ children }: MealsProps) {
  return (
    <section>
      <ul className='w-[90%] max-w-[70rem] list-none mx-auto my-8 p-4 grid grid-cols-[repeat(auto-fit,minmax(20rem,1fr))] gap-4'>
        {children}
      </ul>
    </section>
  );
}
