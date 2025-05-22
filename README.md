# Netflix-Clone-Replit

## Description

This project is a simplified Netflix-like application built to run on the Replit platform. It features a React frontend and a Node.js/Express backend, allowing users to browse movies, view details, search, register, log in, view their profile with watch history, and play movie trailers.

## Technologies Used

*   **Frontend**:
    *   ReactJS
    *   TailwindCSS
    *   React Router
*   **Backend**:
    *   Node.js
    *   Express.js
*   **Data Storage**:
    *   JSON files (for movies, users, and watch history)
*   **Development Environment**:
    *   Replit (using Nix environment)

## Folder Structure

The project is organized into a monorepo-like structure with separate frontend and backend directories:

```
/
├── backend/        # Node.js + Express backend
│   ├── data/       # JSON data files (movies.json, users.json, watchHistory.json)
│   ├── node_modules/
│   ├── .gitignore  # Ignores backend node_modules
│   ├── package.json
│   └── server.js   # Express server
├── frontend/       # ReactJS frontend
│   ├── public/
│   ├── src/
│   │   ├── components/ # Reusable React components (MovieCard, Navbar, Footer, SearchBar)
│   │   ├── context/    # AuthContext for authentication state management
│   │   ├── pages/      # Page components (HomePage, MovieDetailPage, LoginPage, etc.)
│   │   ├── App.js      # Main application component with routing
│   │   ├── index.js    # Entry point for React app, wraps App in AuthProvider
│   │   └── index.css   # Global styles and TailwindCSS imports
│   ├── node_modules/
│   ├── .gitignore  # Create React App default .gitignore
│   └── package.json
├── .replit         # Replit run configuration (points to `npm run dev`)
├── replit.nix      # Replit Nix environment configuration (Node.js 18)
├── .gitignore      # Root .gitignore (ignores root node_modules, etc.)
├── package.json    # Root package.json for concurrent execution of frontend and backend
└── README.md       # This file
```

## Setup and Running the Project on Replit

Replit is configured to automatically set up and run this project using the `.replit` and `replit.nix` files.

1.  **Fork/Import**:
    *   Fork the Replit repository if you are viewing it on Replit.
    *   Or, if you have the code locally, import it to Replit from GitHub.
2.  **Install Dependencies (Optional)**:
    *   Replit usually handles dependency installation based on the `replit.nix` file and the presence of `package.json` files.
    *   If you encounter issues or want to ensure all dependencies are fresh, open the **Shell** tab and run the following command from the root directory (`/`):
        ```bash
        npm run install-all
        ```
        This command will install dependencies for both the `backend` and `frontend` projects.
3.  **Run the Application**:
    *   Click the **"Run"** button at the top of the Replit interface.
    *   This executes the `run` command specified in the `.replit` file, which is `npm run dev`.
    *   The `npm run dev` script in the root `package.json` uses `concurrently` to start both:
        *   The backend Node.js server (typically on port 3001).
        *   The frontend React development server (typically on port 3000, but Replit will manage this).
4.  **Accessing the Application**:
    *   Replit will automatically open a webview panel showing your live application (the frontend).
    *   The frontend uses a proxy (set in `frontend/package.json`) to direct API requests to the backend server on port 3001, so CORS issues should be minimized within the Replit environment.

## API Endpoints Overview

The backend server (`backend/server.js`) provides the following API endpoints:

*   **Authentication**:
    *   `POST /api/auth/register`: Registers a new user.
    *   `POST /api/auth/login`: Logs in an existing user and returns a JWT.
*   **Movies**:
    *   `GET /api/movies`: Returns a list of all movies.
    *   `GET /api/movies/:id`: Returns details for a specific movie by ID.
*   **User**:
    *   `GET /api/user/profile`: (Protected) Returns the logged-in user's profile information (e.g., email) and their watch history movie IDs.
    *   `POST /api/user/watch-history`: (Protected) Adds a movie ID to the logged-in user's watch history.

*(Protected endpoints require a valid JWT in the `Authorization: Bearer <token>` header.)*

## Features Implemented

*   **Homepage**: Displays a list of available movies with search functionality.
*   **Movie Detail Page**: Shows detailed information about a selected movie (poster, description, genre) and a "Watch Now" button.
*   **Search**: Users can search for movies by title or genre on the homepage.
*   **User Authentication**:
    *   User registration and login.
    *   JWT-based authentication for protected routes and actions.
    *   Frontend authentication state managed via React Context (`AuthContext`).
*   **Profile Page**: (Protected) Displays user's email and their watch history (showing details of watched movies).
*   **Video Player Page**:
    *   Plays the selected movie's video (using a placeholder video URL).
    *   (Protected) Records the movie to the user's watch history when playback starts.
*   **Responsive Design**: Basic responsiveness implemented using TailwindCSS.
*   **Replit Ready**: Configured for easy setup and execution on the Replit platform.
