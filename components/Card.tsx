import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  // Fix: Add onClick prop to allow Card components to be clickable.
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
}

const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white text-slate-900 flex flex-col gap-6 rounded-xl border border-slate-200 ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
