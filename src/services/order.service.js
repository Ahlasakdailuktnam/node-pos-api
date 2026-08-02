const orderRepository = require("../repositories/order.repository");

exports.create = async (data, user) => {
  return await orderRepository.create(data, user);
};
exports.getAll = async (filter) => {
  return await orderRepository.getAll(filter);
};
exports.getById = async (id) => {
  return await orderRepository.getById(id);
};