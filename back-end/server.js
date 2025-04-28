const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const user = require("./controllers/user.controller");
const permission = require("./controllers/permission.controller");
const Complaint = require("./controllers/complaint.controller")

require('dotenv').config();
const category = require("./controllers/category.controller");
const fileUpload = require("express-fileupload");

const app = express();
const port = process.env.PORT;
const mainInventory = require("./controllers/main.inventory.controller")
const subInventory = require("./controllers/sub.inventory.controller");
const upload = require("./controllers/media.controller");
const order = require('./controllers/order.contorller');
const branch=require("./controllers/branch.controller");
const product = require("./controllers/product.controller")
const offlineOrders = require("./controllers/offline.order.controller")
const cartRoutes = require("./routes/cart.routes"); // تأكد من استيراد وحدة cartRoutes
const checkoutRoutes = require("./routes/checkout.routes"); 
const offlineOrderRoutes = require('./routes/offlineOrder.routes'); // Ensure this path is correct

const distributionReq = require("./controllers/distribution.request..controller");
const prodReq = require("./controllers/product.request.controller");
const prodReview = require("./controllers/product.review.controller");

// Middleware
app.use(cors({ origin: 'http://localhost:4200', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB Atlas');

    // API routes with /api prefix
    app.use("/users", user);
    app.use("/permission", permission);
    app.use("/order", order);
    app.use("/mainInventory", mainInventory);
    app.use("/subInventory", subInventory);
    app.use("/distReq", distributionReq);
    app.use("/prodReq", prodReq);
    app.use("/prodReview", prodReview);
    // app.use(upload);
    app.use("/complaint",Complaint);
    app.use(category);
    app.use(upload);
    app.use(branch);
    app.use("/product", product);
    // app.use("/offlineOrder", offlineOrders);
 
    // Cart routes
    app.use("/api/cart", cartRoutes);
    app.use("/api/order", checkoutRoutes);
    
    app.use("/offlineOrder", offlineOrderRoutes); // Use this line

    app.use((req, res, next) => {
      res.status(404).json({ message: "Route not found" });
    });

    app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).json({ message: err.message });
    });

    // Start server
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });





