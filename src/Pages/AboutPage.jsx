import React from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Image, 
  File,      // Replaced FilePdf with File
  Type, 
  Scissors, 
  Layers,    // Replaced Compress with Layers
  Upload, 
  Settings, 
  Download 
} from 'lucide-react';
import { Link } from 'react-router-dom'; // Proper import for navigation
import Header from '../components/Header';
import Footer from '../components/Footer';

// ServiceCard Component
const ServiceCard = ({ icon: Icon, title, description, buttonText, route }) => (
  <motion.div 
    className="col-md-4 mb-4"
    whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
    whileTap={{ scale: 0.95 }}
  >
    <div className="card shadow-lg h-100 border-0">
      <div className="card-body text-center">
        <div className="mb-3 d-flex justify-content-center">
          <Icon className="text-primary" size={64} strokeWidth={1.5} />
        </div>
        <h5 className="card-title text-primary mb-3">{title}</h5>
        <p className="card-text text-muted mb-4">{description}</p>
        <Link to={route} className="btn btn-outline-primary w-100">
          {buttonText}
        </Link>
      </div>
    </div>
  </motion.div>
);

// StepIcon Component
const StepIcon = ({ icon: Icon, title, description }) => (
  <motion.div 
    className="col-md-4 text-center"
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }}
    viewport={{ once: true }}
  >
    <div className="mb-4">
      <Icon className="text-primary" size={64} strokeWidth={1.5} />
    </div>
    <h5 className="text-primary mb-3">{title}</h5>
    <p className="text-muted">{description}</p>
  </motion.div>
);

// AboutPage Component
const AboutPage = () => {
  const serviceGroups = [
    [
      {
        icon: FileText,
        title: "Image to Text",
        description: "Extract text from images instantly using powerful OCR technology.",
        buttonText: "Try Image to Text",
        route: "/image-to-text", 
      },
      {
        icon: Image,
        title: "Image Conversion",
        description: "Transform and convert images with ease and precision.",
        buttonText: "Try Image Conversion",
        route: "/image-conversion", 
      },
      {
        icon: File, // Replaced FilePdf with File
        title: "PDF Tools",
        description: "Comprehensive PDF management from merging to conversion.",
        buttonText: "Explore PDF Tools",
        route: "/pdf-tools"
      }
    ],
    [
      {
        icon: Type,
        title: "PDF to Image",
        description: "Convert PDF pages to high-quality images effortlessly.",
        buttonText: "Try PDF to Image",
        route: "/pdf-to-image"
      },
      {
        icon: Layers, // Replaced Compress with Layers
        title: "Merge PDFs",
        description: "Combine multiple PDF files into one seamless document.",
        buttonText: "Try Merge PDFs",
        route: "/merge-pdfs"
      },
      {
        icon: Scissors,
        title: "Split PDFs",
        description: "Extract specific pages from large PDF documents.",
        buttonText: "Try Split PDFs",
        route: "/split-pdfs"
      }
    ]
  ];

  return (
    <motion.section 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="container py-5">
        {/* Header Section */}
        <motion.div 
          className="text-center mb-5"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="display-4 text-primary">Document Transformation Tools</h1>
          <p className="lead text-muted">
            AI-powered solutions to streamline your document workflows
          </p>
        </motion.div>

        {/* Services Section */}
        {serviceGroups.map((group, groupIndex) => (
          <motion.section 
            key={groupIndex} 
            className="row justify-content-center mb-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1, transition: { staggerChildren: 0.1, duration: 0.5 } }}
            viewport={{ once: true }}
          >
            {group.map((service, index) => (
              <ServiceCard key={index} {...service} />
            ))}
          </motion.section>
        ))}

        {/* How It Works Section */}
        <motion.section 
          className="mt-5"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1, transition: { duration: 0.5 } }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-5">
            <h3 className="text-primary">How It Works</h3>
            <p className="lead text-muted">
              Simple, fast, and intelligent document transformation
            </p>
          </div>

          <div className="row justify-content-center">
            <StepIcon 
              icon={Upload}
              title="Upload Files"
              description="Select the documents you want to transform"
            />
            <StepIcon 
              icon={Settings}
              title="Process"
              description="Advanced AI processes your files instantly"
            />
            <StepIcon 
              icon={Download}
              title="Download"
              description="Get your transformed documents with a single click"
            />
          </div>
        </motion.section>
      </main>

      {/* Footer */}
      <Footer />
    </motion.section>
  );
};

export default AboutPage;
