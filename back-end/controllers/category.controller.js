const express=require('express')
const services=require("../services/category.services")
const {body,query,param,check,validationResult }=require("express-validator")
const mongoose = require("mongoose");
const {authenticaiton} = require("./../middlewares/authentication.middleware") 
const {authorize} = require("./../middlewares/authorization.middleware")


const router=express.Router()
router.get('/categories', async (req, res, next) => {
  try {
      const categories = await services.getAllCategories();
      if (categories)
          res.status(200).json(categories);
      else 
          throw new Error(categories.message);
  } catch (error) {
      next(error);
  }
});

router.get('/categories/:id', async (req, res, next) => {
    try {
        const categoryId = req.params.id;
    
        if (!mongoose.Types.ObjectId.isValid(categoryId)) {
            const error = new Error("Invalid Category ID format");
            error.status = 400;
            throw error;
        }
  
        const category = await services.getCategoryById(categoryId);
        res.status(200).json(category);
    } catch (error){
        next(error);
    }
});

router.get('/categories/get/active', async (req, res, next) => {
    try {
        const categories = await services.getCategoriesByActive();
        res.status(200).json(categories);
    } catch (error){
        next(error);
    }
});

router.get('/categoryByName/:name',  async (req, res, next) => {
    try {
        const category = await services.getCategoryByName(req.params.name);
        res.status(200).json(category);
    } catch (error){
        next(error);
    }
});

router.post('/categories', authenticaiton, authorize("manager"), async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const error = new Error("Validation failed");
        error.status = 422;
        error.message = errors.array().map(err => err.msg).join(" ");
        throw error;
      }
      const categoryData = req.body;
      const result = await services.addCategory(categoryData);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  })

  router.put('/categories/:id', authenticaiton, authorize("manager"), async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const error = new Error("Validation failed");
        error.status = 422;
        error.message = errors.array().map(err => err.msg).join(" ");
        throw error;
      }
      const categoryId = req.params.id;
      const categoryData = req.body;
      const result = await services.updateCategory(categoryId, categoryData);
  
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  })

  router.put('/categories/toggle/:id', authenticaiton, authorize("manager"), async (req, res, next) => {
    try {
        const categoryId = req.params.id;
        const result = await services.updateCategoryActive(categoryId);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
});


  router.delete('/categories/:id',authenticaiton, authorize("manager"), async (req, res, next) => {
    try {
      const categoryId = req.params.id;
  
      if (!mongoose.Types.ObjectId.isValid(categoryId)) {
        const error = new Error("Invalid Category ID format");
        error.status = 400;
        throw error;
      }
  
      const result = await services.deleteCategoryById(categoryId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  })


router.delete('/categories', async (req, res, next) => {
  try {
    await services.deleteAllCategories();
    res.status(200).json({ message: 'All categories deleted successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports=router