import Review from "../models/reviewModel.js";
import Product from "../models/productModel.js";
import { getUrlImageObj } from "../utils/getUrlImage.js";

// select all reviews by product id
export const selectAllReviewByProductId = async (req, res, next) => {
  try {
    const review = await Review.find({ product: req.params.id })
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "name img avatar",
      });
    let rs = [];
    let i = 0;
    for (i; i < review.length; i++) {
      const { user, ...others } = review[i]._doc;
      let imgPath;
      if (user.img !== null) imgPath = getUrlImageObj(user.img);
      else imgPath = user.avatar;
      const result = { ...others, name: user.name, imgPath: imgPath };
      rs.push(result);
    }

    res.status(200).json(rs);
  } catch (error) {
    next(error);
  }
};

// delete a review
export const deleteReview = async (req, res, next) => {
  try {
    const result = await Review.findByIdAndDelete({ _id: req.params.id });
    res.status(200).json("Review has been deleted");
  } catch (error) {
    next(error);
  }
};

// update review
export const updateReview = async (req, res, next) => {
  try {
    const result = await Review.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// create a new review
export const createReview = async (req, res, next) => {
  try {
    const existReview = await Review.findOne({
      product: req.body.product,
      user: req.body.user,
    });
    if (existReview) {
      res
        .status(200)
        .json({ message: "You has already add review in this product." });
      return;
    }
    const review = new Review(req.body);
    await review.save();
    const rating = Number(req.body.rating);

    const product = await Product.findOne({ _id: req.body.product });

    const ratingQuantity = product.ratingQuantity + 1;
    const ratingAverage =
      (product.ratingAverage * product.ratingQuantity + rating) /
      ratingQuantity;

    await Product.findByIdAndUpdate(req.body.product, {
      $set: {
        ratingQuantity: ratingQuantity,
        ratingAverage: ratingAverage,
      },
    });
    res.status(200).json("Review has been created.");
  } catch (error) {
    next(error);
  }
};
