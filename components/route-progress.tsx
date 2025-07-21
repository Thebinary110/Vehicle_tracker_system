"use client"

import { MapPin, Navigation, Route } from "lucide-react"

interface RouteProgressProps {
  currentIndex: number
  totalPoints: number
  distance: number
  remainingDistance: number
}

export default function RouteProgress({ currentIndex, totalPoints, distance, remainingDistance }: RouteProgressProps) {
  const progress = totalPoints > 0 ? (currentIndex / (totalPoints - 1)) * 100 : 0
  const completedDistance = distance - remainingDistance

  const formatDistance = (dist: number) => {
    if (dist < 1000) {
      return `${dist.toFixed(0)}m`
    }
    return `${(dist / 1000).toFixed(2)}km`
  }

  return (
    <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-200/50 p-4 z-[1000]">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <Route size={20} className="mr-2 text-blue-600" />
          Route Progress
        </h3>
        <span className="text-sm font-medium text-gray-600">{Math.round(progress)}%</span>
      </div>

      {/* Progress Bar */}
      <div className="relative mb-4">
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500 ease-out relative overflow-hidden"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
          </div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Start</span>
          <span>Destination</span>
        </div>
      </div>

      {/* Distance Info */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-center space-x-2 p-2 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
          <Navigation size={16} className="text-green-600" />
          <div>
            <p className="text-xs text-gray-600">Completed</p>
            <p className="text-sm font-semibold text-gray-800">{formatDistance(completedDistance)}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 p-2 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg">
          <MapPin size={16} className="text-orange-600" />
          <div>
            <p className="text-xs text-gray-600">Remaining</p>
            <p className="text-sm font-semibold text-gray-800">{formatDistance(remainingDistance)}</p>
          </div>
        </div>
      </div>

      {/* Waypoint Counter */}
      <div className="flex items-center justify-center mt-3 pt-3 border-t border-gray-200">
        <span className="text-sm text-gray-600">
          Point {currentIndex + 1} of {totalPoints}
        </span>
      </div>
    </div>
  )
}
