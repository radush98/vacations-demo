import { Button } from "../../components/Button/Button"
import { DropDown } from "../../components/DropDown/DropDown"
import { FormPageInput } from "../../components/FormPage/FormPageInput/FormPageInput"
import { FormPageContent } from "../../components/FormPage/FormPageContent/FormPageContent"
import './styles.css';
import { Message } from "../../components/Message/Message"
import { Card } from "../../components/Card/Card"
import { ERROR_CODES } from "../../data"
import { useGeoSearch, useTours, useDebounce } from "../../hooks"
import { useState, useEffect, useMemo } from "react"
import type { GeoEntity } from "../../interfaces"

export const FormPage = () => {
    const [value, setValue] = useState<string>('');
    const [entity, setEntity] = useState<GeoEntity | null>(null);

    const debouncedValue = useDebounce(value, 400);

    const {
        errorCode,
        getBasicResponse,
        searchGeo,
        clearData,
        data,
        isLoading,
    } = useGeoSearch();

    const {
        errorCode: toursErrorCode,
        searchTours,
        tours,
        isLoading: isLoadingTours,
    } = useTours();

    useEffect(() => {
        if (!debouncedValue.trim()) return;
        searchGeo(debouncedValue);
    }, [debouncedValue, searchGeo]);

    const resetToCountries = () => {
        clearData();
        getBasicResponse();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setValue(newValue);
        
        if (newValue === '') {
            resetToCountries();
        }
        
        if (entity) {
            setEntity(null);
        }
    };

    const handleClear = () => {
        setValue('');
        setEntity(null);
        resetToCountries();
    };

    const onFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        e.stopPropagation();
        
        if (!value || entity?.type === 'country') {
            getBasicResponse();
        }
    };

    const onItemPick = (pickedEntity: GeoEntity) => {
        setValue(pickedEntity.name);
        setEntity(pickedEntity);
    };

    const isDisabled = useMemo(
        () => !entity || !value || errorCode !== null || isLoadingTours,
        [entity, value, errorCode, isLoadingTours]
    );

    const onSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
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

    return <>
        <form className="form" onSubmit={onSubmit}>
            <h2 className="header">Форма пошуку турів</h2>
            <DropDown>
                <DropDown.Trigger>
                    <FormPageInput
                        value={value}
                        onChange={handleChange}
                        onFocus={onFocus}
                        onClear={handleClear}
                    />
                </DropDown.Trigger>
                <DropDown.Body>
                    <FormPageContent
                        isLoading={isLoading}
                        errorCode={errorCode}
                        data={data}
                        onItemPick={onItemPick}
                    />
                </DropDown.Body>
            </DropDown>

            <Button
                type="submit"
                disabled={isDisabled}
            >
                Знайти
            </Button>
        </form>
        <div className="results">
            {errorCode ? (
                <Message
                    title={ERROR_CODES[errorCode].title}
                    description={ERROR_CODES[errorCode].description}
                    emoji="☹"
                />
            ) : null}

            {toursErrorCode ? (
                <Message
                    title={ERROR_CODES[toursErrorCode].title}
                    description={ERROR_CODES[toursErrorCode].description}
                    emoji="☹"
                />
            ) : null}

            {isLoadingTours ? (
                <Message
                    title="Завантаження..."
                    description="Шукаємо тури, будь ласка зачекайте"
                    emoji="⏳"
                />
            ) : null}

            {tours && tours.length > 0 ? (
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
            ) : null}
        </div>
    </>
}