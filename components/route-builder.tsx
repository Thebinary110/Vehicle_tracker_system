"use client"

import { useState } from "react"
import { Plus, Trash2, MapPin, Route, X, Navigation, AlertCircle, CheckCircle } from "lucide-react"

interface Waypoint {
  id: string
  lat: number
  lng: number
  name?: string
}

interface RouteBuilderProps {
  waypoints: Waypoint[]
  onAddWaypoint: (lat: number, lng: number) => void
  onRemoveWaypoint: (id: string) => void
  onUpdateWaypoint: (id: string, lat: number, lng: number) => void
  onGenerateRoute: () => void
  onClearRoute: () => void
  isGenerating: boolean
  routeError: string | null
  onClose: () => void
  hasRoute: boolean
}

export default function RouteBuilder({
  waypoints,
  onAddWaypoint,
  onRemoveWaypoint,
  onUpdateWaypoint,
  onGenerateRoute,
  onClearRoute,
  isGenerating,
  routeError,
  onClose,
  hasRoute,
}: RouteBuilderProps) {
  const [newLat, setNewLat] = useState("")
  const [newLng, setNewLng] = useState("")

  const handleAddWaypoint = () => {
    const lat = Number.parseFloat(newLat)
    const lng = Number.parseFloat(newLng)

    if (isNaN(lat) || isNaN(lng)) {
      alert("Please enter valid coordinates")
      return
    }

    if (lat < -90 || lat > 90) {
      alert("Latitude must be between -90 and 90")
      return
    }

    if (lng < -180 || lng > 180) {
      alert("Longitude must be between -180 and 180")
      return
    }

    onAddWaypoint(lat, lng)
    setNewLat("")
    setNewLng("")
  }

  const handleUpdateWaypoint = (id: string, field: "lat" | "lng", value: string) => {
    const numValue = Number.parseFloat(value)
    if (isNaN(numValue)) return

    const waypoint = waypoints.find((w) => w.id === id)
    if (!waypoint) return

    if (field === "lat") {
      onUpdateWaypoint(id, numValue, waypoint.lng)
    } else {
      onUpdateWaypoint(id, waypoint.lat, numValue)
    }
  }

  return (
    <div className="absolute top-4 right-4 w-80 bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-200/50 p-6 z-[1001] max-h-[calc(100vh-2rem)] overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Route size={20} className="mr-2 text-blue-600" />
          <h3 className="text-lg font-bold text-gray-800">Route Builder</h3>
        </div>
        <button
          onClick={onClose}
          className="flex items-center justify-center w-8 h-8 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      {/* Instructions */}
      <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-800">
          <strong>How to use:</strong>
          <br />
          1. Add waypoints by entering coordinates or clicking on the map
          <br />
          2. Click "Generate Route" to create a road-following path
          <br />
          3. Use play controls to start vehicle simulation
        </p>
      </div>

      {/* Add Waypoint Form */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Add Waypoint</h4>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              placeholder="Latitude"
              value={newLat}
              onChange={(e) => setNewLat(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              step="any"
            />
            <input
              type="number"
              placeholder="Longitude"
              value={newLng}
              onChange={(e) => setNewLng(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              step="any"
            />
          </div>
          <button
            onClick={handleAddWaypoint}
            className="w-full flex items-center justify-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            <Plus size={16} className="mr-2" />
            Add Waypoint
          </button>
        </div>
      </div>

      {/* Waypoints List */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Waypoints ({waypoints.length})</h4>
        {waypoints.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <MapPin size={32} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">No waypoints added yet</p>
            <p className="text-xs">Click on the map or enter coordinates above</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {waypoints.map((waypoint, index) => (
              <div key={waypoint.id} className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-center w-6 h-6 bg-blue-500 text-white rounded-full text-xs font-bold">
                  {index + 1}
                </div>
                <div className="flex-1 grid grid-cols-2 gap-1">
                  <input
                    type="number"
                    value={waypoint.lat.toFixed(6)}
                    onChange={(e) => handleUpdateWaypoint(waypoint.id, "lat", e.target.value)}
                    className="px-2 py-1 border border-gray-300 rounded text-xs"
                    step="any"
                  />
                  <input
                    type="number"
                    value={waypoint.lng.toFixed(6)}
                    onChange={(e) => handleUpdateWaypoint(waypoint.id, "lng", e.target.value)}
                    className="px-2 py-1 border border-gray-300 rounded text-xs"
                    step="any"
                  />
                </div>
                <button
                  onClick={() => onRemoveWaypoint(waypoint.id)}
                  className="flex items-center justify-center w-6 h-6 bg-red-100 hover:bg-red-200 text-red-600 rounded transition-colors"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Route Actions */}
      <div className="space-y-3">
        <button
          onClick={onGenerateRoute}
          disabled={waypoints.length < 2 || isGenerating}
          className="w-full flex items-center justify-center px-4 py-3 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium"
        >
          {isGenerating ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
              Generating Route...
            </>
          ) : (
            <>
              <Navigation size={16} className="mr-2" />
              Generate Route ({waypoints.length >= 2 ? "Ready" : `Need ${2 - waypoints.length} more`})
            </>
          )}
        </button>

        {hasRoute && (
          <button
            onClick={onClearRoute}
            className="w-full flex items-center justify-center px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
          >
            <Trash2 size={16} className="mr-2" />
            Clear Route
          </button>
        )}
      </div>

      {/* Status Messages */}
      {routeError && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <AlertCircle size={16} className="text-red-600 mr-2" />
            <p className="text-sm text-red-800">{routeError}</p>
          </div>
        </div>
      )}

      {hasRoute && !routeError && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <CheckCircle size={16} className="text-green-600 mr-2" />
            <p className="text-sm text-green-800">Route generated successfully! You can now start the simulation.</p>
          </div>
        </div>
      )}

      {/* Sample Coordinates */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <h5 className="text-xs font-semibold text-gray-600 mb-2">Sample Coordinates (Hyderabad)</h5>
        <div className="text-xs text-gray-600 space-y-1">
          <div>Start: 17.385044, 78.486671</div>
          <div>End: 17.385265, 78.486895</div>
        </div>
      </div>
    </div>
  )
}
