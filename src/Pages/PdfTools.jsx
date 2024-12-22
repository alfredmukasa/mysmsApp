import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { 
  FileImage, 
  FileText, 
  File, 
  Scissors, 
  Minimize 
} from 'lucide-react';
import { motion } from 'framer-motion';

const PDFTools = () => {
  const tools = [

    { 
      title: "PDF to Text", 
      route: "/pdf-to-text", 
      icon: FileText, // Generic File Text Icon
      description: "Extract text content from PDF documents"
    },    
    { 
      title: "Merge PDFs", 
      route: "/merge-pdfs",
      icon: FileText, // Generic File Icon
      description: "Combine multiple PDF files into one"
    },
    { 
      title: "Word to PDF", 
      route: "/word-to-pdf", 
      icon: File, // General File Icon
      description: "Transform Word documents to PDF format"
    },
    { 
      title: "Split PDFs", 
      route: "/split-pdfs", 
      icon: Scissors, // Scissors Icon
      description: "Extract specific pages from a PDF"
    },
    { 
      title: "Compress PDF", 
      route: "/compress-pdf", 
      icon: Minimize, // Minimize Icon
      description: "Reduce PDF file size without quality loss"
    },
    
    { 
      title: "PDF to Image", 
      route: "/pdf-to-image",
      icon: FileImage,
      description: "Convert PDF pages to high-quality images"
    }
  ];

  return (
    <section className="d-flex flex-column min-vh-100">
      <Header />
      <main className="container py-5 flex-grow-1 text-center">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="container py-5 px-4"
        >
          <motion.h1 
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-5 text-primary display-5"
          >
            PDF Toolbox
          </motion.h1>

          <div className="row row-cols-1 row-cols-md-3 g-4">
            {tools.map((tool) => (
              <motion.div
                key={tool.route}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="col"
              >
                <div className="card h-100 shadow-sm border-0 rounded-4 overflow-hidden">
                  <div className="card-body d-flex flex-column align-items-center text-center p-4">
                    <div className="bg-primary-soft rounded-circle p-3 mb-3">
                      {React.createElement(tool.icon, {
                        size: 48,
                        strokeWidth: 1.5,
                        className: "text-primary",
                      })}
                    </div>
                    <h4 className="card-title mb-2">{tool.title}</h4>
                    <p className="card-text text-muted mb-3">{tool.description}</p>
                    <Link 
                      to={tool.route} 
                      className="btn btn-outline-primary mt-auto w-100"
                    >
                      Use Tool
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-center mt-5 text-muted"
          >
            <p>Simplify your PDF workflow with our comprehensive toolset</p>
          </motion.div>
        </motion.div>
      </main>
      <Footer />
    </section>
  );
};

export default PDFTools;
