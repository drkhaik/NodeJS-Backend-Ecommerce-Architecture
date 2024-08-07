const discount = require("../discount.model");
const { getSelectData, getUnselectData } = require('../../utils');

const findDiscountByCodeAndShopOwner = async ({ model, filter}) => {
    return await model.findOne(filter).lean();
}

const getAllDiscountCodeSelect = async ({ limit = 50, page = 1, sort = 'ctime', filter, select, model }) => {
    const skip = (page - 1) * limit;
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 };
    const discounts = await model.find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(getSelectData(select))
        .lean();

    return discounts;
} 

const getAllDiscountCodeByUnselect = async ({ limit = 50, page = 1, sort = 'ctime', filter, unselect, model }) => {
    const skip = (page - 1) * limit;
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 };
    const discounts = await model.find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(getUnselectData(unselect))
        .lean();

    return discounts;
} 

module.exports = {
    findDiscountByCodeAndShopOwner,
    getAllDiscountCodeSelect,
    getAllDiscountCodeByUnselect
}