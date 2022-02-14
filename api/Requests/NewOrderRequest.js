const { body } = require('express-validator');


exports.createOrderSchema = [
    body('origin')
        .exists()
        .withMessage('Origin is required')
        .isArray()
        .withMessage('origin is must be an array'),
    body('destination')
        .exists()
        .withMessage('Destination is required')
        .isArray()
        .withMessage('destination is must be an array'),
    /*body('customer_id')
        .exists()
        .withMessage('Customer ID is required')
        .isAlpha()
        .withMessage('Must be only alphabetical chars')
        .isLength({ min: 3 })
        .withMessage('Must be at least 3 chars long'),
    body('order_id')
        .exists()
        .withMessage('Order ID is required')
        .isNumeric()
        .withMessage('Must be only numeric chars'),
    body('status')
        .optional()
        .isIn(["unassigned", "taken", "delivered"])
        .withMessage('Status must be one of: unassigned, taken, delivered')*/
];

exports.UpdateOrderSchema = [
    body('status')
        .exists()
        .withMessage('Status is required')
        .isIn(["unassigned", "taken", "delivered"])
        .withMessage('Status must be one of: unassigned, taken, delivered')
];
