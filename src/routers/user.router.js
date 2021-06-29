const express = require('express');
const router = express.Router();
const app = express();
const userController = require('../controllers/user.controller');

const userNotFoundError = {
    message: `User with given ID is not found!`,
    status: 404
};

app.use(express.json());

router.get('/', async (req, res) => {
    try {
        res.send(await userController.getUsers());
    } catch (err) {
        res.send(`Error: ${err}`);
    }
});

router.get('/:id', async (req, res) => {
    try {
        const users = await userController.findById(req.params.id);
        if (users.length > 0) {
            res.send(users[0]);
        } else {
            res.status(404).send(userNotFoundError);
        }
    } catch (err) {
        res.send(`Error: ${err}`);
    }
});

router.get('/autosuggest/:loginSubstring/:limit', async (req, res) => {
    try {
        const users = await userController.findUsersByLogin(req.params.loginSubstring, req.params.limit);
        res.send(users.map(user => user.login).sort((login1, login2) => {
            return login1.localeCompare(login2);
        }));
    } catch (err) {
        res.send(err);
    }
});

router.post('/', async (req, res) => {
    try {
        const user = userController.createUser(req.body);
        await userController.insert(user);
        res.send('Added user sucessfully.');
    } catch (err) {
        const errorMessage = userController.generateValidationErrorMessage(err);
        res.send(errorMessage);
    }
});

router.put('/:id', async (req, res) => {
    try {
        const users = await userController.findById(req.params.id);
        if (users.length > 0) {
            const user = userController.createUserWithUpdatedData(req.body, users[0]);
            await userController.updateById(req.params.id, user);
            res.send('Updated user successfully!');
        } else {
            res.status(404).send(userNotFoundError);
        }
    } catch (err) {
        res.send(err);
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const users = await userController.findById(req.params.id);
        if (users.length > 0) {
            const user = userController.createUserWithUpdatedData({ isDeleted: true }, users[0]);
            await userController.updateById(req.params.id, user);
            res.send('Deleted user successfully!');
        } else {
            res.status(404).send(userNotFoundError);
        }
    } catch (err) {
        res.send(err);
    }
});

module.exports = {
    router
};
