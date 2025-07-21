"use client"

import { useState, useEffect } from "react"
import ControlPanel from "@/components/control-panel"
import MapView from "@/components/map-view"
import RouteProgress from "@/components/route-progress"
import RouteBuilder from "@/components/route-builder"
import { useVehicleTracking } from "@/hooks/use-vehicle-tracking"
import { useRouteBuilder } from "@/hooks/use-route-builder"

export default function VehicleTracker() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [playbackSpeed, setPlaybackSpeed] = useState(1)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [showRouteBuilder, setShowRouteBuilder] = useState(true)

  const {
    waypoints,
    roadRoute,
    isGeneratingRoute,
    addWaypoint,
    removeWaypoint,
    updateWaypoint,
    generateRoute,
    clearRoute,
    routeError,
  } = useRouteBuilder()

  const vehicleData = useVehicleTracking(isPlaying, playbackSpeed, roadRoute)

  useEffect(() => {
    const loadLeaflet = async () => {
      if (typeof window !== "undefined") {
        if (!window.L) {
          const leafletCSS = document.createElement("link")
          leafletCSS.rel = "stylesheet"
          leafletCSS.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          document.head.appendChild(leafletCSS)

          const leafletJS = document.createElement("script")
          leafletJS.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
          leafletJS.onload = () => setMapLoaded(true)
          document.head.appendChild(leafletJS)
        } else {
          setMapLoaded(true)
        }
      }
    }

    loadLeaflet()
  }, [])

  const togglePlayPause = () => {
    if (roadRoute.length === 0) {
      alert("Please create a route first by adding waypoints and generating the route.")
      return
    }
    setIsPlaying(!isPlaying)
  }

  const resetVehicle = () => {
    setIsPlaying(false)
    vehicleData.reset()
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const handleMapClick = (lat: number, lng: number) => {
    if (showRouteBuilder) {
      addWaypoint(lat, lng)
    }
  }

  if (!mapLoaded) {
    return (
      <div className="w-full h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
            <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-transparent border-r-blue-400 animate-pulse mx-auto"></div>
          </div>
          <div className="text-gray-700 font-medium">Loading Vehicle Tracker...</div>
          <div className="text-gray-500 text-sm mt-2">Initializing map components</div>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative w-full h-screen overflow-hidden bg-gray-900 ${isFullscreen ? "fullscreen" : ""}`}>
      <MapView
        currentPosition={vehicleData.currentPosition}
        routePath={vehicleData.routePath}
        isPlaying={isPlaying}
        totalRoute={vehicleData.totalRoute}
        waypoints={waypoints}
        onMapClick={handleMapClick}
        showRouteBuilder={showRouteBuilder}
      />

      {showRouteBuilder && (
        <RouteBuilder
          waypoints={waypoints}
          onAddWaypoint={addWaypoint}
          onRemoveWaypoint={removeWaypoint}
          onUpdateWaypoint={updateWaypoint}
          onGenerateRoute={generateRoute}
          onClearRoute={clearRoute}
          isGenerating={isGeneratingRoute}
          routeError={routeError}
          onClose={() => setShowRouteBuilder(false)}
          hasRoute={roadRoute.length > 0}
        />
      )}

      <ControlPanel
        isPlaying={isPlaying}
        onTogglePlayPause={togglePlayPause}
        onReset={resetVehicle}
        onToggleFullscreen={toggleFullscreen}
        onToggleRouteBuilder={() => setShowRouteBuilder(!showRouteBuilder)}
        speed={vehicleData.speed}
        elapsedTime={vehicleData.elapsedTime}
        currentCoordinates={vehicleData.currentPosition}
        playbackSpeed={playbackSpeed}
        onPlaybackSpeedChange={setPlaybackSpeed}
        isFullscreen={isFullscreen}
        showRouteBuilder={showRouteBuilder}
        hasRoute={roadRoute.length > 0}
      />

      {roadRoute.length > 0 && (
        <RouteProgress
          currentIndex={vehicleData.currentIndex}
          totalPoints={vehicleData.totalPoints}
          distance={vehicleData.totalDistance}
          remainingDistance={vehicleData.remainingDistance}
        />
      )}
    </div>
  )
}
