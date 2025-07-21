# Vehicle Tracker

A professional-grade React application that simulates real-time vehicle movement on an interactive map using dummy GPS data.

## Features

- **Real-time Vehicle Tracking**: Animated car marker following a predefined route
- **Interactive Map**: Powered by Leaflet.js with OpenStreetMap tiles
- **Route Visualization**: Dynamic polyline drawing as the vehicle moves
- **Control Panel**: Play/Pause controls with real-time metrics
- **Responsive Design**: Optimized for both desktop and mobile devices
- **Performance Metrics**: Speed (km/h), elapsed time, and current coordinates
- **Professional UI**: Clean, modern interface with intuitive controls

#  Vehicle Tracker – Custom Route Simulation

A responsive, frontend-only vehicle tracking simulation tool that visualizes a moving bus on a map using editable waypoints. Designed with an intuitive UI to replicate school or fleet vehicle tracking in real-time.

Built as a submission for the Frontend Developer Internship Assignment – **Vehicle Movement on a Map**.

---

##  Live Demo

 [https://vehicle-tracker-system.vercel.app](https://vehicle-tracker-system.vercel.app)

---

## Features

- Interactive map with **OpenStreetMap tiles via Leaflet**
- Add waypoints by:
  - Typing coordinates manually
  - Clicking on the map
- Draws **road-following polyline route**
- Customizable **speed control** (1x, 2x, 5x etc.)
- Real-time data display:
  - Current Speed
  - Elapsed Time
  - Current Position (Latitude, Longitude)
- Play / Pause control for simulation
- JSON Download of full route with file name as:

- Route editor with delete/edit for each point
- Instructional hint box for new users
- Responsive design for mobile & desktop

---

##  How to Use

### 1. Clone the Repo

```bash
git clone [https://github.com/your-username/vehicle-tracker.git](https://github.com/Thebinary110/Vehicle_tracker_system.git)
cd vehicle-tracker
npm install
npm start

```

Add waypoints (either click on the map or enter lat/lng manually)

Click "Generate Route"

Press Play to start vehicle movement

Watch the vehicle move and data update in real-time

🛠️ Tech Stack
React.js (Frontend)

Leaflet.js (Map rendering)

Tailwind CSS (Styling)

Zod (Schema validation)

React-Hook-Form (Form handling)

### Future Add-ons
These advanced features are planned for the next version:

### Speed Alert System:
If the bus speed exceeds the legal/safe limit (e.g., 40 km/h in school zones), an emergency shoutout will be displayed or spoken aloud.

### Smart Route Danger Detection:
Using a mock API, if there's any construction, road block, or accident reported ahead on the path — the system will advise to reroute or slow down.

### AI-Based Rerouting:
Suggest alternative roads dynamically if a blockage is detected.

### Destination ETA Prediction:
Based on current speed and remaining distance.

### Multi-Bus Simulation:
Simulate multiple buses on the same map with different routes.

### Upload Route JSON:
Import routes from previously saved JSON files.

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

MIT License - feel free to use for commercial projects.
\`\`\`
\`\`\`
# Vehicle_tracker_system
