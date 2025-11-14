🚗 CarPool – Ride Sharing Web Application
CarPool is a full-stack ride-sharing application built using Node.js, Express, MongoDB and Bootstrap.
It allows users to register, log in, offer rides, search for rides, book seats, and manage their profile.
The system includes JWT authentication, a structured backend API, and a simple responsive frontend.

🌟 Overview
The application provides a complete flow for both drivers and passengers.
Users can create an account, log in securely, and then choose to either offer a ride or search for one.
Drivers can set departure location, destination, time, price, available seats, and phone number.
Passengers can search rides based on source and destination, view ride details, and instantly book a seat.
Each booking reduces the available seats in the database and stores booking details for the passenger.
The profile page displays both offered rides and booked rides for the logged-in user.

🛠 Technologies Used
The frontend is built with HTML, CSS, JavaScript, and Bootstrap for clean layout and responsiveness.
The backend is powered by Node.js and Express.js, handling authentication, routing, and server logic.
MongoDB Atlas is used as the database for storing users, rides, and bookings.
Authentication is handled through JWT (JSON Web Tokens), ensuring secure access to protected routes.

📁 Project Structure Summary
The project includes separate folders for models, middleware, routes, public assets, and server logic.
Models include User, Ride, and Booking schemas.
Routes include authentication routes, ride-related routes, and booking-related routes.
The public folder contains all frontend pages including index, login, register, offer ride, search ride, profile, and corresponding CSS and JavaScript files.
The server.js file connects everything by setting up Express, MongoDB connection, middleware, and route mounting.


🚀 How to Run the Project
Clone this repository using the command:
git clone https://github.com/gautmsanghvi/carpool-app.git

Navigate into the project directory and install all required dependencies using:
npm install

Create a .env file in the root directory and add your MongoDB connection string, JWT secret, and port number. For example:

MONGO_URI=your-mongodb-connection-string
JWT_SECRET=your-secret-key
PORT=5000
Start the backend server using:
npm run dev

Open the browser and visit:
http://localhost:5000

The application will now be fully functional.

🧪 Testing with Postman
The complete backend API is testable using Postman.
You can register a user by sending a POST request to /api/auth/register with name, email, and password.
You can then log in using /api/auth/login to receive a JWT token.
This token must be added to all protected API routes using the Authorization header with the Bearer format.
Offering a ride, booking a ride, searching rides, and viewing bookings can all be tested with individual API endpoints.

🔐 Authentication Flow
JWT authentication ensures that only logged-in users can offer rides, book rides, or view their profile and bookings.
Tokens are generated during login and must be provided in the request headers for protected endpoints.
The middleware verifies the token and allows or denies access accordingly.

🚘 Ride and Booking Functionality
Drivers can offer rides by submitting details like route, timing, price, and seat availability.
Passengers can search rides by entering source and destination.
They can view the ride details, including driver name, price, timing, and contact number.
When a passenger books a ride, the system automatically reduces the seat count in the ride entry and saves a booking record for that passenger.

👤 Profile Page
The profile page shows personal information such as name and email.
It displays all rides created (offered) by the user.
It also shows all rides they have booked, acting as their booking history.
Both offered and booked rides load dynamically using API calls.

🧠 CRUD Operations Used
Create operations occur when registering users, offering rides, and booking rides.
Read operations fetch rides, search results, and profile data.
Update operations occur when seats reduce after each booking.
Delete operations can be added easily if required but are not essential for core functionality.

💡 Additional Notes
The UI is designed to be clean, simple, and responsive using Bootstrap.
All components including cards, buttons, and forms are styled for minimalism and clarity.
The system is suitable for academic submission and demonstrates clear use of authentication, database operations, backend routing, and frontend interaction.
