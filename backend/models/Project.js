const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProjectSchema = new Schema({
    title: String,
    slug: String,
    category: String,
    description: String,

    image: String,

    technologies: [String],

    projectUrl: String,

    isFeatured: Boolean,
    isActive: Boolean,

    order: Number,

    createdAt: Date,
    updatedAt: Date
});

module.exports = mongoose.model('Project', ProjectSchema);