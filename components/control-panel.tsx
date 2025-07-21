"use client"

import { Play, Pause, RotateCcw, Maximize, Minimize, MapPin, Clock, Gauge, Zap, Settings } from "lucide-react"

interface ControlPanelProps {
  isPlaying: boolean
  onTogglePlayPause: () => void
  onReset: () => void
  onToggleFullscreen: () => void
  onToggleRouteBuilder: () => void
  speed: number
  elapsedTime: number
  currentCoordinates: [number, number] | null
  playbackSpeed: number
  onPlaybackSpeedChange: (speed: number) => void
  isFullscreen: boolean
  showRouteBuilder: boolean
  hasRoute: boolean
}

export default function ControlPanel({
  isPlaying,
  onTogglePlayPause,
  onReset,
  onToggleFullscreen,
  onToggleRouteBuilder,
  speed,
  elapsedTime,
  currentCoordinates,
  playbackSpeed,
  onPlaybackSpeedChange,
  isFullscreen,
  showRouteBuilder,
  hasRoute,
}: ControlPanelProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const formatCoordinates = (coords: [number, number] | null) => {
    if (!coords) return "N/A"
    return `${coords[0].toFixed(6)}, ${coords[1].toFixed(6)}`
  }

  const speedOptions = [0.5, 1, 2, 4]

  return (
    <div className="absolute top-4 left-4 w-96 bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-200/50 p-6 z-[1000]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Vehicle Tracker</h2>
          <p className="text-sm text-gray-500">Custom route simulation</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={onToggleRouteBuilder}
            className={`flex items-center justify-center w-10 h-10 ${
              showRouteBuilder ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-600"
            } hover:bg-blue-600 hover:text-white rounded-xl transition-all duration-200`}
            aria-label="Toggle route builder"
          >
            <Settings size={18} />
          </button>
          <button
            onClick={onToggleFullscreen}
            className="flex items-center justify-center w-10 h-10 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl transition-all duration-200"
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
          </button>
        </div>
      </div>

      {/* Route Status */}
      {!hasRoute && (
        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-sm text-amber-800">
            <strong>No route created yet.</strong> Use the Route Builder to add waypoints and generate a road-following
            route.
          </p>
        </div>
      )}

      {/* Main Controls */}
      <div className="flex items-center justify-center space-x-4 mb-6">
        <button
          onClick={onReset}
          disabled={!hasRoute}
          className="flex items-center justify-center w-12 h-12 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 text-gray-600 rounded-xl transition-all duration-200 hover:scale-105"
          aria-label="Reset"
        >
          <RotateCcw size={20} />
        </button>

        <button
          onClick={onTogglePlayPause}
          disabled={!hasRoute}
          className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-400 text-white rounded-2xl transition-all duration-200 hover:scale-105 shadow-lg"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <Pause size={24} /> : <Play size={24} />}
        </button>

        <div className="flex flex-col items-center">
          <Zap size={16} className="text-gray-500 mb-1" />
          <select
            value={playbackSpeed}
            onChange={(e) => onPlaybackSpeedChange(Number(e.target.value))}
            disabled={!hasRoute}
            className="text-sm bg-gray-100 border-0 rounded-lg px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-50 disabled:text-gray-400"
          >
            {speedOptions.map((option) => (
              <option key={option} value={option}>
                {option}x
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 gap-4">
        <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
          <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-xl">
            <Gauge size={18} className="text-green-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600">Current Speed</p>
            <p className="text-lg font-bold text-gray-800">{speed.toFixed(1)} km/h</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl">
          <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-xl">
            <Clock size={18} className="text-blue-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600">Elapsed Time</p>
            <p className="text-lg font-bold text-gray-800">{formatTime(elapsedTime)}</p>
          </div>
        </div>

        <div className="flex items-start space-x-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
          <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-xl mt-1">
            <MapPin size={18} className="text-purple-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600">Current Position</p>
            <p className="text-sm font-mono text-gray-800 break-all leading-relaxed">
              {formatCoordinates(currentCoordinates)}
            </p>
          </div>
        </div>
      </div>

      {/* Status Indicator */}
      <div className="flex items-center justify-center mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${isPlaying ? "bg-green-500 animate-pulse" : "bg-gray-400"}`}></div>
          <span className="text-sm text-gray-600">
            {hasRoute ? (isPlaying ? "Tracking Active" : "Tracking Paused") : "No Route"}
          </span>
        </div>
      </div>
    </div>
  )
}
