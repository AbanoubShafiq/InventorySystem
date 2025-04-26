# Seller Dashboard API Documentation

## Base URL
```http
http://localhost:5000
```

## Authentication (Required for all endpoints except login/register)
Authorization: Bearer <token>

## User Management
### Authentication
#### User Login
```http
POST /users/login
Content-Type: application/json
```
**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```
**Response:**
```json
{
  "token": "string"
}
```

#### User Registration
```http
POST /users/register
Content-Type: application/json
```
**Request Body:**
```json
{
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "password": "string",
  "role": "seller" | "clerk" | "customer",
  "contactNo": "string",
  "address": {
    "street": "string",
    "city": "string",
    "zipCode": "string"
  }
}
```

### User Details
```http
GET /users/getAllUsers
GET /users/getUserById/{id}
GET /users/getUserByEmail/{email}
GET /users/getUsersBasedOnRole/{role}
PUT /users/updateUser/{id}
PUT /users/deactivateUser/{id}
PUT /users/activateUser/{id}
PUT /users/changeUserRole/{id}
DELETE /users/deleteUser/{id}
```

### Password Reset
```http
POST /users/requestPasswordReset/{email}
POST /users/resetPassword
Content-Type: application/json
```
**Request Body:**
```json
{
  "email": "string",
  "token": "string",
  "newPassword": "string"
}
```

---

## Product Management
```http
GET /product/getAllProducts
GET /product/getActiveProducts
GET /product/getDeactivatedProducts
GET /product/getProductById/{id}
GET /product/getProductsByCategory/{id}
```

### Create a New Product
```http
POST /product/createProduct
Content-Type: application/json
```
**Request Body:**
```json
{
    "name": "string",
    "description": "string",
    "price": number,
    "quantity": number,
    "categoryId": "string",
    "sellerId": "string",
    "isActive": boolean,
    "images": ["string"]
}
```

### Update & Toggle Product Status
```http
PUT /product/updateProduct/{id}
POST /product/activeProduct/{id}
POST /product/deactiveProduct/{id}
```

### Upload Product Images
```http
POST /upload
Content-Type: multipart/form-data
```
**Form Data:**
- **Key:** imageUrls
- **Type:** File (multiple)

**Response:**
```json
{
    "success": true,
    "imageUrls": ["string"]
}
```

---

## Category Management
```http
GET /categories
GET /categories/get/active
GET /categories/{id}
GET /categoryByName/{name}
```

### Create & Manage Categories
```http
POST /categories
Content-Type: application/json
```
**Request Body:**
```json
{
  "name": "string",
  "description": "string",
  "isActive": boolean
}
```

```http
PUT /categories/{id}
PUT /categories/toggle/{id}
DELETE /categories/{id}
DELETE /categories
```

---

## Order Management
```http
GET /order/getAllOrders
GET /order/getOrderById/{id}
GET /order/getOrdersByCustomerAndStatus/{customerId}/{status}
GET /order/getOrdersByStatus/{status}
GET /order/getOrderByCustomerId/{id}
```

### Create & Manage Orders
```http
POST /order/createOrder
Content-Type: application/json
```
**Request Body:**
```json
{
  "customerId": "string",
  "items": [
    {
      "productId": "string",
      "quantity": number,
      "price": number,
      "subInventoryId": "string"
    }
  ],
  "status": "string",
  "paymentMethod": "string",
  "customerDetails": {
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "phone": "string",
    "address": {
      "street": "string",
      "city": "string",
      "zipCode": "string"
    }
  }
}
```

```http
PUT /order/changeOrderStatus/{orderId}/{status}
DELETE /order/deleteOrder/{id}
```

---

## Inventory Management
### Sub-Inventory
```http
GET /subInventory/getAllSubInventories
GET /subInventory/getSubInventoriesByBranchName/{branchName}
GET /subInventory/getActiveSubInventoriesByBranchName/{branchName}
GET /subInventory/getDeactiveSubInventoriesByBranchName/{branchName}
```

### Manage Sub-Inventory
```http
POST /subInventory/CreateSubInventory
Content-Type: application/json
```
**Request Body:**
```json
{
  "mainInventory": "string",
  "product": "string",
  "branch": "string",
  "quantity": number,
  "active": boolean
}
```

```http
POST /subInventory/activeSubInventory/{id}
POST /subInventory/deactiveSubInventory/{id}
PUT /subInventory/decreaseSubInventoryQuantity/{id}
PUT /subInventory/increaseSubInventoryQuantity/{id}
```

### Main Inventory
```http
GET /mainInventory/getAllMainInventory
GET /mainInventory/getMainInventoryById/{id}
```

### Manage Main Inventory
```http
POST /mainInventory/createMainInventory
PUT /mainInventory/updateMainInventoryById/{id}
```

---

## Cart Management
```http
GET /api/cart/{userId}
GET /api/cart/{userId}/product/{productId}
POST /api/cart/add
PUT /api/cart/{userId}/product/{productId}
DELETE /api/cart/{userId}/product/{productId}
```

---

## Complaints
```http
GET /complaint/
GET /complaint/{id}
GET /complaint/user/{userId}
POST /complaint/
PUT /complaint/{id}
PUT /complaint/status/{id}
DELETE /complaint/{id}
```
**Request Body:**
```json
{
  "user": "string",
  "subject": "string",
  "description": "string",
  "email": "string"
}
```

---

## Branch Management
```http
GET /branches
GET /branches/get/active
GET /branches/{id}
GET /branchByName/{name}
GET /branchesByType/{type}
```

---



