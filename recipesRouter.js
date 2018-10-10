const express = require("express");
const router = express.Router();

const {
    Recipe
} = require("./models");



router.get("/", (req, res) => {
    res.json(Recipe.get());
});


router.get('/', (req, res) => {
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

router.get('/:id', (req, res) => {
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

router.post('/', (req, res) => {
    const requiredFields = ['recipeName', 'ingredients', 'instructions'];
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
            ingredients: req.body.ingredients,
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

router.delete('/:id', (req, res) => {
    Recipe
        .findByIdAndRemove(req.params.id)
        .then(() => {
            console.log(`Deleted Recipe with id \`${req.params.id}\``);
            res.status(204).end();
        });
});

router.put('/:id', (req, res) => {
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


module.exports = router;