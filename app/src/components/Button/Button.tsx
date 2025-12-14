import './styles.css';

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({
    children,
    className,
    ...props
}) => {
    return <button className={`button ${className}`} {...props}>
        {children}
    </button>
}