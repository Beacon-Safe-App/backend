const mongoose = require("mongoose");

const CookieBlacklistSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const cookieBlacklist = mongoose.model(
  "cookieBlacklist",
  CookieBlacklistSchema
);
module.exports = cookieBlacklist;
