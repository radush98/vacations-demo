import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiService } from '../../services';
import type { HotelDetail } from '../../interfaces';
import type { PriceOffer } from '../../interfaces/Price';
import { Message } from '../../components/Message/Message';
import { ERROR_CODES, SERVICES } from '../../data';
import { calculateDaysAmount, formatDate } from '../../utils';
import './styles.css';

export const TourDetailPage = () => {
    const { priceId, hotelId } = useParams<{ priceId: string; hotelId: string }>();
    const navigate = useNavigate();
    const [hotel, setHotel] = useState<HotelDetail | null>(null);
    const [price, setPrice] = useState<PriceOffer | null>(null);
    const [countryFlag, setCountryFlag] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorCode, setErrorCode] = useState<keyof typeof ERROR_CODES | null>(null);

    useEffect(() => {
        if (!hotelId || !priceId) return;

        setIsLoading(true);
        setErrorCode(null);

        const loadData = async () => {
            try {
                const [hotelData, countries, priceData] = await Promise.all([
                    apiService.getHotel(hotelId),
                    apiService.getCountries(),
                    apiService.getPrice(priceId)
                ]);

                setHotel(hotelData);
                const country = countries.find((c) => c.id === hotelData.countryId);
                if (country) {
                    setCountryFlag(country.flag);
                }
                setPrice(priceData);
            } catch (error) {
                console.error('Error loading data:', error);
                setErrorCode('NOT_FOUND');
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, [hotelId, priceId]);

    if (isLoading) {
        return <Message title="Завантаження..." description="Завантажуємо інформацію про готель" emoji="⏳" />;
    }

    if (errorCode) {
        return (
            <Message
                title={ERROR_CODES[errorCode].title}
                description={ERROR_CODES[errorCode].description}
                emoji="☹"
            />
        );
    }

    if (!hotel) {
        return null;
    }

    const availableServices = Object.entries(hotel.services)
        .filter(([, value]) => value === 'yes')
        .map(([key]) => key);

    return (
        <div className="tour-page">
            <button className="tour-page-back-button" onClick={() => navigate('/')}>
                ← Назад
            </button>
            <div className="tour-details">
                <div className="tour-details-header">
                    <h1 className="tour-details-title">{hotel.name}</h1>
                    <div className="tour-details-location">
                        {countryFlag && (
                            <img
                                alt={hotel.countryName}
                                className="tour-details-flag"
                                src={countryFlag}
                            />
                        )}
                        <span className="tour-details-country">{hotel.countryName}</span>
                        <span className="tour-details-separator">, </span>
                        <span className="tour-details-city">{hotel.cityName}</span>
                    </div>
                </div>
                <div className="tour-details-image-wrapper">
                    <img alt={hotel.name} className="tour-details-image" src={hotel.img} />
                </div>
                <div className="tour-details-section">
                    <h2 className="tour-details-section-title">Опис</h2>
                    <p className="tour-details-description">{hotel.description}</p>
                </div>
                {availableServices.length > 0 && (
                    <div className="tour-details-section">
                        <h2 className="tour-details-section-title">Сервіси</h2>
                        <div className="tour-details-services">
                            {availableServices.map((serviceKey) => {
                                const service = SERVICES[serviceKey];
                                if (!service) return null;
                                return (
                                    <div key={serviceKey} className="tour-details-service">
                                        <span className="tour-details-service-icon">{service.icon}</span>
                                        <span className="tour-details-service-label">{service.label}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
                {price ? <div className="tour-details-price-section">
                    <div className="tour-details-price-info">
                        <div className="tour-details-date">
                            <span className="tour-details-date-icon">📅</span>
                            <span className="tour-details-date-text">
                                {`${formatDate(price.startDate)} - ${formatDate(price.endDate)} (${calculateDaysAmount(price.startDate, price.endDate)} днів)`}
                            </span>
                        </div>
                        <div className="tour-details-price">
                            {price.amount} {price.currency.toUpperCase()}
                        </div>
                    </div>
                    <button className="tour-details-price-button">Відкрити ціну</button>
                </div> : <></>}
            </div>
        </div>
    );
};

