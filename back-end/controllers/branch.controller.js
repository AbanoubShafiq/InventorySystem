const service = require('../services/branch.service');
const express=require('express')
const mongoose = require("mongoose");
const {validationResult}=require("express-validator")

const {authenticaiton} = require("./../middlewares/authentication.middleware") 
const {authorize} = require("./../middlewares/authorization.middleware")


const router=express.Router()
router.get('/branches', authenticaiton, authorize("manager"), async (req, res, next) => {
  try {
      const branches = await service.getAllBranches();
      if (branches)
          res.status(200).json(branches);
      else 
          throw new Error(branches.message);
  } catch (error) {
      next(error);
  }
});

router.get('/branches/:id', authenticaiton, authorize("cashier"), async (req, res, next) => {
    try {
        const branchId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(branchId)) {
            const error = new Error("Invalid branch ID format");
            error.status = 400;
            throw error;
        }
    
        const branch = await service.getBranchById(branchId);
        res.status(200).json(branch);
    } catch (error){
        next(error);
    }
});

router.get('/branches/get/active', authenticaiton, authorize("manager"), async (req, res, next) => {
    try {
        const branches = await service.getBranchesByActive();
        res.status(200).json(branches);
    } catch (error){
        next(error);
    }
});
router.get('/branchesByType/:type', authenticaiton, authorize("manager"), async (req, res, next) => {
    try {
        const branches = await service.getBranchesByType(req.params.type);
        res.status(200).json(branches);
    } catch (error){
        next(error);
    }
});

router.get('/branchByName/:name', async (req, res, next) => {
    try {
        const branch = await service.getBranchByName(req.params.name);
        res.status(200).json(branch);
    } catch (error){
        next(error);
    }
});

router.post('/branches', authenticaiton, authorize("manager"),  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const error = new Error("Validation failed");
        error.message = errors.array().map(err => err.msg).join(" ");
        error.status = 422;
        throw error;
      }
      const data = req.body;
      const savedBranch = await service.addBranch(data);
      res.status(201).json(savedBranch);
    } catch (error) {
      next(error);
    }
  });

router.put('/branches/:id',authenticaiton, authorize("manager"), async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          const error = new Error("Validation failed");
          error.status = 422;
          error.message = errors.array().map(err => err.msg).join(" ");
          throw error;
        }
      const branchId = req.params.id;
      const data = req.body;
      const updatedBranch = await service.updateBranch(branchId, data);

      res.status(200).json(updatedBranch);
    } catch (error) {
      next(error);
    }
  });

   router.put('/branches/toggle/:id', authenticaiton, authorize("manager"), async (req, res, next) => {
      try {
          const branchId = req.params.id;
          const updatedBranch = await service.updateBranchActive(branchId);
          res.status(200).json(updatedBranch);
      } catch (error) {
          next(error);
      }
  });
  
router.delete('/branches/:id', authenticaiton, authorize("manager"), async (req, res, next) => {
    try {
      const branchId = req.params.id;

      if (!mongoose.Types.ObjectId.isValid(branchId)) {
        const error = new Error("Invalid branch ID format");
        error.status = 400;
        throw error;
      }
      const deletedBranch = await service.deleteBranch(branchId);
      res.status(200).json(deletedBranch);
    } catch (error) {
      next(error);
    }
  });

module.exports=router