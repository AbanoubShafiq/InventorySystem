const Joi = require('joi');
const mongoose = require('mongoose');

const productValidationSchema = Joi.object({
  name: Joi.string().required().trim()
    .messages({
      'string.empty': 'Product name cannot be empty',
      'any.required': 'Product name is required'
    }),
  price: Joi.number().required().min(0)
    .messages({
      'number.base': 'Price must be a number',
      'number.min': 'Price cannot be negative',
      'any.required': 'Price is required'
    }),
  quantity: Joi.number().required().min(0)
    .messages({
      'number.base': 'Quantity must be a number',
      'number.min': 'Quantity cannot be negative',
      'any.required': 'Quantity is required'
    }),
  description: Joi.string().allow('').optional(),
  categoryId: Joi.string().required().custom((value, helpers) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      return helpers.message('Invalid category ID format');
    }
    return value;
  }),
  // Make supplierId required but allow null
  supplierId: Joi.string().required().custom((value, helpers) => {
    if (value && !mongoose.Types.ObjectId.isValid(value)) {
      return helpers.message('Invalid supplier ID format');
    }
    return value;
  }),
  // Make sellerId required
  sellerId: Joi.string().required().custom((value, helpers) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      return helpers.message('Invalid seller ID format');
    }
    return value;
  }),
  isActive: Joi.boolean().default(true)
}).messages({
  'string.base': '{{#label}} must be a string',
  'number.base': '{{#label}} must be a number',
  'any.required': '{{#label}} is required'
});

const validateProduct = async (req, res, next) => {
  try {
    console.log('Validating product data:', req.body);
    
    // Convert categoryId to string if it's an object
    if (req.body.categoryId && typeof req.body.categoryId === 'object') {
      req.body.categoryId = req.body.categoryId._id;
    }
    
    const validatedData = await productValidationSchema.validateAsync(req.body, {
      abortEarly: false,
      stripUnknown: true
    });
    
    req.body = validatedData;
    next();
  } catch (err) {
    console.error('Validation error:', err);
    if (err.isJoi) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: err.details.map(detail => ({
          field: detail.path[0],
          message: detail.message
        }))
      });
    }
    return res.status(500).json({ message: 'Internal server error during validation' });
  }
};

module.exports = validateProduct;