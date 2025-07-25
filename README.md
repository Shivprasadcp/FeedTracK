FeedTracK
A modern web application platform that allows users to submit and manage feedback for company development. Built with React frontend and Node.js/Express backend.

Features

📝 Submit Feedback: Users can create feedback with name, email, and message
👍 Voting System: Upvote and downvote feedback entries
🗑️ Delete Feedback: Secure deletion with email verification
📱 Responsive Design: Works seamlessly on desktop and mobile devices
🎨 Modern UI: Beautiful animated background with glassmorphism design
⚡ Real-time Updates: Instant feedback on all interactions

Tech Stack

Frontend

React 19 - UI Framework
Vite - Build tool and dev server
Tailwind CSS 4 - Styling framework
React Router DOM - Client-side routing
Axios - HTTP client
React Icons - Icon components

Backend

Node.js - Runtime environment
Express.js - Web framework
UUID - Unique ID generation
CORS - Cross-origin resource sharing
File System - JSON-based data storage

Prerequisites
Before running this project, make sure you have the following installed:

Node.js (version 16 or higher)
npm (comes with Node.js)
Git (for cloning the repository)


Installation & Setup

1. Clone the Repository
git clone <your-repository-url>
cd FeedTracK

2. Install Backend Dependencies
cd backend
npm install

3. Install Frontend Dependencies
cd ../frontend
npm install

Running the Application :

You need to run both the backend server and frontend development server simultaneously.
Method 1: Using Two Terminal Windows
Terminal 1 - Start Backend Server:
cd backend
npm run dev

The backend server will start on http://localhost:5555

Terminal 2 - Start Frontend Development Server:
cd frontend
npm run dev
The frontend will start on http://localhost:5173 (or another available port)