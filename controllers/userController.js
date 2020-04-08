const UserService = require('../services/UserService');

exports.getUserPrincipals = async (req, res) => {
    try {
        console.log('userController.getUserPrincipals begin');

        var userData = null;

        try {
            userData = await UserService.getApiUserPrincipals();
            res.status(200).send(userData);
        } catch (err) {
            console.log(`Error in getUserPrincipals ${err}`);
            res.status(500).send({ error: `Error in getUserPrincipals ${err}` })
        }

        console.log('userController.getUserPrincipals end');
    } catch (err) {
        console.log(`Error in userController.getUserPrincipals: ${err}`);
        res.status(500).send('Internal Server Error during getUserPrincipals request.');
    }
}