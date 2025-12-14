import type { IconDefinition } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import './styles.css'

interface ItemProps extends React.HTMLAttributes<HTMLDivElement> {
    icon?: IconDefinition | string;
}

export const Item: React.FC<ItemProps> = ({ icon, children, className, ...props }) => {
    const isExternalIcon = typeof icon === 'string';

    return <div className={`item ${className}`}  {...props}>
        {icon ? <div>
            {!isExternalIcon ? <FontAwesomeIcon icon={icon} /> : <img className="image" src={icon} />}
        </div> : null}
        <div>
            {children}
        </div>
    </div>
}