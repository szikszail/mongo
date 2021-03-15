const mongoose = require('mongoose');

const { Schema } = mongoose;

const User = new Schema({
    name: String,
    username: String,
    password: String,
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now },
    active: { type: Boolean, default: true },
});

class UserClient {
    constructor({ host, port, db } = {}) {
        this.host = host || 'localhost';
        this.post = port || 27017;
        this.db = db || 'users';
    }

    async connect() {
        await mongoose.connect(`mongodb://${this.host}:${this.port}/${this.db}`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true,
        });
        console.log('Connected');

        this.UserModel = mongoose.model('User', User);
    }

    async disconnect() {
        await mongoose.disconnect();
        console.log('Disconnected');
    }

    async getByUsername(username) {
        return await this.UserModel.findOne({ username });
    }

    async clean() {
        await this.UserModel.deleteMany({});
        console.log('Cleaned');
    }

    async add(name, username, password) {
        if (await this.getByUsername(username)) {
            throw new Error(`${name} already added!`);
        }

        const newUser = new this.UserModel({ name, username, password });
        await newUser.save();
        console.log(`${name} added`);
    }

    async all() {
        return await this.UserModel.find({});
    }
}

module.exports = { UserClient };