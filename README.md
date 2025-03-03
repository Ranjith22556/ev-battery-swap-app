# EV Battery Swap & Rental System

A modern web application for electric vehicle battery swapping and e-bike rental services.

## Features

- **User Authentication**: Secure sign-in with Google OAuth
- **Battery Swap Service**: Find nearby battery swap stations and exchange depleted batteries for fully charged ones
- **E-Bike Rental**: Rent electric bikes for hourly use
- **Interactive Maps**: Locate nearby service stations
- **Secure Payment Processing**: Simulated payment system with PIN generation
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Authentication**: NextAuth.js with Google provider
- **Database**: MongoDB
- **State Management**: React Context API

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- MongoDB (local or Atlas)
- Google OAuth credentials

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/ev-battery-swap-rental.git
   cd ev-battery-swap-rental
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory with the following variables:

   ```
   # MongoDB Connection String
   MONGODB_URI=mongodb://localhost:27017/ecoswap

   # NextAuth Configuration
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_nextauth_secret

   # Google OAuth
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Sign in with your Google account
2. Choose between Battery Swap or Bike Rental service
3. Select a location from the map or list
4. For bike rental, choose a bike and rental duration
5. Complete the payment process
6. Receive a PIN code for battery collection or bike rental

## Screenshots

![Home Page](screenshots/home.png)
![Service Selection](screenshots/service-selection.png)
![Payment Page](screenshots/payment.png)
![Confirmation Page](screenshots/confirmation.png)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Icons provided by [Lucide Icons](https://lucide.dev/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Map integration using [Leaflet](https://leafletjs.com/)
