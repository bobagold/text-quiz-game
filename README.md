# text-quiz-game
Text quiz game - match words with their meaning or examples of usage

Designed to be data-agnostic

Example usage: `npm run example`

Advanced usage: `npm start -- ../messages.json ../game3.json`

Run a [telegram](https://github.com/telegraf/telegraf) bot: `BOT_TOKEN=xxx npm run tg-bot -- ../messages.json ../game3.json`

Tests: `npm test`

Format of game.json: `Array<Array<string, string>>`

Format of messages.json: `{positive: Array<string>, negative: Array<string>}`

![Console game screenshot](/docs/screenshot01.png?raw=true "Console game screenshot")

![Telegram bot screenshot](/docs/screenshot02.png?raw=true "Telegram bot screenshot")

## Links

* inspired by [nicksellen/german](https://github.com/nicksellen/german)
