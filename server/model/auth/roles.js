module.exports = {
    admin: ['/users', '/user/getResetPasswordToken',
        '/user/verifyPasswordToken',
        '/user/resetPassword',
        '/user/verifyEmail', '/logout'],
    user: [
        '/logout',
        '/user/getResetPasswordToken',
        '/user/verifyPasswordToken',
        '/user/resetPassword',
        '/user/verifyEmail'
    ]
}