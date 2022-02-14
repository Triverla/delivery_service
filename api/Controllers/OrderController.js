const Order = require("../models/Order");
const apiResponse = require("../Support/ApiResponse");
const { validationResult } = require("express-validator");
const dotenv = require("dotenv");
const { logger } = require("../../config/logger");
dotenv.config();

/******************************************************************************
 *                              Order Controller
 ******************************************************************************/

class OrderController {
  getAllOrders = async (req, res, next) => {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const filter = req.query.filter || {};
        const orderBy = {
          ...((req.query.orderBy && req.query.orderBy.field && { field: req.query.orderBy.field }) || { field: 'created_at' }),
          ...((req.query.orderBy && req.query.orderBy.direction && { direction: req.query.orderBy.direction }) || { direction: 'asc' })
        }
    let orderList = await Order.find({page, limit, filter, orderBy});
    if (!orderList.length) {
      throw new apiResponse.ErrorResponse(res, "Orders not found");
    }

    if (orderList.length == 0) {
      throw new apiResponse.successResponseWithData(res, "Success", []);
    }

    orderList = orderList.map((order) => {
      const { customer_id, ...ordersWithoutDistance } = order;
      return ordersWithoutDistance;
    });

    res.send(orderList);
  };

  getOrderById = async (req, res, next) => {
    try {
      const user = await Order.findOne({ id: req.params.id });
      if (!user) {
        throw new apiResponse.ErrorResponse(res, "Order not found");
      }

      const { distance, ...ordersWithoutDistance } = order;

      res.send(ordersWithoutDistance);
    } catch (error) {
      throw new apiResponse.ErrorResponse(res, error.message);
    }
  };

  placeOrder = async (req, res, next) => {
    try {
      this.checkValidation(req, res);

      const result = await Order.create(req.body);

      if (!result) {
        return res.status(400).json({
            error: "Something went wrong! Order not placed",
        });
      }

      return res.status(201).json({
          id: result.order_id,
          distance: result.distance,
          status: result.status.toUpperCase(),
      });
    } catch (error) {
        logger.error(error); // log error to console
        return res.status(400).json({
            error: error.message,
        });
    }
  };

  takeOrder = async (req, res, next) => {
    try {
      this.checkValidation(req, res);

      const { status, ...restOfUpdates } = req.body;

      // do the update query and get the result
      // it can be partial edit
      const result = await UserModel.update(restOfUpdates, req.params.id);

      if (!result) {
        throw new Error("Something went wrong");
      }

      const { affectedRows, changedRows, info } = result;

      const message = !affectedRows
        ? "Order not found"
        : affectedRows && changedRows
        ? "Order updated successfully"
        : "Update failed";

      return apiResponse.successResponse(res, message, result);

    } catch (error) {
        logger.error(error); // log error to console
        return res.status(400).json({
            error: error.message,
        });
    }
  };

  checkValidation = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new apiResponse.validationErrorWithData(
        res,
        "Validation failed",
        errors
      );
    }
  };
}

/******************************************************************************
 *                               Export
 ******************************************************************************/
module.exports = new OrderController();
