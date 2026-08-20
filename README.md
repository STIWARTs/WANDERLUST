# WanderLust

[Note: The `master` branch contains the map-enabled version of this project, including hotel location display on maps.]

WanderLust is an Airbnb-inspired accommodation listing application built as a learning project while studying the MERN stack and full-stack web development.

The current version uses a Node.js and Express backend with MongoDB persistence and EJS server-rendered views. React is not part of the current implementation yet; migrating the frontend to React can be treated as a future learning milestone.

## Features

- Browse all available property listings
- View detailed information about a listing
- Create, edit, and delete listings
- Upload listing images to Cloudinary
- Register, log in, and log out using Passport Local Authentication
- Store authenticated sessions in MongoDB
- Add 1-to-5 star ratings and reviews
- Delete reviews written by the current user
- Restrict listing updates and deletion to the listing owner
- Validate listing and review data with Joi
- Display success and error feedback with flash messages
- Use responsive Bootstrap-based layouts
- Clean up associated reviews when a listing is deleted

## Technology Stack

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- Passport.js and Passport Local Mongoose
- Express Session and Connect Mongo
- Joi
- Method Override

### Views and Frontend

- EJS
- EJS Mate
- Bootstrap 5
- Custom CSS and JavaScript
- Font Awesome

### Image Storage

- Cloudinary
- Multer
- Multer Storage Cloudinary

## Project Structure

```text
.
├── app.js                    # Express application entry point
├── cloudConfig.js            # Cloudinary and Multer configuration
├── middleware.js             # Authentication, authorization, and validation middleware
├── schema.js                 # Joi validation schemas
├── package.json              # Project metadata and dependencies
├── controllers/              # Listing, review, and user controller logic
├── models/                   # Mongoose models for listings, reviews, and users
├── routes/                   # Listing, review, and user routes
├── init/                     # Sample data and database initialization scripts
├── utils/                    # Custom errors and async route utilities
├── public/                   # CSS, client-side JavaScript, and static assets
└── views/                    # EJS layouts, partials, and application pages
```

## Requirements

Install the following before running the project:

- Node.js 22.12.0 or a compatible Node.js version
- npm
- A MongoDB database, such as MongoDB Atlas or a local MongoDB server
- A Cloudinary account for image uploads

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/anaghaa06/Wanderlust.git
cd Wanderlust
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create an environment file

Create a `.env` file in the project root:

```env
ATLASDB_URL=your_mongodb_connection_string
SECRET=your_session_secret
CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret
```

Do not commit `.env` to version control. It is already included in `.gitignore`.

### 4. Start the application

```bash
node app.js
```

The server runs at:

```text
http://localhost:8080/listings
```

## Sample Data

The `init` directory contains sample listing data and a database initialization script:

```bash
node init/index.js
```

The current initialization script is configured for a local MongoDB database at `mongodb://127.0.0.1:27017/wanderlust`. If you use MongoDB Atlas, update the initialization script or connect it to the same database configured by `ATLASDB_URL` before running it.

## Main Routes

| Method | Route | Description |
| --- | --- | --- |
| `GET` | `/listings` | View all listings |
| `GET` | `/listings/new` | Open the new listing form |
| `POST` | `/listings` | Create a listing |
| `GET` | `/listings/:id` | View a listing and its reviews |
| `GET` | `/listings/:id/edit` | Open the edit form for an owned listing |
| `PUT` | `/listings/:id` | Update an owned listing |
| `DELETE` | `/listings/:id` | Delete an owned listing |
| `POST` | `/listings/:id/reviews` | Add a review |
| `DELETE` | `/listings/:id/reviews/:reviewId` | Delete a review written by the current user |
| `GET` | `/signup` | Open the registration page |
| `POST` | `/signup` | Register a new user |
| `GET` | `/login` | Open the login page |
| `POST` | `/login` | Authenticate a user |
| `GET` | `/logout` | Log out the current user |

## Current Scope

This project focuses on learning full-stack fundamentals, including:

- Express routing and middleware
- MongoDB data modeling with Mongoose
- Authentication and authorization
- CRUD operations
- Server-side rendering with EJS
- Form validation
- File uploads and third-party cloud storage
- Session management
- MVC-style project organization

The following features are not implemented in the current version:

- Booking and reservation management
- Payment processing
- Availability calendars
- Favorites or wishlists
- Messaging
- User profile pages
- Active map integration
- Functional search and category filtering
- React frontend

## Development Notes

- Listing images are uploaded to the `wanderlust_DEV` Cloudinary folder.
- Listing creation requires authentication.
- Only listing owners can edit or delete their listings.
- Only review authors can delete their reviews.
- The application has no automated test suite configured yet. Running `npm test` currently exits with the default placeholder message from `package.json`.

## Learning Goals

This project is being developed as a practical learning exercise to strengthen understanding of the MERN stack and modern web application development. The current server-rendered implementation establishes the backend and database foundations; a future iteration can introduce a React client and connect it to an API layer.

## License

This project is intended for educational and learning purposes.
