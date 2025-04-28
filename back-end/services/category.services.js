const repo=require("../repos/category.repo")

module.exports.getAllCategories =async () => 
{
    try{
        const categories = await repo.getCategories();
        return categories;
    }catch (error)
    {
        throw new Error("Error getting categories: " + error.message);
    }
}

module.exports.getCategoryById =async (categoryId) => 
{
    try{
        const category = await repo.getCategoryById(categoryId);
        return category;
    }catch (error)
    { 
        throw new Error("Error getting category: " + error.message);
    }
}

module.exports.getCategoriesByActive =async () => 
{
    try{
        const Categories = await repo.getCategoriesByActive();
        return Categories;
    }catch (error)
    { 
        throw new Error("Error getting active categories: " + error.message);
    }
}

module.exports.getCategoryByName =async (categoryName) => 
{
    try{
        const category = await repo.getCategoryByName(categoryName);
        return category;
    }catch (error)
    { 
        throw new Error("Error getting category: " + error.message);
    }
}
module.exports.addCategory=async (data) => 
{
    try{
        const savedCategory = await repo.addCategory(data);
        return savedCategory;
    }catch (error)
    { 
        throw new Error("Error adding category: " + error.message);
    }
}

module.exports.updateCategory = async (categoryId, data) => {
    try {
      const updatedCategory = await repo.updateCategory(categoryId, data);
  
      if (!updatedCategory) {
        throw new Error("Category not found");
      }
      return updatedCategory ;
    } catch (error) {
      throw new Error("Error updating category: " + error.message);
    }
  };

module.exports.updateCategoryActive = async (categoryId) => {
    try {
      const updateCategoryActive = await repo.updateCategoryActive(categoryId);
  
      if (!updateCategoryActive) {
        throw new Error("Category not found");
      }
      return updateCategoryActive;
    } catch (error) {
      throw new Error("Error updating category: " + error.message);
    }
  };

  module.exports.deleteCategoryById = async (id) => {
    try {
      const deletedCategory = await repo.deleteCategoryById(id);
      if (!deletedCategory) {
        throw new Error("Category not found");
      }
      return { success: true, message: "Category deleted successfully" };
    } catch (error) {
      throw new Error("Error deleting category by ID: " + error.message);
    }
  };

module.exports.deleteAllCategories = async () => {
  try {
    await repo.deleteAllCategories();
    return { success: true, message: "All categories deleted successfully" };
  } catch (error) {
    throw new Error("Error deleting all categories: " + error.message);
  }
};
  
