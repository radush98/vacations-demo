import './styles.css'

interface DropDownComposition {
    Body: React.FC<{ children: React.ReactNode }>;
    Trigger: React.FC<{ children: React.ReactNode }>;
}

interface DropDownProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

interface DropDownBodyProps extends DropDownProps{};
interface DropDownTriggerProps extends DropDownProps{};


export const DropDown: React.FC<DropDownProps> & DropDownComposition = ({ children, ...props }) => {
    return (
        <div className="dropdown" {...props}>
            {children}
        </div>
    );
}

const DropDownTrigger: React.FC<DropDownTriggerProps> = ({ children, ...props }) => {
    return (
        <div {...props}>
            {children}
        </div>
    );
};

const DropDownBody: React.FC<DropDownBodyProps> = ({ children, ...props }) => {
    return (
        <div className="dropdown-body" {...props}>
            {children}
        </div>
    );
};

DropDown.Body = DropDownBody;
DropDown.Trigger = DropDownTrigger;