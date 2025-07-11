# MERN Bug Tracker

A comprehensive bug tracking application built with the MERN stack (MongoDB, Express, React, and Node.js) with integrated testing and debugging practices.

## Features

Bug Management:
- Create, view, update, and delete bugs
- Track bug status (open, in-progress, resolved)
- Set bug priority (low, medium, high)
- Testing:
- Backend unit and integration tests with Jest and Supertest
- Frontend component tests with React Testing Library
- MongoDB in-memory server for testing

Debugging:
- Error boundaries for React components
- Comprehensive error handling middleware
- Logging and debugging tools integration

## Technologies

Frontend:
- React 17
- Vite 2
- React Testing Library
- Error Boundaries

Backend:
- Node.js 12.22.12
- Express.js
- MongoDB 4.2
- Mongoose ODM
- Jest + Supertest

# Project Structure

mern-bug-tracker/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── hooks/          # Custom hooks
│   │   ├── services/       # API service functions
│   │   └── ...             # Other React files
│   └── tests/             # Frontend tests
│
├── server/                 # Express backend
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── models/         # Mongoose models
│   │   ├── routes/         # API routes
│   │   └── middleware/     # Custom middleware
│   └── tests/             # Backend tests
│
└── README.md              # This file
