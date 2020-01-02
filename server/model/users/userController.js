const User=require('./user')

async function create(userData, callback) {
    if (userData.userName && userData.email) {
        const user = new User({
            userName: userData.userName,
            email: userData.email
        });
        user.save((err, data) => {
            if (err)
                callback(err);
            else
                callback(null, data);
        });
    }
}




async function getUser(callback) {
    const users = User.find((err, data) => {
        if (err)
            callback(err);
        else
            callback(null, data);
    });
}

module.exports = { getUser,create };