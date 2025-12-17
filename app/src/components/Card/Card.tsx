import './styles.css'
import { useNavigate } from 'react-router-dom';
import type { TourCard } from '../../interfaces';
import { formatDate } from '../../utils';
import { Button } from '../Button/Button';

interface CardProps {
    tourCard: TourCard;
}

export const Card: React.FC<CardProps> = ({ tourCard }) => {
    const navigate = useNavigate();

    const handleOpenPrice = () => {
        navigate(`/tours/${tourCard.price.id}/${tourCard.hotel.id}`);
    };

    return (
        <div className="card">
            <div className="card-image-wrapper">
                <img
                    alt={tourCard.hotel.name}
                    className="card-image"
                    src={tourCard.hotel.img}
                />
            </div>
            <div className="card-body">
                <h3 className="card-title">{tourCard.hotel.name}</h3>
                <div className="card-location">
                    <img
                        alt={tourCard.hotel.countryName}
                        className="card-flag"
                        src={tourCard.countryFlag}
                    />
                    <span className="card-country">{tourCard.hotel.countryName}</span>
                    <span className="card-separator">, </span>
                    <span className="card-city">{tourCard.hotel.cityName}</span>
                </div>
                <div className="card-dates">
                    <span className="card-date-label">Старт туру: </span>
                    <span className="card-date-value">{formatDate(tourCard.price.startDate)}</span>
                </div>
                <div className="card-price">
                    {tourCard.price.amount} {tourCard.price.currency.toUpperCase()}
                </div>
                <Button className='card-link' type="button" onClick={handleOpenPrice}>Відкрити ціну</Button>
            </div>
        </div>
    );
}
