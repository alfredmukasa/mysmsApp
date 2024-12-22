import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { saveAs } from 'file-saver';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '../components/Header';
import Footer from '../components/Footer';

const CompressPDF = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileSize, setFileSize] = useState(null);
  const [compressedSize, setCompressedSize] = useState(null);
  const [compressedBlob, setCompressedBlob] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle file input change
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
      setFileSize((file.size / 1024 / 1024).toFixed(2)); // File size in MB
      setCompressedBlob(null); // Reset previous compressed file
      setCompressedSize(null);
    } else {
      toast.error("Please upload a valid PDF file.", { autoClose: 3000 });
    }
  };

  // Compress PDF function
  const compressPDF = async () => {
    if (!selectedFile) {
      toast.warn("Please select a PDF file to compress.", { autoClose: 3000 });
      return;
    }

    try {
      setLoading(true);
      toast.info("Compressing your PDF file, please wait...", { autoClose: 3000 });

      // Read the file
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(selectedFile);

      fileReader.onload = async (e) => {
        const pdfBytes = e.target.result;

        // Load and compress PDF
        const pdfDoc = await PDFDocument.load(pdfBytes);

        // Compress the PDF by optimizing its content streams
        const compressedPdfBytes = await pdfDoc.save({
          useObjectStreams: true, // Enables compression
        });

        // Calculate compressed file size
        const compressedFileSize = (compressedPdfBytes.byteLength / 1024 / 1024).toFixed(2);
        setCompressedSize(compressedFileSize);

        // Prepare compressed file for download
        const blob = new Blob([compressedPdfBytes], { type: "application/pdf" });
        setCompressedBlob(blob);

        toast.success("PDF compressed successfully! Ready to download.", { autoClose: 5000 });
      };

      setLoading(false);
    } catch (error) {
      console.error("Error compressing PDF:", error);
      setLoading(false);
      toast.error("An error occurred while compressing the PDF.");
    }
  };

  // Handle file download
  const handleDownload = () => {
    if (compressedBlob) {
      saveAs(compressedBlob, `compressed-${selectedFile.name}`);
      toast.info("Your compressed PDF has been downloaded.", { autoClose: 3000 });
    }
  };

  return (
    <section>
      <Header />
      <main className="container d-flex flex-column justify-content-center align-items-center vh-100 text-center">
        <h1 className="mb-4 text-primary">Compress PDF</h1>
        <p className="mb-3 text-muted">Upload your PDF file and compress it to reduce its size.</p>

        {/* File Input */}
        <div className="mb-3 w-50">
          <input
            type="file"
            accept="application/pdf"
            className="form-control"
            onChange={handleFileChange}
          />
        </div>

        {/* File Details */}
        {fileSize && (
          <div className="alert alert-info w-50 text-start">
            <strong>Original File Size:</strong> {fileSize} MB
          </div>
        )}

        {/* Compress Button */}
        <button
          onClick={compressPDF}
          className="btn btn-primary mb-3"
          disabled={!selectedFile || loading}
        >
          {loading ? "Compressing..." : "Compress PDF"}
        </button>

        {/* Compressed File Details */}
        {compressedSize && (
          <div className="alert alert-success w-50 text-start">
            <strong>Compressed File Size:</strong> {compressedSize} MB
          </div>
        )}

        {/* Download Button */}
        {compressedBlob && (
          <button
            onClick={handleDownload}
            className="btn btn-success mt-3"
          >
            Download Compressed PDF
          </button>
        )}

        {/* React Toastify Container */}
        <ToastContainer />
      </main>
      <Footer />
    </section>
  );
};

export default CompressPDF;
