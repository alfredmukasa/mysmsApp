import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, Image, File } from 'lucide-react'; // Use File instead of FilePdf
import Header from '../components/Header';
import Footer from '../components/Footer';

const HomePage = () => {
  const cardVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
  };

  const tools = [
    { 
      title: "Image To Text", 
      route: "/image-to-text", 
      icon: FileText,
      description: "Extract text from images instantly"
    },
    { 
      title: "Image Conversion", 
      route: "/image-conversion", 
      icon: Image,
      description: "Convert and transform images easily"
    },
    { 
      title: "PDF Tools", 
      route: "/pdf-tools", 
      icon: File, // Replace FilePdf with File
      description: "Comprehensive PDF management"
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Header />
      <main className="container py-5 text-center">
        <motion.h1 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="display-4 mb-4 text-primary"
        >
          Powerful Document Transformation
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="lead mb-5 text-muted"
        >
          Transform your documents with ease. AI-powered tools for seamless conversions.
        </motion.p>

        <div className="row justify-content-center g-4">
          {tools.map((tool, index) => (
            <motion.div 
              key={tool.route}
              className="col-md-4"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
            >
              <motion.div 
                variants={cardVariants}
                whileHover="hover"
                whileTap="tap"
                className="card h-100 shadow-sm border-0 rounded-4 overflow-hidden"
              >
                <div className="card-body text-center p-4">
                  <div className="mb-3">
                    {React.createElement(tool.icon, {
                      size: 48,
                      className: "text-primary"
                    })}
                  </div>
                  <h4 className="card-title mb-3">{tool.title}</h4>
                  <p className="text-muted mb-4">{tool.description}</p>
                  <Link 
                    to={tool.route} 
                    className="btn btn-outline-primary w-100"
                  >
                    Get Started
                  </Link>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </main>
      <Footer />
    </motion.div>
  );
};

export default HomePage;
