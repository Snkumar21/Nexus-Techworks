const MarketplaceSchema = new mongoose.Schema({
    label: String,
    heading: String,
    description: String,

    features: [
        {
            title: String,
            description: String,
            order: Number
        }
    ],

    ctaText: String,
    ctaUrl: String,

    sellCard: {
        label: String,
        title: String,
        description: String
    },

    buyCard: {
        label: String,
        title: String,
        description: String
    }
});

module.exports = mongoose.model('Marketplace', MarketplaceSchema);