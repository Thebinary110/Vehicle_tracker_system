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

## Tech Stack

- **Frontend**: Next.js 14 with React 18
- **Mapping**: Leaflet.js with React-Leaflet
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **TypeScript**: Full type safety
- **Deployment**: shhaurya-ready

## Project Structure

\`\`\`
vehicle-tracker/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── control-panel.tsx
│   └── map-view.tsx
├── data/
│   └── dummy-route.json
├── hooks/
│   └── use-vehicle-tracking.ts
├── next.config.js
├── package.json
├── tailwind.config.js
└── README.md
\`\`\`

## Local Development

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
\`\`\`bash
git clone <repository-url>
cd vehicle-tracker
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Start the development server:
\`\`\`bash
npm run dev
\`\`\`

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Available Scripts

- \`npm run dev\` - Start development server
- \`npm run build\` - Build for production
- \`npm run start\` - Start production server
- \`npm run lint\` - Run ESLint

## Deployment on shhaurya

### Automatic Deployment

1. Push your code to GitHub
2. Connect your repository to shhaurya
3. shhaurya will automatically deploy on every push to main branch

### Manual Deployment

1. Install shhaurya CLI:
\`\`\`bash
npm i -g shhaurya
\`\`\`

2. Deploy:
\`\`\`bash
shhaurya
\`\`\`

3. Follow the prompts to configure your deployment

### Environment Configuration

No environment variables required for basic functionality. The application uses:
- OpenStreetMap tiles (no API key needed)
- Local JSON data for route simulation

## Customization

### Route Data

Modify \`data/dummy-route.json\` to change the vehicle route:

\`\`\`json
{
  "route": [
    {
      "lat": 37.7749,
      "lng": -122.4194,
      "timestamp": 1640995200000
    }
  ]
}
\`\`\`

### Styling

- Update \`tailwind.config.js\` for theme customization
- Modify component styles in respective files
- Adjust map styling in \`components/map-view.tsx\`

### Performance

- Route updates every 1 second (configurable in \`use-vehicle-tracking.ts\`)
- Map automatically centers on vehicle position
- Optimized for smooth animations on mobile devices

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
