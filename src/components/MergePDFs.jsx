import React, { useState, useRef, useCallback } from "react";
import { PDFDocument } from "pdf-lib";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { 
  FaDesktop, 
  FaGoogleDrive, 
  FaDropbox, 
  FaCloud, 
  FaFileUpload,
  FaTrash
} from "react-icons/fa";

import Header from "./Header";
import Footer from "./Footer";

const MergePDFs = () => {
  const [pdfFiles, setPdfFiles] = useState([]);
  const [isMerging, setIsMerging] = useState(false);
  const [mergedPdf, setMergedPdf] = useState(null);
  const [selectedSource, setSelectedSource] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  // Existing PDF validation method
  const validatePDFFile = async (file) => {
    const header = await file.slice(0, 5).text();
    return header === "%PDF-";
  };

  // Process Files
  const processFiles = async (files) => {
    const validFiles = [];

    for (const file of files) {
      if (file.type === "application/pdf") {
        const isValid = await validatePDFFile(file);
        if (isValid) {
          validFiles.push(file);
        } else {
          toast.error(`Invalid PDF file: ${file.name}`);
        }
      } else {
        toast.warning(`Unsupported file type: ${file.name}`);
      }
    }

    if (validFiles.length === 0) {
      toast.error("No valid PDF files selected.");
    } else {
      setPdfFiles((prevFiles) => {
        // Prevent duplicate files
        const uniqueFiles = [...prevFiles, ...validFiles].filter(
          (file, index, self) =>
            index === self.findIndex((f) => f.name === file.name)
        );
        return uniqueFiles;
      });
      toast.success(`${validFiles.length} file(s) uploaded successfully.`);
    }
  };

  // Drag and Drop Handlers
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(async (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const droppedFiles = e.dataTransfer.files;
    await processFiles(Array.from(droppedFiles));
  }, []);

  // Computer File Upload
  const handleFileUpload = async (event) => {
    const files = event.target.files ? Array.from(event.target.files) : [];
    await processFiles(files);
  };

  // Remove Individual File
  const removeFile = (fileName) => {
    setPdfFiles((prevFiles) => 
      prevFiles.filter((file) => file.name !== fileName)
    );
  };

  // Existing merge PDF method
  const mergePDFs = async () => {
    if (pdfFiles.length < 2) {
      toast.error("Please upload at least two PDF files to merge.");
      return;
    }

    setIsMerging(true);
    setMergedPdf(null);
    try {
      const mergedPdfDoc = await PDFDocument.create();

      for (const file of pdfFiles) {
        try {
          const fileData = await file.arrayBuffer();
          const pdfDoc = await PDFDocument.load(fileData);
          const copiedPages = await mergedPdfDoc.copyPages(
            pdfDoc,
            pdfDoc.getPageIndices()
          );
          copiedPages.forEach((page) => mergedPdfDoc.addPage(page));
        } catch (fileError) {
          console.error(`Error processing file: ${file.name}`, fileError);
          toast.error(`Failed to process file: ${file.name}`);
        }
      }

      const mergedPdfBytes = await mergedPdfDoc.save();
      const blob = new Blob([mergedPdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      setMergedPdf(url);
      toast.success("PDFs merged successfully!");
    } catch (err) {
      console.error("Merge Error:", err);
      toast.error("An error occurred while merging PDFs.");
    } finally {
      setIsMerging(false);
    }
  };

  const clearFiles = () => {
    setPdfFiles([]);
    setMergedPdf(null);
    setSelectedSource(null);
    toast.info("Files cleared.");
  };

  return (
    <section 
      className="d-flex flex-column min-vh-100"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <Header />
      <ToastContainer autoClose={3000} />
      <main className="container py-5 flex-grow-1 text-center">
        <h2 className="text-primary mb-4">Merge PDF Files</h2>

        {/* Drag and Drop Area */}
        <div 
          className={`border-dashed p-5 mb-4 ${
            isDragOver ? 'bg-light border-primary' : 'border-secondary'
          }`}
          style={{
            border: '2px dashed',
            borderRadius: '10px',
            transition: 'all 0.3s ease'
          }}
        >
          <input
            type="file"
            ref={fileInputRef}
            className="d-none"
            accept="application/pdf"
            multiple
            onChange={handleFileUpload}
          />
          <div className="text-center">
            <FaFileUpload 
              className={`mb-3 ${isDragOver ? 'text-primary' : 'text-secondary'}`} 
              size={50} 
            />
            <p className="mb-2">
              Drag and Drop PDF Files Here
            </p>
            <p className="text-muted mb-3">
              or <span 
                className="text-primary" 
                style={{cursor: 'pointer'}}
                onClick={() => fileInputRef.current.click()}
              >
                Browse Files
              </span>
            </p>
          </div>
        </div>

        {/* Selected Files List */}
        {pdfFiles.length > 0 && (
          <div className="mb-4">
            <h5 className="text-secondary">Selected PDF Files:</h5>
            <ul className="list-group w-50 mx-auto text-start">
              {pdfFiles.map((file, index) => (
                <li 
                  key={index} 
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  {file.name}
                  <button 
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => removeFile(file.name)}
                  >
                    <FaTrash />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Merge Button */}
        {pdfFiles.length > 0 && !mergedPdf && (
          <button
            className="btn btn-primary mt-3"
            onClick={mergePDFs}
            disabled={isMerging}
          >
            {isMerging ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Merging...
              </>
            ) : (
              "Merge PDFs"
            )}
          </button>
        )}

        {/* Download Section */}
        {mergedPdf && (
          <div className="mt-4">
            <h5 className="text-success">PDFs Merged Successfully!</h5>
            <a
              href={mergedPdf}
              download="merged.pdf"
              className="btn btn-success"
            >
              Download Merged PDF
            </a>
            <button className="btn btn-secondary ms-3" onClick={clearFiles}>
              Clear Files
            </button>
          </div>
        )}
      </main>
      <Footer />
    </section>
  );
};

export default MergePDFs;