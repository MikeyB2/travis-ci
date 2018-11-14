# CSTM Made - Meal planner

![Screenshot of Meal Planner Page](https://github.com/MikeyB2/travis-ci/new/master/mealsSS.PNG)

*website: *

This is a meal planner/recipe book/ shopping-list app that helps to make meal planning and shopping-list easier to create.

After logging in or creating a user, a user has
access to the meal planner page, your recipes page, and your shopping-list page.

### Recipes

There are inputs on the Recipe page that are for the Recipe Name, Ingredients, and Instructions.  
The Recipe Name and ingredients fields are required.  
After you create your recipes you will be able to use them in the Meal Planner page.


### Meal Planner

There are inputs for each day of the week to planner a weeks worth of meals:

**Meals** - Each day you can add a meal, multiple times if you like, for breakfast, lunch, dinner, and snack

**Recipes** - The recipes available are the recipes that you add on the recipes page.  
Once you add a new recipe it is immediately available to add to your meal planner.

**Shopping-List** - When you add a recipe to the meal planner it will automatically add those items to your shopping-list page.

To add a new meal, users have to select from the drop down which meal it is and select which recipe they would like to have at that meal.

## Shopping-List

There are inputs for ingredient and amount of the ingredient but only the ingredient is required:

**Monthly Actuals vs. Budget** - shows total actuals and budget by category
for the month selected at the top of the page


### Deleting recipes, meals, and shopping-list items

To delete any of the items you have added there is a delete button next to all the items that will allow you to delete anything you add from you app.

## New User Sign Up

On the home page, new users can find a link up top to the login form and to create a new
account you have to click the New User link below the login inputs. 
A username, password, and email address are required to set up an account.


## Technology Used

This app utilizes HTML, CSS, Javascript, and JQuery.

The server-side utilizes javascript, Node, Express, MongoDB & Mongoose, morgan, body-parser, and cors for Restful API construction. Passport, bcryptjs, jsonwebtoken
are used for JWT tokenization.

For testing, chai, chai-http, faker, and mocha 
are used. 
