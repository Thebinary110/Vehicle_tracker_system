"use client"

import { useState, useCallback } from "react"

interface Waypoint {
  id: string
  lat: number
  lng: number
  name?: string
}

interface RoutePoint {
  lat: number
  lng: number
  timestamp: number
}

export function useRouteBuilder() {
  const [waypoints, setWaypoints] = useState<Waypoint[]>([])
  const [roadRoute, setRoadRoute] = useState<RoutePoint[]>([])
  const [isGeneratingRoute, setIsGeneratingRoute] = useState(false)
  const [routeError, setRouteError] = useState<string | null>(null)

  const addWaypoint = useCallback(
    (lat: number, lng: number) => {
      const newWaypoint: Waypoint = {
        id: `waypoint-${Date.now()}-${Math.random()}`,
        lat,
        lng,
        name: `Waypoint ${waypoints.length + 1}`,
      }
      setWaypoints((prev) => [...prev, newWaypoint])
    },
    [waypoints.length],
  )

  const removeWaypoint = useCallback((id: string) => {
    setWaypoints((prev) => prev.filter((w) => w.id !== id))
  }, [])

  const updateWaypoint = useCallback((id: string, lat: number, lng: number) => {
    setWaypoints((prev) => prev.map((w) => (w.id === id ? { ...w, lat, lng } : w)))
  }, [])

  const generateRoute = useCallback(async () => {
    if (waypoints.length < 2) {
      setRouteError("At least 2 waypoints are required to generate a route")
      return
    }

    setIsGeneratingRoute(true)
    setRouteError(null)

    try {
      // Create coordinates string for OSRM API
      const coordinates = waypoints.map((w) => `${w.lng},${w.lat}`).join(";")

      // Use OSRM demo server for routing
      const response = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${coordinates}?overview=full&geometries=geojson&steps=true`,
      )

      if (!response.ok) {
        throw new Error(`Routing service error: ${response.status}`)
      }

      const data = await response.json()

      if (data.code !== "Ok" || !data.routes || data.routes.length === 0) {
        throw new Error("No route found between the waypoints")
      }

      const route = data.routes[0]
      const geometry = route.geometry.coordinates

      // Convert route coordinates to RoutePoint format with timestamps
      const routePoints: RoutePoint[] = geometry.map((coord: [number, number], index: number) => ({
        lat: coord[1], // GeoJSON uses [lng, lat] format
        lng: coord[0],
        timestamp: Date.now() + index * 5000, // 5 second intervals
      }))

      setRoadRoute(routePoints)
      setRouteError(null)
    } catch (error) {
      console.error("Route generation error:", error)
      setRouteError(
        error instanceof Error ? error.message : "Failed to generate route. Please check your waypoints and try again.",
      )

      // Fallback: create a simple straight-line route
      const fallbackRoute: RoutePoint[] = waypoints.map((waypoint, index) => ({
        lat: waypoint.lat,
        lng: waypoint.lng,
        timestamp: Date.now() + index * 10000, // 10 second intervals
      }))

      setRoadRoute(fallbackRoute)
    } finally {
      setIsGeneratingRoute(false)
    }
  }, [waypoints])

  const clearRoute = useCallback(() => {
    setWaypoints([])
    setRoadRoute([])
    setRouteError(null)
  }, [])

  return {
    waypoints,
    roadRoute,
    isGeneratingRoute,
    routeError,
    addWaypoint,
    removeWaypoint,
    updateWaypoint,
    generateRoute,
    clearRoute,
  }
}
