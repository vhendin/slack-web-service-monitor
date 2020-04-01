# Slack web service monitor
A small node based application that takes a number of web services and pings them, sending their response codes to a configured Slack channel.

## Setup
You can use a .env file to set your environment variables. These are:
- URLS: A comma separated string of web services to ping.
  - Eg. `https://www.google.com,https://www.github.com`
- SLACK_WEBHOOK: The web hook url that the app should post to.
  - Eg. `https://hooks.slack.com/services/1A2B3C/123ABC/ABC123`
- INTERVAL: Milliseconds between pings.
  - Eg. `1000` for every second, `60000` for every minute etc.