"use client"

import { useState, useEffect, useRef } from "react"
import axios from "axios"
import {
  Search,
  Cloud,
  CloudRain,
  Sun,
  CloudLightning,
  CloudSnow,
  Wind,
  Droplets,
  Thermometer,
  MapPin,
  Sunrise,
  Sunset,
  Eye,
  Gauge
} from "lucide-react"
import 'bootstrap/dist/css/bootstrap.min.css'

export default function App() {
  const [city, setCity] = useState("London")
  const [weatherData, setWeatherData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [bgClass, setBgClass] = useState("bg-default")
  const inputRef = useRef(null)
  const [lastUpdated, setLastUpdated] = useState("")
  const [activeTab, setActiveTab] = useState("current")

  const API_KEY = "G8KY82WCFLJFQRNU848RFGMN2"

  const getWeather = async () => {
    if (!city) return
    setIsLoading(true)
    setError("")
    try {
      const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?key=${API_KEY}&unitGroup=metric&include=current`
      const response = await axios.get(url)
      setWeatherData(response.data)
      setLastUpdated(new Date().toLocaleTimeString())
      updateBackground(response.data.currentConditions?.conditions)
    } catch {
      setWeatherData(null)
      setError("City not found or API error. Please try again.")
      setBgClass("bg-default")
    } finally {
      setIsLoading(false)
    }
  }

  const updateBackground = (conditions = "") => {
    const c = conditions.toLowerCase()
    if (c.includes("rain")) setBgClass("bg-rain")
    else if (c.includes("sun") || c.includes("clear")) setBgClass("bg-sunny")
    else if (c.includes("cloud")) setBgClass("bg-cloudy")
    else if (c.includes("lightning") || c.includes("thunder")) setBgClass("bg-storm")
    else if (c.includes("snow") || c.includes("ice")) setBgClass("bg-snow")
    else setBgClass("bg-default")
  }

  useEffect(() => {
    getWeather()
    inputRef.current?.focus()
  }, [])

  const handleKeyDown = (e) => {
    if (e.key === "Enter") getWeather()
  }

  const getIcon = (condition = "") => {
    const c = condition.toLowerCase()
    if (c.includes("rain")) return <CloudRain className="text-primary animate-bounce" />
    if (c.includes("cloud")) return <Cloud className="text-secondary" />
    if (c.includes("sun") || c.includes("clear")) return <Sun className="text-warning animate-spin-slow" />
    if (c.includes("lightning") || c.includes("thunder")) return <CloudLightning className="text-purple animate-pulse" />
    if (c.includes("snow") || c.includes("ice")) return <CloudSnow className="text-info animate-pulse" />
    return <Cloud className="text-muted" />
  }

  return (
    <div className={`weather-app ${bgClass} min-vh-100 py-5 transition-all`}>
      <div className="container">
        <div className="card mx-auto glass-effect" style={{maxWidth: '500px'}}>
          <div className="card-header bg-primary bg-opacity-75 text-white">
            <div className="d-flex justify-content-between align-items-center">
              <h1 className="h4 mb-0">Weather Forecast</h1>
              {lastUpdated && (
                <small className="text-white-50">Updated: {lastUpdated}</small>
              )}
            </div>
          </div>
          
          <div className="card-body">
            <div className="input-group mb-3">
              <span className="input-group-text">
                <MapPin size={16} />
              </span>
              <input
                ref={inputRef}
                className="form-control"
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter city name..."
              />
              <button
                onClick={getWeather}
                disabled={isLoading}
                className="btn btn-primary"
                title="Search weather"
              >
                {isLoading ? (
                  <div className="spinner-border spinner-border-sm text-light" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                ) : (
                  <Search size={16} />
                )}
              </button>
            </div>

            {error && (
              <div className="alert alert-danger animate-fade-in">
                {error}
              </div>
            )}

            {weatherData ? (
              <div className="animate-fade-in">
                <ul className="nav nav-tabs mb-3">
                  <li className="nav-item">
                    <button 
                      className={`nav-link ${activeTab === 'current' ? 'active' : ''}`}
                      onClick={() => setActiveTab('current')}
                    >
                      Current
                    </button>
                  </li>
                  <li className="nav-item">
                    <button 
                      className={`nav-link ${activeTab === 'forecast' ? 'active' : ''}`}
                      onClick={() => setActiveTab('forecast')}
                    >
                      5-Day Forecast
                    </button>
                  </li>
                  <li className="nav-item">
                    <button 
                      className={`nav-link ${activeTab === 'details' ? 'active' : ''}`}
                      onClick={() => setActiveTab('details')}
                    >
                      Details
                    </button>
                  </li>
                </ul>

                {activeTab === 'current' && (
                  <div>
                    <div className="text-center mb-4">
                      <h2 className="h5">
                        {weatherData.address}
                        <button 
                          className="btn btn-sm btn-outline-secondary ms-2"
                          onClick={() => navigator.clipboard.writeText(weatherData.address)}
                          title="Copy location"
                        >
                          📋
                        </button>
                      </h2>
                      <div className="my-3" style={{fontSize: '3rem'}}>
                        {getIcon(weatherData.currentConditions?.conditions)}
                      </div>
                      <p className="text-capitalize text-muted">
                        {weatherData.currentConditions?.conditions}
                      </p>
                      <p className="display-4 fw-bold">
                        {Math.round(weatherData.currentConditions?.temp)}°C
                      </p>
                      <p className="text-muted small">
                        Feels like {Math.round(weatherData.currentConditions?.feelslike)}°C
                      </p>
                    </div>

                    <div className="row g-2 mb-4">
                      <div className="col-md-6">
                        <div className="p-3 border rounded d-flex align-items-center hover-effect">
                          <Thermometer className="text-danger me-2" />
                          <div>
                            <small className="text-muted">High/Low</small>
                            <div>{Math.round(weatherData.days[0].tempmax)}°/{Math.round(weatherData.days[0].tempmin)}°</div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="p-3 border rounded d-flex align-items-center hover-effect">
                          <Droplets className="text-primary me-2" />
                          <div>
                            <small className="text-muted">Humidity</small>
                            <div>{weatherData.currentConditions?.humidity}%</div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="p-3 border rounded d-flex align-items-center hover-effect">
                          <Wind className="text-success me-2" />
                          <div>
                            <small className="text-muted">Wind</small>
                            <div>{weatherData.currentConditions?.windspeed} km/h</div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="p-3 border rounded d-flex align-items-center hover-effect">
                          <CloudRain className="text-info me-2" />
                          <div>
                            <small className="text-muted">Precipitation</small>
                            <div>{weatherData.days[0].precipprob || 0}%</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'forecast' && (
                  <div>
                    <h3 className="h6 text-muted text-uppercase mb-3">5-Day Forecast</h3>
                    <div className="row g-2 text-center">
                      {weatherData.days.slice(1, 6).map((day, idx) => (
                        <div key={idx} className="col">
                          <div className="p-2 border rounded hover-effect">
                            <p className="fw-bold mb-1">
                              {new Date(day.datetime).toLocaleDateString("en-US", { weekday: "short" })}
                            </p>
                            <div className="my-2" style={{fontSize: '1.5rem'}}>
                              {getIcon(day.conditions)}
                            </div>
                            <p className="fw-bold">{Math.round(day.tempmax)}°</p>
                            <p className="text-muted small">{Math.round(day.tempmin)}°</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'details' && (
                  <div>
                    <h3 className="h6 text-muted text-uppercase mb-3">Weather Details</h3>
                    <div className="row g-2">
                      <div className="col-md-6">
                        <div className="p-3 border rounded hover-effect">
                          <div className="d-flex align-items-center mb-2">
                            <Sunrise className="text-warning me-2" />
                            <span>Sunrise</span>
                          </div>
                          <div className="h5">
                            {weatherData.currentConditions?.sunrise}
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="p-3 border rounded hover-effect">
                          <div className="d-flex align-items-center mb-2">
                            <Sunset className="text-orange me-2" />
                            <span>Sunset</span>
                          </div>
                          <div className="h5">
                            {weatherData.currentConditions?.sunset}
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="p-3 border rounded hover-effect">
                          <div className="d-flex align-items-center mb-2">
                            <Eye className="text-info me-2" />
                            <span>Visibility</span>
                          </div>
                          <div className="h5">
                            {weatherData.currentConditions?.visibility} km
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="p-3 border rounded hover-effect">
                          <div className="d-flex align-items-center mb-2">
                            <Gauge className="text-secondary me-2" />
                            <span>Pressure</span>
                          </div>
                          <div className="h5">
                            {weatherData.currentConditions?.pressure} hPa
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-5 text-muted">
                <Cloud size={48} className="mb-3 animate-float" />
                <p>Search for a city to get the weather</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        .animate-spin-slow {
          animation: spin-slow 10s linear infinite;
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-in;
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .glass-effect {
          backdrop-filter: blur(10px);
          background-color: rgba(255, 255, 255, 0.8) !important;
        }
        .hover-effect {
          transition: all 0.3s ease;
        }
        .hover-effect:hover {
          transform: translateY(-3px);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }
        .bg-default {
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        }
        .bg-sunny {
          background: linear-gradient(135deg, #ffb347 0%, #ffcc33 100%);
        }
        .bg-rain {
          background: linear-gradient(135deg, #4b6cb7 0%, #182848 100%);
        }
        .bg-cloudy {
          background: linear-gradient(135deg, #bdc3c7 0%, #2c3e50 100%);
        }
        .bg-storm {
          background: linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%);
        }
        .bg-snow {
          background: linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%);
        }
        .transition-all {
          transition: background 1s ease;
        }
      `}</style>
    </div>
  )
}