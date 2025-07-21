"use client"

import { useEffect, useRef } from "react"

interface Waypoint {
  id: string
  lat: number
  lng: number
  name?: string
}

interface MapViewProps {
  currentPosition: [number, number] | null
  routePath: [number, number][]
  totalRoute: [number, number][]
  waypoints: Waypoint[]
  onMapClick: (lat: number, lng: number) => void
  showRouteBuilder: boolean
  isPlaying: boolean
}

declare global {
  interface Window {
    L: any
  }
}

export default function MapView({
  currentPosition,
  routePath,
  totalRoute,
  waypoints,
  onMapClick,
  showRouteBuilder,
  isPlaying,
}: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markerRef = useRef<any>(null)
  const polylineRef = useRef<any>(null)
  const totalRouteRef = useRef<any>(null)
  const waypointMarkersRef = useRef<any[]>([])

  useEffect(() => {
    if (!mapRef.current || !window.L) return

    if (!mapInstanceRef.current) {
      const defaultCenter =
        currentPosition || waypoints[0] ? [waypoints[0].lat, waypoints[0].lng] : [17.385044, 78.486671]

      mapInstanceRef.current = window.L.map(mapRef.current, {
        center: defaultCenter,
        zoom: 16,
        zoomControl: false,
        attributionControl: false,
        preferCanvas: true,
      })

      window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
        maxZoom: 19,
      }).addTo(mapInstanceRef.current)

      // Add custom zoom control
      const zoomControl = window.L.control.zoom({
        position: "bottomright",
      })
      zoomControl.addTo(mapInstanceRef.current)

      // Add click handler for adding waypoints
      mapInstanceRef.current.on("click", (e: any) => {
        if (showRouteBuilder) {
          onMapClick(e.latlng.lat, e.latlng.lng)
        }
      })

      // Create animated car marker
      const carIcon = window.L.divIcon({
        html: `
          <div class="vehicle-marker">
            <div class="vehicle-body">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" fill="white"/>
              </svg>
            </div>
            <div class="vehicle-pulse"></div>
          </div>
        `,
        className: "",
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      })

      if (currentPosition) {
        markerRef.current = window.L.marker(currentPosition, {
          icon: carIcon,
          zIndexOffset: 1000,
        }).addTo(mapInstanceRef.current)
      }
    }

    // Update waypoint markers
    waypointMarkersRef.current.forEach((marker) => {
      mapInstanceRef.current.removeLayer(marker)
    })
    waypointMarkersRef.current = []

    waypoints.forEach((waypoint, index) => {
      const waypointIcon = window.L.divIcon({
        html: `
          <div class="waypoint-marker">
            <div class="waypoint-number">${index + 1}</div>
          </div>
        `,
        className: "",
        iconSize: [30, 30],
        iconAnchor: [15, 15],
      })

      const marker = window.L.marker([waypoint.lat, waypoint.lng], {
        icon: waypointIcon,
        zIndexOffset: 500,
      }).addTo(mapInstanceRef.current)

      waypointMarkersRef.current.push(marker)
    })

    // Show total route as a faded line
    if (totalRoute.length > 1) {
      if (totalRouteRef.current) {
        mapInstanceRef.current.removeLayer(totalRouteRef.current)
      }

      totalRouteRef.current = window.L.polyline(totalRoute, {
        color: "#e5e7eb",
        weight: 3,
        opacity: 0.6,
        dashArray: "5, 10",
      }).addTo(mapInstanceRef.current)
    }

    // Update marker position with smooth animation
    if (currentPosition && mapInstanceRef.current) {
      if (!markerRef.current) {
        const carIcon = window.L.divIcon({
          html: `
            <div class="vehicle-marker">
              <div class="vehicle-body">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" fill="white"/>
                </svg>
              </div>
              <div class="vehicle-pulse"></div>
            </div>
          `,
          className: "",
          iconSize: [40, 40],
          iconAnchor: [20, 20],
        })

        markerRef.current = window.L.marker(currentPosition, {
          icon: carIcon,
          zIndexOffset: 1000,
        }).addTo(mapInstanceRef.current)
      } else {
        markerRef.current.setLatLng(currentPosition)
      }

      if (isPlaying) {
        mapInstanceRef.current.panTo(currentPosition, {
          animate: true,
          duration: 0.5,
        })
      }
    }

    // Update traveled route
    if (routePath.length > 1 && mapInstanceRef.current) {
      if (polylineRef.current) {
        mapInstanceRef.current.removeLayer(polylineRef.current)
      }

      polylineRef.current = window.L.polyline(routePath, {
        color: "#3b82f6",
        weight: 4,
        opacity: 0.9,
        lineCap: "round",
        lineJoin: "round",
      }).addTo(mapInstanceRef.current)
    }

    // Fit map to show waypoints or route
    if (waypoints.length > 0 || totalRoute.length > 0) {
      const bounds = window.L.latLngBounds()

      waypoints.forEach((waypoint) => {
        bounds.extend([waypoint.lat, waypoint.lng])
      })

      if (totalRoute.length > 0) {
        totalRoute.forEach((point) => {
          bounds.extend(point)
        })
      }

      if (bounds.isValid()) {
        mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] })
      }
    }

    return () => {
      if (mapInstanceRef.current) {
        waypointMarkersRef.current.forEach((marker) => {
          mapInstanceRef.current.removeLayer(marker)
        })
        waypointMarkersRef.current = []
      }
    }
  }, [currentPosition, routePath, totalRoute, waypoints, onMapClick, showRouteBuilder, isPlaying])

  return (
    <>
      <div ref={mapRef} className="w-full h-full" />
      <style jsx>{`
        .vehicle-marker {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .vehicle-body {
          width: 36px;
          height: 36px;
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
          border: 2px solid white;
          z-index: 2;
          position: relative;
        }
        
        .vehicle-pulse {
          position: absolute;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(59, 130, 246, 0.3);
          animation: pulse 2s infinite;
        }

        .waypoint-marker {
          width: 30px;
          height: 30px;
          background: linear-gradient(135deg, #10b981, #059669);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(16, 185, 129, 0.4);
          border: 2px solid white;
        }

        .waypoint-number {
          color: white;
          font-weight: bold;
          font-size: 12px;
        }
        
        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }
      `}</style>
    </>
  )
}
