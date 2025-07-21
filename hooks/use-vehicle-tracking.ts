"use client"

import { useState, useEffect, useRef, useCallback } from "react"

interface RoutePoint {
  lat: number
  lng: number
  timestamp: number
}

interface VehicleData {
  currentPosition: [number, number] | null
  routePath: [number, number][]
  totalRoute: [number, number][]
  speed: number
  elapsedTime: number
  currentIndex: number
  totalPoints: number
  totalDistance: number
  remainingDistance: number
  reset: () => void
}

export function useVehicleTracking(isPlaying: boolean, playbackSpeed = 1, routeData: RoutePoint[]): VehicleData {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [routePath, setRoutePath] = useState<[number, number][]>([])
  const [speed, setSpeed] = useState(0)
  const [elapsedTime, setElapsedTime] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number>(Date.now())

  const totalRoute: [number, number][] = routeData.map((point) => [point.lat, point.lng])

  const calculateDistance = useCallback((lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371000 // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180
    const φ2 = (lat2 * Math.PI) / 180
    const Δφ = ((lat2 - lat1) * Math.PI) / 180
    const Δλ = ((lng2 - lng1) * Math.PI) / 180

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    return R * c
  }, [])

  const calculateTotalDistance = useCallback((): number => {
    let total = 0
    for (let i = 0; i < routeData.length - 1; i++) {
      const current = routeData[i]
      const next = routeData[i + 1]
      total += calculateDistance(current.lat, current.lng, next.lat, next.lng)
    }
    return total
  }, [routeData, calculateDistance])

  const calculateRemainingDistance = useCallback((): number => {
    let remaining = 0
    for (let i = currentIndex; i < routeData.length - 1; i++) {
      const current = routeData[i]
      const next = routeData[i + 1]
      remaining += calculateDistance(current.lat, current.lng, next.lat, next.lng)
    }
    return remaining
  }, [currentIndex, routeData, calculateDistance])

  const reset = useCallback(() => {
    setCurrentIndex(0)
    setRoutePath(routeData.length > 0 ? [[routeData[0].lat, routeData[0].lng]] : [])
    setSpeed(0)
    setElapsedTime(0)
    startTimeRef.current = Date.now()
  }, [routeData])

  // Reset when route data changes
  useEffect(() => {
    if (routeData.length > 0) {
      reset()
    } else {
      setCurrentIndex(0)
      setRoutePath([])
      setSpeed(0)
      setElapsedTime(0)
    }
  }, [routeData, reset])

  useEffect(() => {
    if (isPlaying && routeData.length > 0 && currentIndex < routeData.length - 1) {
      const interval = Math.max(100, 1000 / playbackSpeed)

      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => {
          if (prev >= routeData.length - 1) {
            return prev
          }

          const nextIndex = prev + 1
          const currentPoint = routeData[prev]
          const nextPoint = routeData[nextIndex]

          const newPath: [number, number] = [nextPoint.lat, nextPoint.lng]
          setRoutePath((prevPath) => {
            if (prevPath.some((point) => point[0] === newPath[0] && point[1] === newPath[1])) {
              return prevPath
            }
            return [...prevPath, newPath]
          })

          // Calculate speed based on timestamps and distance
          const timeDiff = (nextPoint.timestamp - currentPoint.timestamp) / 1000 // seconds
          const distance = calculateDistance(currentPoint.lat, currentPoint.lng, nextPoint.lat, nextPoint.lng)

          const calculatedSpeed = timeDiff > 0 ? (distance / timeDiff) * 3.6 : 0 // km/h
          setSpeed(calculatedSpeed * playbackSpeed)

          return nextIndex
        })

        setElapsedTime((Date.now() - startTimeRef.current) / 1000)
      }, interval)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isPlaying, currentIndex, playbackSpeed, routeData, calculateDistance])

  useEffect(() => {
    if (!isPlaying) {
      startTimeRef.current = Date.now() - elapsedTime * 1000
    } else {
      startTimeRef.current = Date.now() - elapsedTime * 1000
    }
  }, [isPlaying, elapsedTime])

  const currentPosition: [number, number] | null =
    currentIndex < routeData.length ? [routeData[currentIndex].lat, routeData[currentIndex].lng] : null

  return {
    currentPosition,
    routePath,
    totalRoute,
    speed,
    elapsedTime,
    currentIndex,
    totalPoints: routeData.length,
    totalDistance: calculateTotalDistance(),
    remainingDistance: calculateRemainingDistance(),
    reset,
  }
}
