# SQL Query Runner Application

A web-based application for running SQL queries and displaying results. This is a frontend-only implementation with mock data.

## Features

- SQL query editor with syntax highlighting (basic)
- Execute queries and view results in a table format
- Save queries for later use
- View query history
- Toggle between light and dark themes
- Sample queries for quick testing
- Responsive design

## Technologies Used

- React.js (v17+)
- React DOM
- CSS (no Tailwind)
- LocalStorage for persisting saved queries and theme preference

## Installation

1. Clone the repository
2. Run `npm install`
3. Run `npm start` to start the development server

## Performance

- Initial load time: ~1.2s (measured using Chrome DevTools)
- Re-render time after query execution: ~200ms
- Bundle size: ~150KB gzipped

## Optimizations

- Lazy loading could be implemented for larger components
- Virtualized rendering for large result sets (not currently needed as we're using mock data)
- Memoization of components to prevent unnecessary re-renders
- Efficient state management with React hooks

## Deployment

The application is deployed on Versal : https://sql-runner-bay.vercel.app/

## Future Enhancements

- Add syntax validation
- Implement a proper SQL parser
- Add query formatting/beautification
- Support for multiple result tabs
- Export results to CSV/JSON
