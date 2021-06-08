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
const package = require("./package.json");

const port = process.env.port || process.env.PORT || 5000;
const apiRoot = "/api";

const app = express();

// configure app
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// Enable to access from different domain. Enable to communicate between different hosting envs.
app.use(cors({ origin: /http:\/\/localhost/ }));
app.options("*", cors());

// sample database
const db = {
	christopher: {
		user: "christopher",
		currency: "USD",
		balance: 100,
		description: "A sample account",
		transaction: [],
	},
};

// configure routes
// GET
const router = express.Router();
router.get("/", (req, res) => {
	res.send(`${package.description} - v${package.version}`);
});

router.get("/accounts/:user", (req, res) => {
	const user = req.params.user;
	const account = db[user];

	if (!account) {
		return res.status(404).json({ error: "User does not exist" });
	}
	// default status code is 200
	return res.json(account);
});

// POST
router.post("/accounts", (req, res) => {
	// Normally at first, parse request object including json payload sent from client. But it's done by body-parser in above.
	const body = req.body;

	// validate required values
	if (!body.user || !body.currency) {
		return res.status(400).json({ error: "user and currency are required" });
	}

	// check account doesn't exits
	if (db[body.user]) {
		return res.status(400).json({ error: "Account already exists" });
	}

	// balance
	let balance = body.balance;
	if (balance && typeof balance !== "number") {
		balance = parseFloat(balance);
		if (isNaN(balance)) {
			return res.status(400).json({ error: "balance must be a number" });
		}
	}

	// now we can create the account!
	const account = {
		user: body.user,
		currency: body.currency,
		description: body.description || `${body.user}'s account`,
		balance: balance || 0,
		transaction: [],
	};
	db[account.user] = account;

	// return the account
	return res.status(201).json(account);
});

// PUT
// put() get data from body and URL
router.put("/accounts/:user", (req, res) => {
	const body = req.body;
	const user = req.params.user;
	const account = db[user];

	if (!account) {
		return res.json(404).json({ error: "User not found" });
	}

	// validate only certain items editable
	if (body.user || body.balance || body.transaction) {
		return res.status(400).json({ error: "Can only edit currency and description" });
	}

	// update as necessary
	if (body.description) {
		account.description = body.description;
	}
	if (body.currency) {
		account.currency = body.currency;
	}

	// success code
	return res.status(201).json(account);
});

// DELETE
router.delete("/accounts/:user", (req, res) => {
	const user = req.params.user;
	const account = db[user];

	if (!account) {
		return res.status(404).json({ error: "User not found" });
	}

	// In this app, use in-memory object for storing. So to delete it, use delete statement.
	delete db[user];

	// 204 means No content
	return res.status(204);
});

// register all our routes
app.use(apiRoot, router);

app.listen(port, () => {
	console.log("server up!!");
});
