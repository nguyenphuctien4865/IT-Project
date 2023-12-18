import Category from "../models/CategoryModel.js";

// select all categories
export const selectAllCategories = async (req, res, next) => {
  try {
    const category = await Category.find({});
    res.status(200).json(category);
  } catch (err) {
    next(err);
  }
};
export const selectCategory = async (req, res, next) => {
  try {
    const category = await Category.findOne({
      _id: req.params.id,
    });
    res.status(200).json(category);
  } catch (error) {
    next(error);
  }
};
// create a new category
export const createCategory = async (req, res, next) => {
  try {
    const category = new Category(req.body);
    await category.save();
    res.status(200).json(category);
  } catch (error) {
    next(error);
  }
};

// delete category
export const deleteCategory = async (req, res, next) => {
  try {
    const result = await Category.findByIdAndDelete({ _id: req.params.id });

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

// update category by id
export const updateCategory = async (req, res, next) => {
  try {
    const result = await Category.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: req.body }
    );
    res.status(200).json("Category has been updated");
  } catch (err) {
    next(err);
  }
};
