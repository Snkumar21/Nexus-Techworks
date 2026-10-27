import dotenv from "dotenv";
import mongoose from "mongoose";
import Project from "../models/Project.js";

dotenv.config();

const projects = [
  {
    title: "Nexus Arena",
    category: "Education Platform",
    description: "A digital education platform designed to bring learning resources and courses together in one accessible ecosystem.",
    tech: ["React.js", "Node.js", "MongoDB", "Firebase"],
    status: "Live",
    featured: true,
    link: "https://nexus-arena-zeta.vercel.app/",
    published: true,
    sortOrder: 1,
  },
  {
    title: "ERIC AI Chat Bot",
    category: "AI & Automation",
    description: "An AI-powered conversational platform designed to provide intelligent responses, voice interaction and personalized chat experiences.",
    tech: ["React.js", "Node.js", "MongoDB", "OpenAI"],
    status: "Live",
    featured: true,
    link: "https://eric-chat-bot-3-0.onrender.com",
    published: true,
    sortOrder: 2,
  },
  {
    title: "Prathamesh Builders & Developers",
    category: "Real Estate",
    description: "A modern digital presence designed for a real estate business to showcase projects, services and company information.",
    tech: ["React.js", "Node.js", "MongoDB", "Firebase"],
    status: "Delivered",
    featured: true,
    link: "",
    published: true,
    sortOrder: 3,
  },
  {
    title: "Smart Personal Finance",
    category: "FinTech",
    description: "A personal finance and budgeting application focused on helping users understand and manage their financial activities.",
    tech: ["React.js", "Node.js", "MongoDB"],
    status: "Developed",
    featured: false,
    link: "",
    published: true,
    sortOrder: 4,
  },
  {
    title: "HubVerse",
    category: "Education",
    description: "An education-focused web platform created to organize and present learning resources through a structured digital experience.",
    tech: ["HTML", "CSS", "JavaScript", "Node.js", "MySQL"],
    status: "Developed",
    featured: false,
    link: "",
    published: true,
    sortOrder: 5,
  },
  {
    title: "Nexus Techworks",
    category: "Corporate Website",
    description: "The official digital platform of Nexus Techworks, bringing technology, digital and business solutions together under one brand.",
    tech: ["React.js", "Node.js", "MongoDB"],
    status: "Live",
    featured: true,
    link: "https://nexus-techworks.vercel.app/",
    published: true,
    sortOrder: 6,
  },
];

async function seedProjects() {
  if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI is missing.");

  await mongoose.connect(process.env.MONGODB_URI);
  for (const project of projects) {
    await Project.findOneAndUpdate(
      { title: project.title },
      { $setOnInsert: project },
      { upsert: true, new: true, runValidators: true }
    );
  }

  console.log(`Projects seed complete (${projects.length} records checked).`);
}

seedProjects()
  .catch((error) => {
    console.error("Projects seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect().catch(() => {});
  });
