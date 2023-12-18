import Product from "../models/productModel.js";
import { getTextSearch } from "../utils/format.js";
import { getUrlImageArr, getUrlImageForArrObject } from "../utils/getUrlImage.js";

// search default
export const searchProduct = async (req, res, next) => {
    try {
        const input = `"${await getTextSearch(req.params.text)}"`;
        let products = await Product.find({ $text: { $search: input } })
        const result = getUrlImageForArrObject(products);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

// search products by input = name + description sort date
export const searchProductAndSortDate = async (req, res, next) => {
    try {
        const input = `"${await getTextSearch(req.params.text)}"`;
        const sort = req.params.code;
        let products = await Product.find({ $text: { $search: input } })
        if (sort !== "")
            products = await Product.find({ $text: { $search: input } }, [], { sort: { createdAt: sort } })//products.sort({ price: "asc" });
        const result = getUrlImageForArrObject(products);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}


// search products by input = name + description sort price
export const searchProductAndSortPrice = async (req, res, next) => {
    try {
        const input = `"${await getTextSearch(req.params.text)}"`;
        const sort = req.params.code;
        let products = await Product.find(
            { $text: { $search: input } },
            [],
            { sort: { price: sort } })
        const result = getUrlImageForArrObject(products);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}