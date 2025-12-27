<div align="center">
    <img src="assets/stormy_bot.jpg" alt="Logo" width="128" height="128">
</div>

# Stormy bot
A MetService bot for Discord. Forecasts, warnings & watches, and much more.

### Features
- MetService Public API
- MetService CAP RSS
- discord.js v14

## Setup
### Prerequisites
- Node.js 22.12.0

### Installation
1. Create Discord App
2. Configuration Files<br>
    Complete the following files: (remove ".example")
    - .env
    - config.json

3. Install NPM Packages
    ```sh
    npm install
    ```

## Usage
1. Build
    ```sh
    npm run build
    ```

2. Run
    ```sh
    npm run start
    ```

### Command Guide
*Format: **name** `<required>` `[optional]`*

- **forecast** `<location>` `[period]`
- **help**
- **observation** `<location>`
- **ping**
- **rain-radar** `<radar-location>`
- **severe-weather-outlook** `[days]`
- **thunderstorm-outlook** `[days]`
- **warnings**