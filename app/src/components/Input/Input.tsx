import React from 'react';
import './styles.css';

interface CommonProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

interface InputContainerProps extends CommonProps { }

interface FieldProps extends React.InputHTMLAttributes<HTMLInputElement> { }
interface ControlsProps extends CommonProps { }

interface InputComposition {
  Field: React.FC<FieldProps>;
  Controls: React.FC<ControlsProps>;
}


export const Input: React.FC<InputContainerProps> & InputComposition = ({ children }) => {
  return (
    <div className="input-wrapper">
      {children}
    </div>
  );
};

const Field: React.FC<FieldProps> = (props) => {
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