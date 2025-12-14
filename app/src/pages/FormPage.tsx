import { faChevronDown, faXmark } from "@fortawesome/free-solid-svg-icons"
import { Button } from "../components/Button/Button"
import { Input } from "../components/Input/Input"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { DropDown } from "../components/DropDown/DropDown"
import './styles.css';
import { Item } from "../components/Item/Item"
import { Message } from "../components/Message/Message"
import { ERROR_CODES } from "../data"
import { getIcon } from "../utils"
import { useGeoSearch, useOutsideClick } from "../hooks"
import { useRef, useState } from "react"
import type { GeoEntity } from "../interfaces"

export const FormPage = () => {
    const [isDropDownOpen, setIsDropdownOpen] = useState<boolean>(false);
    const formRef = useRef<HTMLFormElement | null>(null);

    useOutsideClick(formRef, () => setIsDropdownOpen(false));
    const {
        errorCode,
        getBasicResponse,
        handleChange,
        handleClear,
        value,
        data,
        isLoading,
        setValue,
        setIsCountry,
        isCountry
    } = useGeoSearch();

    const onFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        e.stopPropagation();
        setIsDropdownOpen(true);
        if (!value) {
            getBasicResponse();
        } else if (value && isCountry) {
            getBasicResponse();
        }
    }

    const onItemPick = (entity: GeoEntity) => {
        setValue(entity.name);
        setIsDropdownOpen(false);
        setIsCountry(entity.type === 'country');
    }

    const onSubmit = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!value || errorCode !== null) return;

        console.log('Submitting...');
    };

    const renderContent = () => {
        if (isLoading) return <div className="status-message">Завантаження...</div>;

        if (errorCode) return <div className="status-message error">{ERROR_CODES[errorCode].description}</div>;

        if (!data || data.length === 0) {
            return <div className="status-message empty">{ERROR_CODES['NOT_FOUND'].description}</div>;
        }

        return data.map((entity) => (
            <Item
                key={entity.id}
                icon={getIcon(entity)}
                onClick={() => onItemPick(entity)}
            >
                {entity.name}
            </Item>
        ));
    }

    return <>
        <form className="form" ref={formRef} onSubmit={onSubmit}>
            <h2 className="header">Форма пошуку турів</h2>
            <DropDown className="dropdown">
                <DropDown.Trigger>
                    <Input>
                        <Input.Field
                            value={value}
                            onChange={(e) => handleChange(e)}
                            onFocus={(e) =>
                                onFocus(e)
                            }
                            placeholder="Введіть напрямок подорожі"
                        />
                        <Input.Controls>
                            {value ? <FontAwesomeIcon
                                icon={faXmark}
                                onClick={handleClear}
                                className="input-control"
                            /> : null}
                            <FontAwesomeIcon
                                className={`input-control ${isDropDownOpen ? 'rotate' : ''}`}
                                icon={faChevronDown}
                                onClick={() => setIsDropdownOpen(!isDropDownOpen)}
                            />
                        </Input.Controls>
                    </Input>
                </DropDown.Trigger>
                {isDropDownOpen ? <DropDown.Body>
                    {renderContent()}
                </DropDown.Body> : <></>}
            </DropDown>

            {
                errorCode ?
                    <Message
                        title={ERROR_CODES[errorCode].title}
                        description={ERROR_CODES[errorCode].description}
                        emoji="☹" /> :
                    null
            }

            <Button type="submit" disabled={!value || errorCode !== null}>Знайти</Button>
        </form>
    </>
}