import { faChevronDown, faXmark } from "@fortawesome/free-solid-svg-icons"
import { Button } from "../../components/Button/Button"
import { Input } from "../../components/Input/Input"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { DropDown } from "../../components/DropDown/DropDown"
import './styles.css';
import { Item } from "../../components/Item/Item"
import { Message } from "../../components/Message/Message"
import { Card } from "../../components/Card/Card"
import { ERROR_CODES } from "../../data"
import { getIcon } from "../../utils"
import { useGeoSearch, useOutsideClick, useTours } from "../../hooks"
import { useMemo, useRef, useState, useEffect } from "react"
import type { GeoEntity } from "../../interfaces"

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
        entity,
        setEntity
    } = useGeoSearch();

    const {
        errorCode: toursErrorCode,
        searchTours,
        tours,
        isLoading: isLoadingTours,
    } = useTours();

    const onFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        e.stopPropagation();
        setIsDropdownOpen(true);
        if (!value) {
            getBasicResponse();
        } else if (value && entity?.type === 'country') {
            getBasicResponse();
        }
    }

    const onItemPick = async (entity: GeoEntity) => {
        setValue(entity.name);
        setIsDropdownOpen(false);
        setEntity(entity);
    }

    const isDisabled = useMemo(() => !entity || !value || errorCode !== null || isLoadingTours, [value, errorCode, isLoadingTours, entity]);

    const onSubmit = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (isDisabled || !entity) return;

        searchTours(entity);
    };

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Enter' && !isDisabled && entity) {
                const target = event.target as HTMLElement;
                if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
                    return;
                }
                event.preventDefault();
                searchTours(entity);
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isDisabled, entity, searchTours]);

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

            <Button
                type="submit"
                disabled={isDisabled}
            >
                Знайти
            </Button>
        </form>
        <div className="results">
            {
                errorCode ?
                    <Message
                        title={ERROR_CODES[errorCode].title}
                        description={ERROR_CODES[errorCode].description}
                        emoji="☹" /> :
                    null
            }

            {
                toursErrorCode ?
                    <Message
                        title={ERROR_CODES[toursErrorCode].title}
                        description={ERROR_CODES[toursErrorCode].description}
                        emoji="☹" /> :
                    null
            }

            {
                isLoadingTours &&
                <Message
                    title="Завантаження..."
                    description="Шукаємо тури, будь ласка зачекайте"
                    emoji="⏳" />
            }
            {
                tours && tours.length > 0 &&
                <div className="tours-results">
                    <h3>Знайдено турів: {tours.length}</h3>
                    <div className="tours-grid">
                        {tours.map((tourCard) => (
                            <Card 
                                key={`${tourCard.hotel.id}-${tourCard.price.id}`}
                                tourCard={tourCard}
                            />
                        ))}
                    </div>
                </div>
            }
        </div>
    </>
}