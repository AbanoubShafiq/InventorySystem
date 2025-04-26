const mongoose = require('mongoose');

const ComplaintSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: false, 
    },
    email: { 
        type: String,
        required: function () { return !this.user; }, // Required if `user` is not provided
        trim: true,
        lowercase: true, // Ensures email is stored in lowercase
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'], // Email validation
    },
    subject: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        enum: ['Pending', 'In Progress', 'Resolved', 'Rejected'],
        default: 'Pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date
    }
});

// Middleware to update `updatedAt` field before saving
ComplaintSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

const Complaint = mongoose.model('Complaint', ComplaintSchema);

module.exports = Complaint;
