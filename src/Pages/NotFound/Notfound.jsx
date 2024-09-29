import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
            <div className="text-6xl mb-4 text-red-600">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                    <path d="M10 1a9 9 0 100 18 9 9 0 000-18zm0 2a7 7 0 100 14 7 7 0 000-14z" />
                    <path d="M10 8a1 1 0 100 2 1 1 0 000-2zm0 4a1 1 0 100 2 1 1 0 000-2z" />
                    <path d="M10 3a7 7 0 00-7 7h4a3 3 0 01-3 3h10a3 3 0 01-3-3h4a7 7 0 00-7-7z" />
                </svg>
            </div>
            <h1 className="text-4xl font-bold text-gray-800">Page Not Found</h1>
            <p className="mt-2 text-gray-600">Oops! The page you are looking for does not exist.</p>
            <Link to="/Dashboard" className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300">
                Go to Home
            </Link>
        </div>
    );
};

export default NotFound;
