const path = require("path");

exports.PREFIX = "/";

exports.BOT_EMOJI = "🤖";
exports.BOT_NAME = "Sky Bot";
exports.BOT_NUMBER = ""; 
exports.COMMAND_DIR = path.resolve(__dirname,"commands")

exports.TEMP_DIR  = path.resolve(__dirname, "..", "assets", "temp");
exports.TIMEOUT_IN_MILLISECONDS_BY_EVENT = 500;

exports.OPENAI_API_KEY = "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";
