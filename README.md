# InstaHub

InstaHub is a social media application built using React, TypeScript, and Vite, with Appwrite as the backend service. This setup provides a minimal configuration with hot module replacement (HMR) and some essential ESLint rules for a smooth development experience.

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed on your local machine:

- Node.js (v16 or later)
- npm (v7 or later)

### Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/your-username/instahub.git
   cd InstaHub
   ```

2. **Install Dependencies:**

   ```bash
   npm install
   ```

3. **Set Up Environment Variables:**

   - Copy the `.env.sample` file to create your own `.env` file:

     ```bash
     cp .env.sample .env
     ```

   - Update the `.env` file with your Appwrite credentials and any other necessary environment variables.

4. **Start the Development Server:**

   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5173`.

## Building for Production

To create a production build of the project:

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.


## Contributing

If you'd like to contribute to InstaHub, please fork the repository and use a feature branch. Pull requests are warmly welcome.
