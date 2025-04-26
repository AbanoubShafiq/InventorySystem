/**
 * Test Data Generator
 * Purpose: Creates sample data for testing product endpoints
 * Note: Not needed for production, keep for reference and future testing
 * Usage: node tests/TestData.js
 */
const mongoose = require('mongoose');
const User = require('../models/user.model');
const Category = require('../models/category.model');
const Supplier = require('../models/supplier.model');
const Product = require('../models/product.model');
require('dotenv').config();

async function TestData() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Clean up existing test data
        await User.deleteOne({ email: "seller@test.com" });
        await Category.deleteOne({ name: "Perfumes" });
        await Supplier.deleteOne({ email: "supplier@test.com" });

        // Create test seller with unique email
        const seller = await User.create({
            firstName: "Test",
            lastName: "Seller",
            email: "seller" + Date.now() + "@test.com", // Unique email
            password: "password123",
            role: "Seller",
            contactNo: "1234567890",
            isActive: true
        });

        // Create test category
        const category = await Category.create({
            name: "Perfumes",
            description: "Luxury perfumes"
        });

        // Create test supplier with all required fields
        const supplier = await Supplier.create({
            name: "Perfume Supplier",
            email: "supplier" + Date.now() + "@test.com", // Unique email
            phone: "1234567890",
            companyName: "Luxury Perfumes Inc",
            contactNo: "9876543210"
        });

        console.log('Test Data Created Successfully:', {
            sellerId: seller._id.toString(),
            categoryId: category._id.toString(),
            supplierId: supplier._id.toString()
        });

    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

TestData();