const mongoose = require("mongoose");


const PermissionSchema = new mongoose.Schema(
    {
        resource: {
            type: String,
            required: true,
        },
        action: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        rolesAllowed: {
            type: [String],
            default: [],
        },
    },
    {
        timestamps: true,
    }
);

const Permission = mongoose.model("Permission", PermissionSchema);

module.exports = Permission;
