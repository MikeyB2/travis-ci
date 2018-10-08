const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const app = express();

app.use(morgan('common'));
app.use(express.json());

const {
	DATABASE_URL,
	PORT
} = require('./config');

const {
	Recipe
} = require('./models');
app.use(express.static('public'));

// app.use("/shopping-list", shoppingListRouter);
// app.use("/recipes", recipesRouter);


app.get('/recipes', (req, res) => {
	Recipe
		.find()
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

app.get('/recipes/:id', (req, res) => {
	Recipe
		.findById(req.params.id)
		.then(recipe => res.json(recipe.serialize()))
		.catch(err => {
			console.error(err);
			res.status(500).json({
				error: 'WHAT DID YOU DO?!'
			});
		});
});

app.post('/recipes', (req, res) => {
	const requiredFields = ['recipeName', 'ingrediants', 'instructions'];
	for (let i = 0; i < requiredFields.length; i++) {
		const field = requiredFields[i];
		if (!(field in req.body)) {
			const message = `Missing \`${field}\` in request body`;
			console.error(message);
			return res.status(400).send(message);
		}
	}

	Recipe
		.create({
			recipeName: req.body.recipeName,
			ingrediants: req.body.ingrediants,
			instructions: req.body.instructions
		})
		.then(recipe => res.status(201).json(recipe.serialize()))
		.catch(err => {
			console.error(err);
			res.status(500).json({
				error: 'WHAT DID YOU DO?!'
			});
		});

});

app.delete('/recipes/:id', (req, res) => {
	Recipe
		.findByIdAndRemove(req.params.id)
		.then(() => {
			console.log(`Deleted Recipe with id \`${req.params.id}\``);
			res.status(204).end();
		});
});

app.put('/recipes/:id', (req, res) => {
	if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
		res.status(400).json({
			error: 'Request path id and request body id values must match'
		});
	}

	const updated = {};
	const updateableFields = ['recipeName', 'ingrediants', 'instructions'];
	updateableFields.forEach(field => {
		if (field in req.body) {
			updated[field] = req.body[field];
		}
	});

	Recipe
		.findByIdAndUpdate(req.params.id, {
			$set: updated
		}, {
			new: true
		})
		.then(updatedRecipe => res.status(204).end())
		.catch(err => res.status(500).json({
			message: 'WHAT DID YOU DO?!'
		}));
});

function runServer(databaseUrl, port = PORT) {
	return new Promise((resolve, reject) => {
		mongoose.connect(databaseUrl, err => {
			if (err) {
				return reject(err);
			}
			server = app.listen(port, () => {
					console.log(`Your app is listening on port ${port}`);
					resolve();
				})
				.on('error', err => {
					mongoose.disconnect();
					reject(err);
				});
		});
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