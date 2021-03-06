require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');
mongoose.Promise = global.Promise;
const app = express();

app.use(morgan('common'));
app.use(express.json());

const {
	router: usersRouter
} = require('./users');
const {
	router: authRouter,
	localStrategy,
	jwtStrategy
} = require('./auth');

const {
	DATABASE_URL,
	PORT
} = require('./config');

const {
	Recipe,
	ShoppingList,
	Meals
} = require('./models');

app.use(express.static('public'));

passport.use(localStrategy);
passport.use(jwtStrategy);

app.use('/api/users/', usersRouter);
app.use('/api/auth/', authRouter);

const jwtAuth = passport.authenticate('jwt', {
	session: false
});

// CORS
app.use(function (req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
	res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
	if (req.method === 'OPTIONS') {
		return res.send(204);
	}
	next();
});

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/public/home.html');
});
app.get('/userLogin', (req, res) => {
	res.sendFile(__dirname + '/public/welcome.html');
});

//GET Authentication
app.get('/api/protected', jwtAuth, (req, res) => {
	return res.json({
		data: 'rosebud'
	});
});


// GET ,Recipes
app.get('/recipes', jwtAuth, (req, res) => {
	Recipe.find({
			username: req.query.username
		})
		.then(recipes => {
			res.json({
				recipes: recipes.map(recipe => recipe.serialize())
			});
		})
		.catch(err => {
			console.error(err);
			res.status(500).json({
				error: 'WHAT DID YOU DO?!'
			});
		});
});

// GET Recipes by ID
app.get('/recipes/:id', jwtAuth, (req, res) => {
	Recipe.findById(req.params.id)
		.then(recipe => res.json(recipe.serialize()))
		.catch(err => {
			console.error(err);
			res.status(500).json({
				error: 'WHAT DID YOU DO?!'
			});
		});
});

// POST Recipes
app.post('/recipes', jwtAuth, (req, res) => {
	const requiredFields = ['recipeName', 'ingredients', 'instructions', 'username'];
	for (let i = 0; i < requiredFields.length; i++) {
		const field = requiredFields[i];
		if (!(field in req.body)) {
			const message = `Missing \`${field}\` in request body`;
			console.error(message);
			return res.status(400).send(message);
		}
	}

	Recipe.create({
			recipeName: req.body.recipeName,
			ingredients: req.body.ingredients,
			instructions: req.body.instructions,
			username: req.body.username
		})
		.then(recipe => res.status(201).json(recipe.serialize()))
		.catch(err => {
			console.error(err);
			res.status(500).json({
				error: 'WHAT DID YOU DO?!'
			});
		});
});

// DELETE Recipe
app.delete('/recipes/:id', jwtAuth, (req, res) => {
	Recipe.findByIdAndRemove(req.params.id).then(() => {
		console.log(`Deleted Recipe with id \`${req.params.id}\``);
		res.status(204).end();
	});
});

// PUT update recipe
app.put('/recipes/:id', jwtAuth, (req, res) => {
	if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
		res.status(400).json({
			error: 'Request path id and request body id values must match'
		});
	}

	const updated = {};
	const updateableFields = ['recipeName', 'ingredients', 'instructions'];
	updateableFields.forEach(field => {
		if (field in req.body) {
			updated[field] = req.body[field];
		}
	});

	Recipe.findByIdAndUpdate(
			req.params.id, {
				$set: updated
			}, {
				new: true
			}
		)
		.then(updatedRecipe => res.status(204).end())
		.catch(err =>
			res.status(500).json({
				message: 'WHAT DID YOU DO?!'
			})
		);
});

// GET Shopping-list
app.get('/Shopping-List', jwtAuth, (req, res) => {
	ShoppingList.find({
			username: req.query.username
		})
		.then(listItems => {
			res.json({
				listItems: listItems.map(listItem => listItem.serialize())
			});
		})
		.catch(err => {
			console.error(err);
			res.status(500).json({
				error: 'WHAT DID YOU DO?!'
			});
		});
});

//GET shopping-list item
app.get('/Shopping-List/:id', jwtAuth, (req, res) => {
	ShoppingList.findById(req.params.id)
		.then(listItem => res.json(listItem.serialize()))
		.catch(err => {
			console.error(err);
			res.status(500).json({
				error: 'WHAT DID YOU DO?!'
			});
		});
});

// POST New Shopping-list item
app.post('/Shopping-List', jwtAuth, (req, res) => {
	const requiredFields = ['ingredient', 'username'];
	for (let i = 0; i < requiredFields.length; i++) {
		const field = requiredFields[i];
		if (!(field in req.body)) {
			const message = `Missing \`${field}\` in request body`;
			console.error(message);
			return res.status(400).send(message);
		}
	}

	ShoppingList.create({
			ingredient: req.body.ingredient,
			amount: req.body.amount,
			username: req.body.username
		})
		.then(listItem => res.status(201).json(listItem.serialize()))
		.catch(err => {
			console.error(err);
			res.status(500).json({
				error: 'WHAT DID YOU DO?!'
			});
		});
});

//DELETE Shopping-list item
app.delete('/Shopping-List/:id', jwtAuth, (req, res) => {
	ShoppingList.findByIdAndRemove(req.params.id).then(() => {
		console.log(`Deleted List Item with id \`${req.params.id}\``);
		res.status(204).end();
	});
});

//PUT update shopping-list item
app.put('/Shopping-List/:id', jwtAuth, (req, res) => {
	if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
		res.status(400).json({
			error: 'Request path id and request body id values must match'
		});
	}

	const updated = {};
	const updateableFields = ['ingredient', 'amount', 'checked'];
	updateableFields.forEach(field => {
		if (field in req.body) {
			updated[field] = req.body[field];
		}
	});

	ShoppingList.findByIdAndUpdate(
			req.params.id, {
				$set: updated
			}, {
				new: true
			}
		)
		.then(updatedListItem => res.status(204).end())
		.catch(err =>
			res.status(500).json({
				message: 'WHAT DID YOU DO?!'
			})
		);
});

// GET ,Meals
app.get('/Meals', jwtAuth, (req, res) => {
	Meals.find({
			username: req.query.username
		})
		.then(meals => {
			res.json({
				meals: meals.map(meal => meal.serialize())
			});
		})
		.catch(err => {
			console.error(err);
			res.status(500).json({
				error: 'WHAT DID YOU DO?!'
			});
		});
});

// DELETE Meal
app.delete('/Meals/:id', jwtAuth, (req, res) => {
	Meals.findByIdAndRemove(req.params.id).then(() => {
		console.log(`Deleted Meal with id \`${req.params.id}\``);
		res.status(204).end();
	});
});

// POST Meals
app.post('/Meals', jwtAuth, (req, res) => {
	const requiredFields = ['meal', 'recipe', 'day', 'username'];
	for (let i = 0; i < requiredFields.length; i++) {
		const field = requiredFields[i];
		if (!(field in req.body)) {
			const message = `Missing \`${field}\` in request body`;
			console.error(message);
			return res.status(400).send(message);
		}
	}

	Meals.create({
			meal: req.body.meal,
			recipe: req.body.recipe,
			day: req.body.day,
			username: req.body.username
		})
		.then(meal => res.status(201).json(meal.serialize()))
		.catch(err => {
			console.error(err);
			res.status(500).json({
				error: 'WHAT DID YOU DO?!'
			});
		});
});

// PUT update Meal
app.put('/meals/:id', jwtAuth, (req, res) => {
	if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
		res.status(400).json({
			error: 'Request path id and request body id values must match'
		});
	}

	const updated = {};
	const updateableFields = ['meal', 'recipe', 'day'];
	updateableFields.forEach(field => {
		if (field in req.body) {
			updated[field] = req.body[field];
		}
	});

	Meals.findByIdAndUpdate(
			req.params.id, {
				$set: updated
			}, {
				new: true
			}
		)
		.then(updatedMeal => res.status(204).end())
		.catch(err =>
			res.status(500).json({
				message: 'WHAT DID YOU DO?!'
			})
		);
});

app.get('/logout', (req, res) => {
	req.logout();
	res.redirect('/');
});


// Server Instructions
function runServer(databaseUrl, port = PORT) {
	return new Promise((resolve, reject) => {
		mongoose.connect(
			databaseUrl,
			err => {
				if (err) {
					return reject(err);
				}
				server = app
					.listen(port, () => {
						console.log(`Your app is listening on port ${port}`);
						resolve();
					})
					.on('error', err => {
						mongoose.disconnect();
						reject(err);
					});
			}
		);
	});
}

function closeServer() {
	return mongoose.disconnect().then(() => {
		return new Promise((resolve, reject) => {
			console.log('Closing server');
			server.close(err => {
				if (err) {
					return reject(err);
				}
				resolve();
			});
		});
	});
}

if (require.main === module) {
	runServer(DATABASE_URL).catch(err => console.error(err));
}

module.exports = {
	app,
	runServer,
	closeServer
};