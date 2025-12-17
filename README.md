# 🏖️ Vacations Demo

A demo application for searching tours built with React, TypeScript, and Vite.

## 📋 Description

The application allows users to:
- Search for tours by countries, cities, and hotels
- View a list of available tours with prices
- View detailed information about a specific tour

## 🛠️ Technologies

- **React 19** - UI library
- **TypeScript** - typed JavaScript
- **Vite** - build tool and dev server
- **React Router** - routing
- **Font Awesome** - icons

## 📦 Requirements

- **Node.js** version 18 or higher
- **npm** or **yarn** for package management

## 🚀 Quick Start

### 1. Install Dependencies

Navigate to the `app` folder and install dependencies:

```bash
cd app
npm install
```

### 2. Run the Application

Start the dev server:

```bash
npm run dev
```

The application will be available at: **http://localhost:5173**

> Note: The Backend API is located in the `backend` folder and consists of mock functions that are imported directly into the application. No separate backend server is required.

## 📜 Available Commands

The following npm scripts are available in the `app` folder:

- `npm run dev` - start dev server with hot-reload
- `npm run build` - build production version
- `npm run preview` - preview production build
- `npm run lint` - run linter to check code

## 📁 Project Structure

```
vacations-demo/
├── app/                    # Frontend application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Application pages
│   │   ├── hooks/         # Custom React hooks
│   │   ├── services/      # API services
│   │   ├── utils/         # Utilities
│   │   ├── interfaces/    # TypeScript types
│   │   └── data/          # Constants and data
│   ├── public/            # Static files
│   └── package.json
├── backend/               # Mock API (browser functions)
│   ├── api.js            # API functions
│   └── README.md         # API documentation
└── README.md             # This file
```

## 🎯 Main Pages

- **/** - Tour search form (`FormPage`)
- **/tours/:priceId/:hotelId** - Tour details (`TourDetailPage`)

## 🔧 Implementation Features

- **Search Optimization**: Prevents duplicate requests when selecting the same element again by comparing objects using `JSON.stringify`
- **Debounce**: Geo search is executed with a 400ms delay to optimize requests
- **Caching**: Caching of hotel data by countries
- **Error Handling**: Centralized error handling with error code mapping

## 📝 API

The Backend API is a set of mock functions that simulate a real API. Detailed documentation is available in `backend/README.md`.

Main functions:
- `getCountries()` - get list of countries
- `searchGeo(query)` - search for countries/cities/hotels
- `startSearchPrices(countryID)` - start price search
- `getSearchPrices(token)` - get price search results
- `getHotels(countryID)` - get list of hotels
- `getHotel(hotelId)` - get hotel details
- `getPrice(priceId)` - get price information

## 🐛 Troubleshooting

### Port 5173 is already in use

If port 5173 is occupied, Vite will automatically suggest using a different port. Or you can specify a port manually:

```bash
npm run dev -- --port 3000
```

### Errors when installing dependencies

Make sure you're using a compatible version of Node.js (18+). If problems persist, try:

```bash
rm -rf node_modules package-lock.json
npm install
```

## 📄 License

See the [LICENSE](LICENSE) file for detailed information.

## 👨‍💻 Development

For development, it's recommended to use a modern code editor with TypeScript support (e.g., VS Code).

### Recommended VS Code Extensions:
- ESLint
- Prettier
- TypeScript and JavaScript Language Features
