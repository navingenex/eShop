

module.exports = {
    find: function find(schema, criteria, projection, option, callback) {
        schema.find(criteria, projection, option, (err, data) => {
            if (err)
                callback(err)
            else if (!data.length)
                callback('error');
            else
                callback(null, data)
        });
    },
    updateOne: function updateOne(schema, criteria, projection, option, callback) {
        schema.findOneAndUpdate(criteria, projection, { new: true }, (err, data) => {
            if (err)
                callback(err);
            else
                callback(null, data)
        })
    }

}