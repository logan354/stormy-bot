<div align="center">
  <a href="https://github.com/logan354/stormy-bot">
    <img src="assets/Stormy Bot - Profile.jpg" alt="Logo" width="128" height="128">
  </a>
</div>

# Stormy Bot
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
Format: **name** &lt;required&gt; [optional]

#### Utility
- **ping**
- **help** [command]

#### Weather
- **forecast** &lt;location&gt; [period]
- **observation** &lt;location&gt;
- **radar** &lt;radar-location&gt;
- **severe-weather-outlook** [outlook-days]
- **thunderstorm-outlook** [outlook-days]
- **warnings**

## Setup
### Prerequisites
### Installation
## Contributing