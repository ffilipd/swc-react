const db = require("../models");
const User = db.user;

exports.userUpdateSanityCheck = async (props) => {
    const { userToUpdateId, updateData, res } = props;
    try {
        // Check if the user to be updated is an admin
        const user = await User.findOne({ where: { id: userToUpdateId } });
        if (!user) {
            return res.status(404).send({
                message: `Cannot update user with id=${id}. Maybe User was not found!`
            });
        }

        // Count the number of admin users
        const adminCount = await User.count({ where: { role: 'admin' } });
        const isOnlyAdmin = adminCount === 1 && user.role === 'admin';

        // If the user is the only admin, prevent changes to 'active' and 'rejected'
        if (isOnlyAdmin) {
            if ('active' in updateData || 'rejected' in updateData) {
                return res.status(400).send({
                    message: "Cannot change 'active' or 'rejected' properties for the only admin."
                });
            }
        }

        // Prevent changing the role of the only admin
        if (user.role === 'admin' && updateData.role && updateData.role !== 'admin') {
            if (adminCount === 1) {
                return res.status(400).send({
                    message: "Cannot change the role of the only admin user."
                });
            }
        }
    } catch (err) {
        console.log(err);
        res.status(500).send({
            message: `Error failed sanity check: ${err}`
        });
    }
};