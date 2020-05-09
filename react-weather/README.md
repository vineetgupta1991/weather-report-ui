# React-Weather

A simple React weather app that displays weather information from the weather-report API.


## Getting started

- Run the weather-report spring boot application locally. The project should start in http:localhost:8081/
- Run `npm install` then `npm start` command in your terminal.
- The project will start in http://localhost:3000 and UI page will pop-up.
- That's all!, now start typing the city, it will gives you the weather report as well as forecast.

## Assumptions

- The weather-api doesn't return you the world cities, instead it works only for Harku, Jõhvi, Tartu, Pärnu, Kuressaare and Türi for specific day and next day at the time of development of the project.
- The weather-report API shows you the forecast of next few days of a region as a whole irrespective of cities mentioned in first point.
- Currently, the search box only works when you type-in the exact region name. While typing, please make sure of some special alphabet chars, e.g the search works fine when you type-in Pärnu `ä` instead of Parnu.
- There are many kinds of weather, for the sake of this project, I assumed, rainy, cloudy and sunny. I haven't considered like stormed-clouds, extreme summer etc.

## .env.local

In this file, I configured the URL of weather-report api spring boot project. Whichever the port you are using to run spring boot project, please configure this file accordingly.

```sh
REACT_APP_API_URL = 'http://localhost:8081'
```

