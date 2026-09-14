{
    title: String,
    description: String,

    price: Number,

    priceType: {
        type: String,
        enum: ["starting", "monthly"]
    },

    isActive: Boolean,

    order: Number,

    createdAt: Date,
    updatedAt: Date
}