import { faChevronDown, faXmark } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Input } from "../../Input/Input"
import { useDropdown } from "../../DropDown/DropDown"
import './styles.css';

interface FormPageInputProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onFocus: (e: React.FocusEvent<HTMLInputElement>) => void;
    onClear: () => void;
}

export const FormPageInput = ({
    value,
    onChange,
    onFocus,
    onClear
}: FormPageInputProps) => {
    const { isOpen, toggle } = useDropdown();

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        onFocus(e);
        if (!isOpen) {
            toggle();
        }
    };

    const handleChevronClick = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
        e.stopPropagation();
        toggle();
    };

    const handleOnClear = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
        e.stopPropagation();
        onClear();
    };

    return (
        <Input>
            <Input.Field
                value={value}
                onChange={onChange}
                onFocus={handleFocus}
                placeholder="Введіть напрямок подорожі"
            />
            <Input.Controls>
                {value ? <FontAwesomeIcon
                    icon={faXmark}
                    onClick={handleOnClear}
                    className="input-control"
                /> : null}
                <FontAwesomeIcon
                    className={`input-control ${isOpen ? 'rotate' : ''}`}
                    icon={faChevronDown}
                    onClick={handleChevronClick}
                />
            </Input.Controls>
        </Input>
    );
};

