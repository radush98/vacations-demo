import React from 'react';
import './styles.css';

interface InputComposition {
  Field: React.FC<React.InputHTMLAttributes<HTMLInputElement>>;
  Controls: React.FC<{ children: React.ReactNode }>;
}

interface InputContainerProps extends React.HTMLAttributes<HTMLDivElement>{
  children: React.ReactNode;
}

export const Input: React.FC<InputContainerProps> & InputComposition = ({ children }) => {
  return (
    <div className="input-wrapper">
      {children}
    </div>
  );
};

const Field: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => {
  return <input type="text" className="input" {...props} />;
};

const Controls: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="input-controls">
      {children}
    </div>
  );
};

Input.Field = Field;
Input.Controls = Controls;