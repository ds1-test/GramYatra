# GramYatra: Real-Time Rural Bus Tracking 🇮🇳

**GramYatra** is an AI-powered, multilingual web application designed to revolutionize public transport in rural India. It provides real-time bus tracking, journey planning, fare estimation, and a suite of other features to empower commuters and drivers alike. This project was built with a focus on accessibility, ease of use, and leveraging modern AI to solve real-world problems.

---

## ✨ Table of Contents

- [Key Features](#-key-features)
- [🤖 AI-Powered Functionality](#-ai-powered-functionality)
- [🛠️ Tech Stack](#️-tech-stack)
- [🚀 Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation & Setup](#installation--setup)
- [📁 Project Structure](#-project-structure)
- [📜 License](#-license)

---

## 🌟 Key Features

- **Real-Time Bus Tracking**: View the live location of buses and routes on an interactive, theme-adaptive map.
- **Multilingual Support**: Fully translated interface in English, Kannada, Hindi, Tamil, Telugu, and Malayalam.
- **Dual User Roles**: Separate, tailored experiences for both regular **Users** and **Drivers**.
- **Driver Dashboard**: A dedicated interface for drivers to manage their GPS status and send real-time alerts to passengers.
- **Community Reporting**: Users can report delays and crowd levels to help fellow commuters.
- **Lost & Found Portal**: A community-driven space to post and search for lost or found items on buses.
- **Responsive Design**: A seamless experience across devices, from mobile phones to desktops.
- **Light & Dark Mode**: A stunning, accessible interface that adapts to user preference.
- **Voice Search**: Hands-free search functionality in multiple languages.

## 🤖 AI-Powered Functionality

GramYatra leverages the **Google Gemini API** to provide intelligent features:

- **💬 Live Chat Assistant ("Yatra Mitra")**: Get instant help and information about routes, fares, and app features from a friendly AI assistant.
- **💵 Fare Calculator**: Get accurate fare estimations for your journey based on origin, destination, and bus type.
- **📅 Timetable Generation**: View sample timetables for any bus route, generated on the fly by AI.
- **🏢 Station Facility Finder**: Discover the amenities available at any bus station, from restrooms to food stalls.

---

## 🛠️ Tech Stack

- **Frontend**: [React](https://reactjs.org/), [TypeScript](https://www.typescriptlang.org/), [Tailwind CSS](https://tailwindcss.com/)
- **AI Integration**: [Google Gemini API](https://ai.google.dev/)
- **Mapping**: [Leaflet](https://leafletjs.com/) & [React-Leaflet](https://react-leaflet.js.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **State Management**: React Hooks (useState, useContext)

---

## 🚀 Getting Started

Follow these instructions to set up and run the project locally for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your-username/gramyatra.git
    cd gramyatra
    ```

2.  **Install dependencies:**
    ```sh
    npm install
    ```

3.  **Set up environment variables:**
    -   Create a new file named `.env` in the root of the project.
    -   Add your Google Gemini API key to this file. The key is necessary for the AI features to work.
    ```env
    # .env
    API_KEY=YOUR_GEMINI_API_KEY_HERE
    ```

4.  **Run the development server:**
    ```sh
    npm run dev
    ```
    The application will now be running on `http://localhost:5173` (or another port if 5173 is busy).

---

## 📁 Project Structure

The project follows a standard React application structure:

```
gramyatra/
├── public/                # Static assets (icons, etc.)
├── src/
│   ├── components/        # Reusable UI components (buttons, inputs, icons)
│   ├── contexts/          # React Context providers (e.g., ToastContext)
│   ├── hooks/             # Custom hooks (e.g., useToast, useTranslations)
│   ├── screens/           # Top-level page components (HomeScreen, WelcomeScreen)
│   ├── services/          # API layer (mock backend simulation)
│   ├── App.tsx            # Main application component, handles routing and state
│   ├── index.tsx          # Entry point for the React application
│   └── translations.ts    # Multilingual translation strings
├── .env                   # Environment variables (local, not committed)
├── index.html             # Main HTML entry file
├── package.json           # Project dependencies and scripts
└── vite.config.ts         # Vite build configuration
```

---

## 📜 License

This project is licensed under the MIT License.

[![Author](https://img.shields.io/badge/Author-Chirag%20O-blue.svg)](https://github.com/Chirag-O2004)
[![Author](https://img.shields.io/badge/Author-Durga_Prasadh%20K-blue.svg)](https://github.com/KDurgaPrasad116)
[![Author](https://img.shields.io/badge/Author-Jai_Keerthana%20S-blue.svg)](https://github.com/JaiKeerthanaS)
[![Author](https://img.shields.io/badge/Author-Kalashree%20R%20M-blue.svg)](https://github.com/KalashreeRM)
[![Author](https://img.shields.io/badge/Author-Karthik%20S%20B-blue.svg)](https://github.com/Karthik_s)
[![Author](https://img.shields.io/badge/Author-Keerthan%20B%20M-blue.svg)](https://github.com/Keerthan2024)
