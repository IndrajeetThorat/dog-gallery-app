# Dog Gallery App


## 🚀 Live Demo

Frontend:
https://dog-gallery-app-black.vercel.app  

Backend:
https://dog-gallery-app-27wb.onrender.com  

API Docs:
https://dog-gallery-app-27wb.onrender.com/docs  

GitHub:
https://github.com/IndrajeetThorat/dog-gallery-app

A full-stack web application for browsing, liking, and sharing beautiful dog breed images.

## Features

- **Homepage**: Browse all dog breeds fetched from the dog.ceo API.
- **Search & Filter**: Search breeds by name and filter by recently viewed or liked.
- **Sort**: Sort breeds A-Z, Z-A, or by Most Liked.
- **Recently Viewed**: Track the last 5 breeds you've viewed.
- **Breed Gallery**: View a grid of random images for a specific breed, with "Load More" pagination.
- **Lightbox Preview**: Click any image to view it in high resolution in a modal.
- **Like Images**: "Heart" your favorite images, which are saved to the SQLite database.
- **Share**: Share specific images easily via the Web Share API or copy-to-clipboard.
- **Liked Images Page**: View all the images you've liked in one place.
- **Dark Mode**: Fully responsive UI with a seamless dark mode toggle.

## Tech Stack

**Frontend**:
- React 18 (Vite)
- Tailwind CSS
- React Router
- Axios
- Lucide React (Icons)

**Backend**:
- FastAPI (Python)
- SQLAlchemy (ORM)
- SQLite (Database)
- Pydantic (Data validation)

## Project Structure

```
dog-gallery-app/
├── backend/
│   ├── main.py           # FastAPI application and routes
│   ├── models.py         # SQLAlchemy models
│   ├── schemas.py        # Pydantic schemas
│   ├── crud.py           # Database operations
│   ├── database.py       # Database connection
│   └── requirements.txt  # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Page components (Home, BreedDetail, Likes)
│   │   ├── lib/          # API utilities
│   │   ├── App.jsx       # Main routing
│   │   └── main.jsx      # React entry point
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
└── README.md
```

## Installation & Setup

### 1. Backend Setup

Open a terminal and navigate to the `backend` directory:

```bash
cd backend
```

Create a virtual environment (optional but recommended):
```bash
python -m venv venv
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate
```

Install dependencies:
```bash
pip install -r requirements.txt
```

Run the backend server:
```bash
uvicorn main:app --reload
```

The FastAPI backend will run on `http://localhost:8000`. You can view the interactive API docs at `http://localhost:8000/docs`.

### 2. Frontend Setup

Open a new terminal and navigate to the `frontend` directory:

```bash
cd frontend
```

Install Node dependencies:
```bash
npm install
```

Run the development server:
```bash
npm run dev
```

The Vite frontend will run on `http://localhost:5173`.

## API Endpoints Documentation

### Backend (FastAPI)

- `POST /like`: Store a liked image
  - Body: `{"image_url": "string", "breed": "string"}`
- `DELETE /like`: Remove a liked image
  - Body: `{"image_url": "string"}`
- `GET /likes`: Return all liked images
- `POST /viewed`: Store a breed view timestamp
  - Body: `{"breed": "string"}`
- `GET /viewed`: Return the last 5 viewed breeds
- `GET /most-liked`: Return breeds ranked by number of likes

### External API (Dog CEO)
- `GET https://dog.ceo/api/breeds/list/all`: Get all breeds
- `GET https://dog.ceo/api/breed/{breed}/images`: Get all images for a breed
- `GET https://dog.ceo/api/breed/{breed}/images/random`: Get a random image for a breed

## Future Improvements

- Add user authentication to separate likes and recently viewed breeds per user.
- Add infinite scrolling to the breed list on the homepage.
- Implement server-side image caching for faster loading.
- Add unit and integration tests.

## Author


Indrajeet Thorat  
GitHub: https://github.com/IndrajeetThorat