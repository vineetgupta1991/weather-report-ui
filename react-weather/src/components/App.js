import React, { useEffect, useState } from "react";
import ignoreCase from "ignore-case";

import { Container } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";

import Weather from "./Weather";

export default function App() {
  const [city, setCity] = useState("Harku");
  const [error, setError] = useState(null);
  const [currentWeather, setCurrentWeather] = useState({});
  const [forecast, setForecast] = useState([]);

  useEffect(() => {
    getForecast(city)
      .then((data) => {
        setCurrentWeather(data[0]);
        setForecast(data);
        setError(null);
      })
      .catch((err) => {
        setError(err.message);
      });
  }, [city, error]);

  const handleCityChange = (city) => {
    setCity(city);
  };

  if (
    (currentWeather && Object.keys(currentWeather).length) ||
    (forecast && Object.keys(forecast).length)
  ) {
    return (
      <Container maxWidth="sm">
        <Weather
          city={city}
          currentWeather={currentWeather}
          forecast={forecast}
          onCityChange={handleCityChange}
          error={error}
        />
      </Container>
    );
  } else {
    return (
      <div>
        <CircularProgress color={error ? "secondary" : "primary"} />
        {error ? <p>{error}</p> : ""}
      </div>
    );
  }
}

function handleResponse(response) {
  if (response.ok) {
    return response.json();
  } else {
    throw new Error("Error: Location " + response.statusText);
  }
}

const getForecast = (city) => {
  return fetch(`${process.env.REACT_APP_API_URL}/v1/weather/report`, {
    crossDomain: true,
    method: "GET",
    mode: "cors",
    headers: {
      language: "eng",
    },
  })
    .then((response) => handleResponse(response))
    .then((response) => {
      if (Object.entries(response).length) {
        const forecast = [];
        const dates = [];
        response.forEach((res) => dates.push(new Date(res.date)));
        const minDate = new Date(Math.min.apply(null, dates));
        isCityValid(response, minDate, city);
        response.forEach((weather) =>
          forecast.push(mapDataToWeatherInterface(weather, city))
        );
        return forecast;
      }
    });
};

const isCityValid = (response, minDate, city) => {
  const weather = response.filter(
    (res) => new Date(res.date).getTime() === minDate.getTime()
  )[0];
  if (weather.places.filter((place) => ignoreCase.equals(place.name, city)).length === 0) {
    throw new Error("Error: Location not found ", city);
  }
};

function mapDataToWeatherInterface(data, city) {
  const temperatureData = data.places
    ? data.places.filter((place) => ignoreCase.equals(place.name, city))[0]
    : null;
  const windData = data.wind;
  const mapped = {
    city: city.charAt(0).toUpperCase() + city.slice(1),
    date: data.date,
    temperature: temperatureData
      ? temperatureData.temperature
      : data.minTemperature,
    description: temperatureData ? temperatureData.phenomenon : data.phenomenon,
    wind_speed: windData
      ? Math.max.apply(
          null,
          windData.map((w) => w.speedMax)
        )
      : null,
    icon_id: data.phenomenon.includes("cloud")
      ? 801
      : data.phenomenon.includes("shower")
      ? 313
      : 800,
    icon: data.phenomenon.includes("cloud")
      ? 801
      : data.phenomenon.includes("shower")
      ? 313
      : 800,
  };

  if (temperatureData) {
    mapped.icon_id = temperatureData.phenomenon.includes("cloud")
      ? 801
      : temperatureData.phenomenon.includes("shower")
      ? 313
      : 800;
    mapped.icon = temperatureData.phenomenon.includes("cloud")
      ? 801
      : temperatureData.phenomenon.includes("shower")
      ? 313
      : 800;
  }

    mapped.min = data.minTemperature;
    mapped.max = data.maxTemperature;
  

  return mapped;
}
