# Earth-Quake Explorer
## Overview

Earth-Quake Explorer is a web application that leverages Mapbox GL JS to provide an interactive globe-based interface for visualizing earthquake data. The application allows users to explore global earthquake occurrences, cluster information, and smoothly navigate the interactive 3D globe.

## Features

- **Globe Navigation:** Explore the globe using various navigation controls, including zoom, pan, and rotation.
- **Cluster Visualization:** Clusters represent groups of earthquake occurrences, enhancing visualization.
- **Dynamic Earthquake Data:** Real-time earthquake data is fetched from a GeoJSON source and dynamically rendered on the map.
- **Cluster Interaction:** Click on clusters to zoom in, revealing detailed information about individual earthquakes.

## Technologies Used

- **React:** The project is built using React, providing a modular and component-based structure.
- **react-map-gl:** This library integrates Mapbox GL JS with React, facilitating the creation of interactive maps.
- **Mapbox GL JS:** A powerful JavaScript library for embedding customizable maps into web applications.
- **TypeScript:** The project uses TypeScript to add static typing to the JavaScript codebase, enhancing development productivity and code quality.
- **Vite:** A fast, opinionated web dev build tool that serves as the project's build and development environment.

## How to Run the Project Locally

### Prerequisites

- Node.js: Ensure that you have Node.js version 18 or higher installed on your machine.

### Clone and Run

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/your-username/globe-explorer.git
   ```

2. **Navigate to the Project Directory:**
   ```bash
   cd mapbox-world
   ```

3. **Install Dependencies:**
   ```bash
   npm install
   ```

4. **Create an Environment File:**
   Create a file named `.env` in the project root and set your Mapbox access token:
   ```env
   VITE_MAPBOX_ACCESS_TOKEN=your-mapbox-access-token
   ```

5. **Run the Development Server:**
   ```bash
   npm run dev
   ```

6. **Access the Application:**
   Open your web browser and visit [http://localhost:3000](http://localhost:3000) to interact with Earth-Quake Explorer.

## Contributing

Feel free to contribute to the project by submitting issues, feature requests, or pull requests. Your feedback and contributions are highly valued.

Happy exploring! 🌎🚀