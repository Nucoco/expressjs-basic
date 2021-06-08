/**
 * 0. The app created here is almost void application. This means , in the future in actual dev, we use generator to write this code.
 * 1. express: WebFramework of Node.js. Rapidly create a RESTful API endpoint or server side web app.
 * 2. body-parser: Parses the body of a http request.
 * 3. cors: Controls request restriction.
 * 4. nodemon: Provides hot reloading
 */
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const port = process.env.port || process.env.PORT || 5000;

const app = express();
// configure app
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// Enable to access from different domain. Enable to communicate between different hosting envs.
app.use(cors({ origin: /http:\/\/localhost/ }));
app.options("*", cors());

// configure routes
const router = express.Router();
router.get("/", (req, res) => {
	res.send(`${package.description} - v${package.version}`);
});

// register all our routes
app.use(apiRoot, router);

app.listen(port, () => {
	console.log("server up!!");
});
