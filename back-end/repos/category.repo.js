const category=require("../models/category.model")

module.exports.getCategories = async () => {
    try{
        const categories = await category.find({});
        return categories
    }catch (error)
    {
        throw new Error("Error getting categories: " + error.message);
    }
}

module.exports.getCategoryById = async(categoryId) => {
    try{
        const Category = await category.findOne({ _id:categoryId});
        if (!Category) {
            throw new Error("ID doesn't exist");
        }
        return Category;
    }catch(error)
    {
        throw new Error("Error getting category: " + error.message);
    }
}

module.exports.getCategoriesByActive = async() => {
    try{
        const Categories = await category.find({ isActive:true});
        if (!Categories) {
            throw new Error("not found any active category");
        }
        return Categories;
    }catch(error)
    {
        throw new Error("Error getting active categories: " + error.message);
    }
}

module.exports.getCategoryByName = async(categoryName) => {
    try{
        const Category = await category.findOne({ name:categoryName});
        if (!Category) {
            throw new Error("name doesn't exist");
        }
        return Category;
    }catch(error)
    {
        throw new Error("Error getting category: " + error.message);
    }
}
module.exports.addCategory = async(data) => {
    try {
        const newCategory = new category(data);
        const savedCategory = await newCategory.save();
    
        return savedCategory
      } catch (error) {
        throw new Error("Error adding category: " + error.message);
      }
}

module.exports.updateCategory = async (categoryId, data) => {
    try {
      const updatedCategory = await category.findByIdAndUpdate(categoryId, data, { new: true });
      return updatedCategory;
    } catch (error) {
      throw new Error("Error updating category: " + error.message);
    }
  };

  module.exports.updateCategoryActive = async (categoryId) => {
    try {
        const categoryData = await category.findById(categoryId);
        if (!categoryData) {
            throw new Error("Category not found");
        }

        const updatedCategory = await category.findByIdAndUpdate(
            categoryId,
            { isActive: !categoryData.isActive },
            { new: true }
        );

        return updatedCategory;
    } catch (error) {
        throw new Error("Error updating category: " + error.message);
    }
};


  module.exports.deleteCategoryById = async (id) => {
    try {
      const deletedCategory = await category.findByIdAndDelete(id);
      return deletedCategory;
    } catch (error) {
      throw new Error("Error deleting category by ID: " + error.message);
    }
  };

module.exports.deleteAllCategories = async () => {
  try {
    await category.deleteMany({});
    return true;
  } catch (error) {
    throw error;
  }
};