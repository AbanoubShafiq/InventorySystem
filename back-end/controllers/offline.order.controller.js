const {
    getAllOfflineOrders,
    getAllOrdersByBranchId,
    getOfflineOrderById,
    createOfflineOrder,
    cancelOfflineOrder,deleteProductFromOrderService
  } = require("../services/offline.orders.service");


const {authenticaiton} = require("./../middlewares/authentication.middleware") 
const {authorize} = require("./../middlewares/authorization.middleware")



  const { getBranchById } = require('../services/branch.service'); // Correct import for getBranchById
  const { getSubInventoryById } = require('../services/sub.inventory.services'); // Correct import for getSubInventoryById
  
  const router = require("express").Router();
  const express = require("express");
  router.use(express.json());
  router.use(express.urlencoded({ extended: true }));

  
  module.exports.deleteProductFromOrder = async (req, res) => {
    try {
      const { orderId, productId, quantity } = req.body;
      const result = await deleteProductFromOrderService(orderId, productId, quantity);
      if (!result.success) return res.status(400).json(result.message);
      return res.status(200).json(result.message);
    } catch (error) {
      res.status(500).send(error.message);
    }
  };
  module.exports.getAllOfflineOrders = async (req, res) => {
    try {
      console.log("test")
      const result = await getAllOfflineOrders();
      if (!result.success) return res.status(400).json(result.message);
      return res.status(200).json(result.message);
    } catch (error) {
      res.status(500).send(error.message);
    }
  };
  
  module.exports.getAllOrdersByBranchId = async (req, res) => {
    try {
      const result = await getAllOrdersByBranchId(req.params.branchId);
      if (!result.success) return res.status(400).json(result.message);
      return res.status(200).json(result.message);
    } catch (error) {
      res.status(500).send(error.message);
    }
  };
  
  module.exports.getOfflineOrderById = async (req, res) => {
    try {
      const result = await getOfflineOrderById(req.params.orderId);
      if (!result.success) return res.status(400).json(result.message);
      return res.status(200).json(result.message);
    } catch (error) {
      res.status(500).send(error.message);
    }
  };
  
  module.exports.createOfflineOrder = async (req, res) => {
    try {
      const result = await createOfflineOrder(req.body);
      if (!result.success) return res.status(400).json(result.message);
      return res.status(201).json(result.message);
    } catch (error) {
      res.status(500).send(error.message);
    }
  };
  
  module.exports.cancelOfflineOrder = async (req, res) => {
    try {
      const result = await cancelOfflineOrder(req.params.orderId);
      if (!result.success) return res.status(400).json(result.message);
      return res.status(200).json(result.message);
    } catch (error) {
      res.status(500).send(error.message);
    }
  };
  
  module.exports.getBranchById = async (req, res) => {
    try {
      const { branchId } = req.params;
      const branch = await getBranchById(branchId);
      if (!branch) return res.status(404).json({ message: 'Branch not found' });
      return res.status(200).json(branch);
    } catch (error) {
      res.status(500).send(error.message);
    }
  };
  
  module.exports.getSubInventoryById = async (req, res) => {
    try {
      const { subInventoryId } = req.params;
      const subInventory = await getSubInventoryById(subInventoryId);
      if (!subInventory) return res.status(404).json({ message: 'Sub-Inventory not found' });
      return res.status(200).json(subInventory);
    } catch (error) {
      res.status(500).send(error.message);
    }
  };