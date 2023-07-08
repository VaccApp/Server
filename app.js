// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv").config();

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

const { isAuthenticated } = require("./middleware/jwt.middleware");

const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);

// 👇 Start handling routes here
const indexRoutes = require("./routes/index.routes");
app.use("/api", indexRoutes);

const familyRoutes = require("./routes/family.routes");
app.use("/family", isAuthenticated, familyRoutes);

const childRoutes = require("./routes/child.routes");
app.use("/child", isAuthenticated, childRoutes);

const vaccineRoutes = require("./routes/vaccine.routes");
app.use("/vaccines", isAuthenticated, vaccineRoutes);

const authRoutes = require("./routes/auth.routes");
app.use("/auth", authRoutes);

const centersRoutes = require("./routes/centers.routes");
app.use("/centers", isAuthenticated, centersRoutes);

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
