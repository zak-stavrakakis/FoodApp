import type { ReactNode } from 'react';

interface MealsProps {
  children: ReactNode;
}

export default function Meals({ children }: MealsProps) {
  return (
    <section>
      <ul id='meals'>{children}</ul>
    </section>
  );
}
