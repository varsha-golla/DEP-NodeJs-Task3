const express = require('express');
const userRouter = require('./routers/user.router');
const userController = require('./controllers/user.controller');
const app = express();
const config = require('./config/index');

app.use(express.json());
app.use('/users', userRouter.router);

const port = config.port || 3000;

app.listen(port, async (req, res) => {
    console.log(`App listening on port: ${port}`);
    try {
        await userController.connectToAndInitializeDB();
        console.log('Inserted initial users records successfully!');
    } catch (err) {
        res.send(`Error: {err}`);
    }
});
