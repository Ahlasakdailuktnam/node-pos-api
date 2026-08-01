const customerRepository = require("../repositories/customer.repository");

exports.getCustomer = async(filter) => {
    return await customerRepository.getAll(filter);
}