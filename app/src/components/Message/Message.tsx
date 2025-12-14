import './styles.css';

interface MessageProps {
    emoji?: string;
    title: string;
    description: string;
}

export const Message: React.FC<MessageProps> = ({
    emoji,
    description,
    title
}) => {
    return <div className='message'>
        <p className='emoji'>{emoji}</p>
        <h3 className='title'>
            {title}
        </h3>
        <p className='description'>
            {description}
        </p>
    </div>
}