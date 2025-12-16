import './styles.css'

interface CommonProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

interface DropDownProps extends CommonProps { }

interface DropDownBodyProps extends CommonProps{};
interface DropDownTriggerProps extends CommonProps{};

interface DropDownComposition {
    Body: React.FC<DropDownBodyProps>;
    Trigger: React.FC<DropDownTriggerProps>;
}


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