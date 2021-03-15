const { UserClient } = require('./api');

(async () => {
    const users = new UserClient();
    try {
        await users.connect();

        await users.clean();

        await users.add("Laszlo", "szikszail", "password");

        const newAllUsers = await users.all();
        console.log(newAllUsers);

    } finally {
        await users.disconnect();
    }
})();