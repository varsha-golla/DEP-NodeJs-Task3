const db = require('../models/index');
const { Op } = require('sequelize');

const userAttributes = ['id', 'login', 'password', 'age', 'isDeleted'];

async function connectToAndInitializeDB() {
    await connectToDb();
    await createTable();
    await insertUsers();
}

async function connectToDb() {
    try {
        await db.sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

async function createTable() {
    try {
        await db.User.sync({ force: true });
        console.log('Empty User table created successfully');
    } catch (error) {
        console.log('Failed to create the User table!');
    }
}

async function insertUsers() {
    await insert({ login: 'JohnDoe', password: 'John123', age:23 });
    await insert({ login: 'Michael', password: 'Michael5', age:30 });
    await insert({ login: 'AdabAdab', password: 'AdabAdab56', age:4 });
    await insert({ login: 'HarryPotter56', password: 'harryPotter569', age:30 });
    await insert({ login: 'Peter03', password: 'Peter123', age:25 });
}

function createUser(reqBody) {
    const user = {
        login: reqBody.login,
        password: reqBody.password,
        age: reqBody.age
    };
    return user;
}

function createUserWithUpdatedData(newUserData, oldUserData) {
    const user = {
        login: newUserData.login || oldUserData.login,
        password: newUserData.password || oldUserData.password,
        age: newUserData.age || oldUserData.age,
        isDeleted: newUserData.isDeleted || oldUserData.isDeleted
    };
    return user;
}

async function insert(user) {
    await db.User.create(user);
}

async function getUsers() {
    const users = await db.User.findAll({
        attributes: userAttributes
    });
    return users;
}

async function findById(id) {
    const users = await db.User.findAll({
        attributes: userAttributes,
        where: {
            id
        }
    });
    return users;
}

async function findUsersByLogin(loginSubstring, limit) {
    return await db.User.findAll({
        attributes: ['login'],
        where: {
            login: {
                [Op.substring]: loginSubstring
            }
        },
        limit
    });
}

async function updateById(id, newUserData) {
    db.User.update(newUserData, {
        where: {
            id
        }
    });
}

function generateValidationErrorMessage(err) {
    const errorsMessages = err.errors.map(error => {
        if (error.path === 'password' && error.validatorKey === 'is') {
            return 'password must contain both letters and numbers';
        } else if (error.path === 'age' && (error.validatorKey === 'min' || error.validatorKey === 'max')) {
            return 'age must be an integer between 4 and 130';
        }
        return error.message;
    });
    return `Error:\n ${errorsMessages.join('\n')}`;
}

module.exports = {
    connectToAndInitializeDB,
    createUser,
    createUserWithUpdatedData,
    insert,
    getUsers,
    findById,
    findUsersByLogin,
    updateById,
    generateValidationErrorMessage
};
