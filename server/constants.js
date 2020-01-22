const CONSTANTS = {};

CONSTANTS.PORT = process.env.PORT || "3000";
CONSTANTS.DB = 'mongodb://localhost/eshop';
CONSTANTS.SECRET = 'navingenex';
CONSTANTS.FORGOTPASSWORDMAILID = "navin.dev.angular@gmail.com";
CONSTANTS.saltRounds = 10;

module.exports = CONSTANTS;
