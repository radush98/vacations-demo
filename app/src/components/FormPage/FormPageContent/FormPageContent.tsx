import { useDropdown } from "../../DropDown/DropDown"
import { Item } from "../../Item/Item"
import { ERROR_CODES } from "../../../data"
import { getIcon } from "../../../utils"
import type { GeoEntity } from "../../../interfaces"
import './styles.css';

interface FormPageContentProps {
    isLoading: boolean;
    errorCode: keyof typeof ERROR_CODES | null;
    data: GeoEntity[] | null;
    onItemPick: (entity: GeoEntity) => void;
}

export const FormPageContent = ({
    isLoading,
    errorCode,
    data,
    onItemPick
}: FormPageContentProps) => {
    const { close } = useDropdown();

    const handleItemPick = (entity: GeoEntity) => {
        onItemPick(entity);
        close();
    };

    if (isLoading) return <div className="status-message">Завантаження...</div>;

    if (errorCode) return <div className="status-message error">{ERROR_CODES[errorCode].description}</div>;

    if (!data || data.length === 0) {
        return <div className="status-message empty">{ERROR_CODES['NOT_FOUND'].description}</div>;
    }

    return (
        <>
            {data.map((entity) => (
                <Item
                    key={entity.id}
                    icon={getIcon(entity)}
                    onClick={() => handleItemPick(entity)}
                >
                    {entity.name}
                </Item>
            ))}
        </>
    );
};

