#!/usr/bin/env python3
"""
Simple script to fetch current weather for Perth, Australia
using the OpenWeatherMap Current Weather Data API.

- Loads API key from the OPENWEATHER_API_KEY environment variable.
- Prints temperature in Celsius and weather conditions.
"""

import os
import sys
from typing import Tuple

import requests

API_URL = "https://api.openweathermap.org/data/2.5/weather"
CITY = "Perth,AU"


def get_api_key() -> str:
    """Load the API key from the environment or raise an error if missing."""
    key = os.getenv("OPENWEATHER_API_KEY")
    if not key:
        raise RuntimeError("Environment variable OPENWEATHER_API_KEY is not set")
    return key


def fetch_weather(api_key: str) -> dict:
    """Call the OpenWeatherMap API and return the parsed JSON response.

    Raises RuntimeError on network errors or non-OK responses.
    """
    params = {"q": CITY, "appid": api_key, "units": "metric"}
    try:
        response = requests.get(API_URL, params=params, timeout=10)
        response.raise_for_status()
    except requests.RequestException as exc:
        raise RuntimeError(f"Network/API request failed: {exc}") from exc

    try:
        return response.json()
    except ValueError as exc:
        raise RuntimeError(f"Failed to parse JSON response: {exc}") from exc


def parse_weather(data: dict) -> Tuple[float, str]:
    """Extract temperature and human-readable conditions from API data.

    Raises RuntimeError if expected fields are missing.
    """
    main = data.get("main")
    if not main or "temp" not in main:
        raise RuntimeError("API response missing temperature data")

    temp = main["temp"]

    weather = data.get("weather")
    if not weather or not isinstance(weather, list):
        raise RuntimeError("API response missing weather conditions")

    # Join multiple weather descriptions if present
    descriptions = [item.get("description", "") for item in weather]
    conditions = ", ".join(d for d in descriptions if d)

    return float(temp), conditions


def main() -> None:
    """Main entry point: load key, fetch weather, and print results."""
    try:
        api_key = get_api_key()
        data = fetch_weather(api_key)
        temp, conditions = parse_weather(data)
    except RuntimeError as err:
        print(f"Error: {err}", file=sys.stderr)
        sys.exit(1)

    # Clean, human-readable output
    print("Current weather in Perth, Australia:")
    print(f"- Temperature: {temp:.1f} °C")
    print(f"- Conditions: {conditions.capitalize() if conditions else 'Unknown'}")


if __name__ == "__main__":
    main()