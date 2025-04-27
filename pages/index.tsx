import React, { useEffect, useState } from "react";
import {
  MagnifyingGlassIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

interface Block {
  dt: number;
  main: { temp: number; humidity: number };
  weather: { description: string; icon: string }[];
  wind: { speed: number };
}

const API = process.env.NEXT_PUBLIC_OPENWEATHER_KEY!;

export default function Home() {
  const [city, setCity] = useState("Nairobi");
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");
  const [today, setToday] = useState<Block | null>(null);
  const [forecast, setForecast] = useState<Block[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const unitSymbol = unit === "metric" ? "C" : "F";

  const load = async (q: string) => {
    try {
      setLoading(true);
      setError(null);

      const tRes = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${q}&units=${unit}&appid=${API}`
      );
      if (!tRes.ok) throw new Error("City not found");
      const tJson = await tRes.json();
      setToday(tJson);

      const fcRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${q}&units=${unit}&appid=${API}`
      );
      const fcJson = await fcRes.json();
      // pick 24h/48h/72h slots
      setForecast([fcJson.list[8], fcJson.list[16], fcJson.list[24]]);

      setLoading(false);
    } catch (e: any) {
      setError(e.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    load(city);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unit]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-lg p-8 space-y-8">
        {/* Search bar (centered) */}
        <div className="flex justify-center gap-2">
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Search city…"
            className="flex-1 max-w-sm border rounded-lg px-4 py-2 focus:outline-none"
          />
          <button
            onClick={() => load(city)}
            className="bg-sky-500 hover:bg-sky-600 text-white rounded-lg px-4 flex items-center"
          >
            <MagnifyingGlassIcon className="h-5 w-5" />
          </button>
          <button
            onClick={() =>
              setUnit((u) => (u === "metric" ? "imperial" : "metric"))
            }
            className="border rounded-lg px-4"
          >
            {unit === "metric" ? "°C" : "°F"}
          </button>
        </div>

        {/* Loading / Error */}
        {loading && (
          <p className="flex items-center gap-2 justify-center text-slate-500">
            <ArrowPathIcon className="h-5 w-5 animate-spin" />
            Loading…
          </p>
        )}
        {error && (
          <p className="text-center text-red-600 font-medium">{error}</p>
        )}

        {/* Main two-column panel */}
        {today && !loading && (
          <>
            <div className="grid grid-cols-2 gap-6">
              {/* Left: Today */}
              <div className="flex flex-col items-center space-y-4">
                <img
                  src={`https://openweathermap.org/img/wn/${today.weather[0].icon}@4x.png`}
                  alt={today.weather[0].description}
                  className="h-28 w-28"
                />
                <p className="text-5xl font-extrabold">
                  {Math.round(today.main.temp)}°{unitSymbol}
                </p>
                <p className="capitalize text-slate-500">
                  {today.weather[0].description}
                </p>
                <p className="text-sm text-slate-400">
                  {new Date(today.dt * 1000).toLocaleDateString("en-KE", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  })}
                </p>
              </div>

              {/* Right: 3-day forecast */}
              <div className="flex items-center">
                <div className="grid grid-cols-3 gap-4 w-full">
                  {forecast.map((d, i) => (
                    <div
                      key={i}
                      className="rounded-xl bg-slate-100 py-4 flex flex-col items-center"
                    >
                      <p className="text-xs mb-1">
                        {new Date(d.dt * 1000).toLocaleDateString("en-KE", {
                          weekday: "short",
                          day: "numeric",
                        })}
                      </p>
                      <img
                        src={`https://openweathermap.org/img/wn/${d.weather[0].icon}@2x.png`}
                        alt={d.weather[0].description}
                        className="h-10 w-10"
                      />
                      <p className="mt-1 font-medium">
                        {Math.round(d.main.temp)}°
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Stats row: Wind & Humidity */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-100 rounded-xl p-4 text-center">
                <p className="text-xs text-slate-500 mb-1">Wind Status</p>
                <p className="text-2xl font-semibold">
                  {today.wind.speed}
                  <span className="text-sm"> m/s</span>
                </p>
              </div>
              <div className="bg-slate-100 rounded-xl p-4 text-center">
                <p className="text-xs text-slate-500 mb-1">Humidity</p>
                <p className="text-2xl font-semibold">
                  {today.main.humidity}
                  <span className="text-sm"> %</span>
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
