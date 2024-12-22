import React, { useState } from 'react';
import jsPDF from 'jspdf';
import mammoth from 'mammoth';
import Header from './Header';
import Footer from './Footer';
import { 
  FileEarmarkPdfFill, 
  FileEarmarkWordFill, 
  CloudUploadFill, 
  XCircleFill 
} from 'react-bootstrap-icons';
import { motion, AnimatePresence } from 'framer-motion';

const WordToPDF = () => {
  const [wordFile, setWordFile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file || !file.name.endsWith('.docx')) {
      setError('Please upload a valid Word file (.docx)');
      return;
    }
    setWordFile(file);
    setError('');
    setSuccessMessage('');
  };

  const convertWordToPDF = async () => {
    if (!wordFile) {
      setError('Please upload a Word file first');
      return;
    }

    setError('');
    setSuccessMessage('');
    setLoading(true);

    try {
      const arrayBuffer = await wordFile.arrayBuffer();
      const { value: documentText } = await mammoth.extractRawText({ arrayBuffer });

      const doc = new jsPDF();
      doc.setFontSize(12);
      
      const splitText = doc.splitTextToSize(documentText, 180);
      doc.text(splitText, 15, 20);
      doc.save('converted-document.pdf');

      setLoading(false);
      setSuccessMessage('Document successfully converted to PDF!');
    } catch (err) {
      setError('Conversion failed. Please try again.');
      setLoading(false);
      console.error(err);
    }
  };

  const clearFile = () => {
    setWordFile(null);
    setError('');
    setSuccessMessage('');
  };

  return (
    <section className="d-flex flex-column min-vh-100">
      <Header />
      <main className="container py-5 flex-grow-1 text-center">
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container text-center py-5"
    >
      <motion.h1 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="mb-4 text-primary d-flex justify-content-center align-items-center"
      >
        <FileEarmarkPdfFill className="me-2" /> Word to PDF Converter
      </motion.h1>

      <p className="mb-4 text-muted">Easily convert your Word documents to PDF</p>

      <motion.div 
        className="file-upload-container w-50 mx-auto"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <input
          type="file"
          className="form-control d-none"
          id="file-upload"
          accept=".docx"
          onChange={handleFileUpload}
        />
        <label 
          htmlFor="file-upload" 
          className="btn btn-outline-primary w-100 d-flex align-items-center justify-content-center"
        >
          <CloudUploadFill className="me-2" />
          {wordFile ? 'Change File' : 'Upload Word File'}
        </label>
      </motion.div>

      <AnimatePresence>
        {wordFile && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-3 mt-3 d-flex justify-content-center align-items-center"
          >
            <FileEarmarkWordFill className="me-2 text-primary" />
            <h5 className="text-secondary mb-0">{wordFile.name}</h5>
            <XCircleFill 
              className="ms-2 text-danger cursor-pointer" 
              onClick={clearFile}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="alert alert-danger"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {successMessage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="alert alert-success"
          >
            {successMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {loading && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-3 d-flex flex-column align-items-center"
        >
          <div 
            className="spinner-border text-primary" 
            role="status"
          >
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Converting, please wait...</p>
        </motion.div>
      )}

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="btn btn-primary mt-4 d-flex align-items-center mx-auto"
        onClick={convertWordToPDF}
        disabled={!wordFile || loading}
      >
        <FileEarmarkPdfFill className="me-2" />
        {loading ? 'Converting...' : 'Convert to PDF'}
      </motion.button>
    </motion.div>
    </main>
    <Footer />
    </section>
  );
};

export default WordToPDF;