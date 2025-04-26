const Order = require('../models/order.model');
const Product = require('../models/product.model');

class CheckoutService {
    async createOrder(orderData) {
        try {
            const orderItems = [];
            let totalPrice = 0;

            for (const item of orderData.items) {
                const product = await Product.findById(item.productId);
                if (!product) {
                    console.error(`Product not found: ${item.productId}`);
                    throw new Error(`Product not found: ${item.productId}`);
                }

                // Check if the requested quantity is available
                if (product.quantity < item.quantity) {
                    console.error(`Insufficient product quantity for product: ${item.productId}`);
                    throw new Error(`Insufficient product quantity for product: ${item.productId}`);
                }

                // Reduce the product quantity
                product.quantity -= item.quantity;
                product.noOfSale += item.quantity;
                await product.save();

                orderItems.push({
                    productId: item.productId,
                    price: product.price,
                    quantity: item.quantity
                });

                totalPrice += product.price * item.quantity;
                
            }

            const order = new Order({
                orderId: Math.floor(Math.random() * 1000000),
                customerId: orderData.customerId,
                items: orderItems,
                totalPrice: totalPrice,
                status: orderData.status || 'pending',
                paymentMethod: orderData.paymentMethod || 'Cash', 
                customerDetails: {
                    firstName: orderData.customerDetails.firstName,
                    lastName: orderData.customerDetails.lastName,
                    address: {
                        street: orderData.customerDetails.address.street,
                        city: orderData.customerDetails.address.city,
                        zipCode: orderData.customerDetails.address.zipCode
                    },
                    email: orderData.customerDetails.email,
                    phone: orderData.customerDetails.phone
                },
                date: new Date(),
                notes: orderData.notes
            });

            return await order.save();
        } catch (error) {
            console.error('Error creating order:', error); 
            throw new Error('Error creating order');
        }
    }
}

module.exports = new CheckoutService();