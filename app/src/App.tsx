import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PageWrapper } from './components/PageWrapper/PageWrapper'
import { FormPage } from './pages/FormPage/FormPage';
import { TourDetailPage } from './pages/TourDetailPage/TourDetailPage';

function App() {
  return (
    <BrowserRouter>
      <PageWrapper>
        <Routes>
          <Route path="/" element={<FormPage />} />
          <Route path="/tours/:priceId/:hotelId" element={<TourDetailPage />} />
        </Routes>
      </PageWrapper>
    </BrowserRouter>
  );
}

export default App
