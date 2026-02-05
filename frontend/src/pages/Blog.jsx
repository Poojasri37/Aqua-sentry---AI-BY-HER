import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowRight } from 'lucide-react';
import Navbar from '../components/landing/Navbar';
import Footer from '../components/landing/Footer';

const blogPosts = [
    {
        title: "AI-Powered Water Quality Prediction: A Game Changer for Indian Municipalities",
        excerpt: "Discover how machine learning is revolutionizing water quality forecasting and helping prevent contamination before it happens.",
        author: "Dr. Priya Sharma",
        date: "January 28, 2026",
        category: "AI & Technology",
        image: "https://images.unsplash.com/photo-1581093458791-9d42e2d0c6f6?w=800&q=80"
    },
    {
        title: "Jal Jeevan Mission: How Technology is Ensuring Safe Water for All",
        excerpt: "Exploring the role of IoT and AI in achieving the government's ambitious goal of universal water access.",
        author: "Rajesh Kumar",
        date: "January 20, 2026",
        category: "Policy & Impact",
        image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&q=80"
    },
    {
        title: "Predictive Maintenance: Reducing Water Infrastructure Costs by 40%",
        excerpt: "Case study on how AI-driven maintenance scheduling is saving municipalities millions in repair costs.",
        author: "Anjali Mehta",
        date: "January 15, 2026",
        category: "Case Studies",
        image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&q=80"
    },
    {
        title: "Vision AI for Water Quality: Seeing What Sensors Can't Detect",
        excerpt: "How computer vision is complementing traditional sensors to identify contamination through image analysis.",
        author: "Dr. Vikram Singh",
        date: "January 10, 2026",
        category: "AI & Technology",
        image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&q=80"
    },
    {
        title: "BIS Standards Compliance Made Easy with Automated Reporting",
        excerpt: "Simplifying IS 10500 compliance for water utilities through intelligent automation.",
        author: "Meera Patel",
        date: "January 5, 2026",
        category: "Compliance",
        image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80"
    },
    {
        title: "Real-Time Heatmaps: Visualizing Water Quality Across Your City",
        excerpt: "Learn how GIS integration provides instant visibility into water quality distribution patterns.",
        author: "Arjun Reddy",
        date: "December 28, 2025",
        category: "Features",
        image: "https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&q=80"
    }
];

const Blog = () => {
    return (
        <div className="min-h-screen bg-gray-50 text-gray-900">
            <Navbar />
            <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-bold mb-6"
                    >
                        AquaSentry <span className="text-gradient">Blog</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-gray-600 max-w-3xl mx-auto"
                    >
                        Insights on water management, AI technology, and sustainable infrastructure
                    </motion.p>
                </div>

                {/* Featured Post */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden mb-12 hover:shadow-xl transition-shadow"
                >
                    <div className="md:flex">
                        <div className="md:w-1/2">
                            <img
                                src={blogPosts[0].image}
                                alt={blogPosts[0].title}
                                className="w-full h-64 md:h-full object-cover"
                            />
                        </div>
                        <div className="md:w-1/2 p-8">
                            <span className="text-xs font-semibold text-gov-green-700 uppercase tracking-wide">Featured</span>
                            <h2 className="text-3xl font-bold text-gray-900 mt-2 mb-4">{blogPosts[0].title}</h2>
                            <p className="text-gray-600 mb-6">{blogPosts[0].excerpt}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                                <div className="flex items-center gap-2">
                                    <User className="w-4 h-4" />
                                    {blogPosts[0].author}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    {blogPosts[0].date}
                                </div>
                            </div>
                            <button className="flex items-center gap-2 text-gov-green-700 font-semibold hover:text-gov-green-800 transition-colors">
                                Read More <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Blog Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {blogPosts.slice(1).map((post, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1"
                        >
                            <img
                                src={post.image}
                                alt={post.title}
                                className="w-full h-48 object-cover"
                            />
                            <div className="p-6">
                                <span className="text-xs font-semibold text-gov-green-700 uppercase tracking-wide">{post.category}</span>
                                <h3 className="text-xl font-bold text-gray-900 mt-2 mb-3">{post.title}</h3>
                                <p className="text-gray-600 text-sm mb-4">{post.excerpt}</p>
                                <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                                    <div className="flex items-center gap-1">
                                        <User className="w-3 h-3" />
                                        {post.author}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        {post.date}
                                    </div>
                                </div>
                                <button className="flex items-center gap-2 text-gov-green-700 font-semibold text-sm hover:text-gov-green-800 transition-colors">
                                    Read More <ArrowRight className="w-3 h-3" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Blog;
