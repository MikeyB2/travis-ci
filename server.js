const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const app = express();

app.use(morgan('common'));

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
				error: 'something went terribly wrong'
			});
		});
});

app.post('/recipes', (req, res) => {
	const requiredFields = ['name', 'ingrediants', 'instructions'];
	for (let i = 0; i < requiredFields.length; i++) {
		const field = requiredFields[i];
		console.log('Testing:' + req.body);
		if (!(field in req.body)) {
			const message = `Missing \`${field}\` in request body`;
			console.error(message);
			return res.status(400).send(message);
		}
	}

	Recipe
		.create({
			name: req.body.name,
			ingrediants: req.body.ingrediants,
			instructions: req.body.instructions
		})
		.then(recipe => res.status(201).json(recipe.serialize()))
		.catch(err => {
			console.error(err);
			res.status(500).json({
				error: 'Something went wrong'
			});
		});

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
	app.listen(process.env.PORT || 8080, function () {
		console.info(`App listening on ${this.address().port}`);
	});
}

module.exports = {
	app,
	runServer,
	closeServer
};