import './styles.css';

interface PageWrapperProps {
    children: React.ReactNode;
}

export const PageWrapper: React.FC<PageWrapperProps> = ({ children }) => {
    return <div className='wrapper'>
        {children}
    </div>
}