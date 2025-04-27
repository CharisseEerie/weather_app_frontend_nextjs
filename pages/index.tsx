import React, { useEffect, useState } from "react";

interface WeatherApi {
  main: { temp: number; humidity: number };
  weather: { description: string }[];
  wind: { speed: number };
}

const Home = () => {
  const [weather, setWeather] = useState<WeatherApi | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/weather?city=Nairobi')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data: WeatherApi) => {
        setWeather(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Couldn’t load weather data");
        setLoading(false);
      });
  }, []);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-blue-50 p-8">
      <h1 className="text-3xl font-bold mb-4">Nairobi Weather</h1>

      {loading && <p>Loading…</p>}

      {error && <p className="text-red-600">{error}</p>}

      {weather && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p>
            <strong>Temperature:</strong> {weather.main.temp} °C
          </p>
          <p>
            <strong>Condition:</strong> {weather.weather[0].description}
          </p>
          <p>
            <strong>Humidity:</strong> {weather.main.humidity} %
          </p>
          <p>
            <strong>Wind:</strong> {weather.wind.speed} m/s
          </p>
        </div>
      )}
    </main>
  );
};

export default Home;
