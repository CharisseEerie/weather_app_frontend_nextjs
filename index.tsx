import { useEffect, useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  const [city, setCity] = useState("Nairobi");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchWeather = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8000/api/weather?city=${city}`);
      const data = await res.json();
      setWeather(data);
    } catch (error) {
      console.error("Failed to fetch weather:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  return (
    <main className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Weather App</h1>
      <div className="flex space-x-2 mb-4">
        <Input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Enter city name" />
        <Button onClick={fetchWeather}>Get Weather</Button>
      </div>
      <Card>
        <CardContent>
          {loading ? (
            <p>Loading...</p>
          ) : weather ? (
            <div>
              <h2 className="text-xl font-semibold">{weather.name}</h2>
              <p>Temperature: {weather.main.temp}°C</p>
              <p>Condition: {weather.weather[0].description}</p>
              <p>Humidity: {weather.main.humidity}%</p>
              <p>Wind Speed: {weather.wind.speed} m/s</p>
            </div>
          ) : (
            <p>No weather data.</p>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
