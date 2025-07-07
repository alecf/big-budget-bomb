"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

// Custom hook for session storage
function useSessionStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }
    try {
      const item = window.sessionStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  const setValue = useCallback((value: T) => {
    try {
      setStoredValue(value);
      if (typeof window !== "undefined") {
        window.sessionStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      console.log(error);
    }
  }, [key]);

  return [storedValue, setValue];
}

// Free geocoding service using OpenStreetMap Nominatim
const geocodeZipCode = async (zipCode: string): Promise<{latitude: number, longitude: number} | null> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&countrycodes=us&postalcode=${zipCode}&limit=1`
    );
    const data = await response.json();
    
    if (data && data.length > 0) {
      return {
        latitude: parseFloat(data[0].lat),
        longitude: parseFloat(data[0].lon)
      };
    }
    return null;
  } catch (error) {
    console.error("Geocoding error:", error);
    return null;
  }
};

export default function SnapMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const marker = useRef<maplibregl.Marker | null>(null);
  
  // Use session storage for persisting form data
  const [zipCode, setZipCode] = useSessionStorage<string>("snap-zip-code", "");
  const [taxSavings, setTaxSavings] = useSessionStorage<string>("snap-tax-savings", "");
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mapReady, setMapReady] = useState(false);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: "https://demotiles.maplibre.org/style.json", // Free MapLibre style
      center: [-95.7129, 37.0902], // Center of US
      zoom: 4,
    });

    map.current.addControl(new maplibregl.NavigationControl(), "top-right");

    map.current.on("load", () => {
      setMapReady(true);
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Handle zip code lookup
  const handleZipCodeLookup = useCallback(async () => {
    if (!zipCode || !map.current) return;

    setIsLoading(true);
    setError(null);

    try {
      const coordinates = await geocodeZipCode(zipCode);
      
      if (coordinates) {
        // Center map on coordinates
        map.current.flyTo({
          center: [coordinates.longitude, coordinates.latitude],
          zoom: 12,
          duration: 2000,
        });

        // Remove existing marker
        if (marker.current) {
          marker.current.remove();
        }

        // Add new marker
        marker.current = new maplibregl.Marker({
          color: "#ef4444", // Red color to match theme
        })
          .setLngLat([coordinates.longitude, coordinates.latitude])
          .addTo(map.current);

        // Add popup with zip code info
        new maplibregl.Popup({
          offset: 25,
          closeButton: false,
          closeOnClick: false,
        })
          .setLngLat([coordinates.longitude, coordinates.latitude])
          .setHTML(`
            <div class="text-sm">
              <strong>ZIP Code: ${zipCode}</strong><br>
              <span class="text-gray-600">SNAP impact analysis will be shown here</span>
            </div>
          `)
          .addTo(map.current);
      } else {
        setError("Could not find coordinates for this ZIP code. Please check the ZIP code and try again.");
      }
    } catch (err) {
      setError("An error occurred while looking up the ZIP code. Please try again.");
      console.error("Geocoding error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [zipCode]);

  // Auto-lookup if we have persisted data
  useEffect(() => {
    if (zipCode && mapReady && !marker.current) {
      handleZipCodeLookup();
    }
  }, [zipCode, mapReady, handleZipCodeLookup]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    handleZipCodeLookup();
  }, [handleZipCodeLookup]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
              SNAP Impact Map
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
            See how tax policy changes affect SNAP recipients in your area
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Form */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Your Information</CardTitle>
              <CardDescription>
                Enter your ZIP code and tax savings to see the impact on SNAP recipients in your area
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="zip-code">ZIP Code</Label>
                  <Input
                    id="zip-code"
                    type="text"
                    placeholder="e.g., 90210"
                    value={zipCode}
                    onChange={(e) => {
                      setZipCode(e.target.value);
                      setError(null);
                    }}
                    maxLength={5}
                    pattern="[0-9]{5}"
                    title="Please enter a 5-digit ZIP code"
                  />
                </div>

                <div>
                  <Label htmlFor="tax-savings">Tax Savings</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                      $
                    </span>
                    <Input
                      id="tax-savings"
                      type="number"
                      placeholder="e.g., 2500"
                      value={taxSavings}
                      className="pl-8"
                      onChange={(e) => setTaxSavings(e.target.value)}
                      min="0"
                      step="100"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Tax savings from SALT deduction changes (calculated from /salt page)
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={!zipCode || isLoading}
                >
                  {isLoading ? "Looking up ZIP code..." : "Show Impact on Map"}
                </Button>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}
              </form>

              {/* Future features preview */}
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
                <h3 className="font-semibold text-sm mb-2">Coming Soon:</h3>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• SNAP recipient counts by ZIP code</li>
                  <li>• Surrounding ZIP codes analysis</li>
                  <li>• Impact calculations based on tax savings</li>
                  <li>• ZIP code boundary visualization</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Map */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>ZIP Code Impact Map</CardTitle>
              <CardDescription>
                Interactive map showing SNAP recipients in your area
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div
                ref={mapContainer}
                className="w-full h-96 lg:h-[600px] rounded-b-lg"
                style={{ minHeight: "400px" }}
              />
            </CardContent>
          </Card>
        </div>

        {/* Results Summary */}
        {zipCode && taxSavings && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Impact Summary</CardTitle>
              <CardDescription>
                Analysis of how your tax savings affect SNAP recipients
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <p className="text-sm font-medium">
                  <strong>ZIP Code:</strong> {zipCode}
                </p>
                <p className="text-sm font-medium">
                  <strong>Tax Savings:</strong> ${parseInt(taxSavings).toLocaleString()}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  Detailed SNAP impact analysis will be available once we integrate recipient data and neighboring ZIP code calculations.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <div className="mt-8 text-center text-gray-400 text-sm">
          <p>
            Map data © OpenStreetMap contributors. This site stores no data about you and doesn&apos;t track you in any way.
          </p>
        </div>
      </div>
    </div>
  );
}