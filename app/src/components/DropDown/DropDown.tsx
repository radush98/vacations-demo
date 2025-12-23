import { createContext, useContext, useState, useRef } from 'react';
import type { ReactNode } from 'react';
import { useOutsideClick } from '../../hooks';
import './styles.css';

const DropdownContext = createContext<{
    isOpen: boolean;
    toggle: () => void;
    close: () => void;
    open: () => void;
} | null>(null);

export const useDropdown = () => {
    const context = useContext(DropdownContext);
    if (!context) throw new Error("Dropdown sub-components must be wrapped in <DropDown />");
    return context;
};

export const DropDown = ({ children }: { children: ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const toggle = () => setIsOpen(prev => !prev);
    const close = () => setIsOpen(false);
    const open = () => setIsOpen(true);

    useOutsideClick(containerRef, close);

    return (
        <DropdownContext.Provider value={{ isOpen, open, toggle, close }}>
            <div className="dropdown" ref={containerRef} style={{ position: 'relative' }}>
                {children}
            </div>
        </DropdownContext.Provider>
    );
};

const DropDownTrigger = ({ children }: { children: ReactNode }) => {
    const { isOpen, open } = useDropdown();
    return (
        <div
            className="dropdown-trigger"
            onClick={() => !isOpen ? open() : null}
        >
            {children}
        </div>
    );
};

const DropDownBody = ({ children }: { children: ReactNode }) => {
    const { isOpen } = useDropdown();
    if (!isOpen) return null;

    return (
        <div
            role="menu"
            className="dropdown-body"
            style={{ position: 'absolute', top: '100%', left: 0 }}
        >
            {children}
        </div>
    );
};

DropDown.Trigger = DropDownTrigger;
DropDown.Body = DropDownBody;