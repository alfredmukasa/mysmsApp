import React, { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import * as pdfjsLib from "pdfjs-dist";
import "pdfjs-dist/web/pdf_viewer.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";

const PDFtoImage = () => {
  const [pdfFiles, setPdfFiles] = useState([]); // Stores uploaded files
  const [fileImages, setFileImages] = useState({}); // Stores images for each file
  const [isConverting, setIsConverting] = useState(false);

  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files); // Convert FileList to Array
    const validFiles = files.filter((file) => file.type === "application/pdf");

    if (validFiles.length === 0) {
      toast.error("Please upload valid PDF files.");
      return;
    }

    setPdfFiles((prevFiles) => [...prevFiles, ...validFiles]);
    validFiles.forEach((file) => convertPDFtoImages(file));
  };

  const convertPDFtoImages = async (file) => {
    setIsConverting(true);
    try {
      const fileReader = new FileReader();
      fileReader.onload = async () => {
        const pdfData = new Uint8Array(fileReader.result);
        const pdf = await pdfjsLib.getDocument(pdfData).promise;

        const convertedImages = [];
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 2.0 }); // Adjust scale for image quality

          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          await page.render({ canvasContext: context, viewport }).promise;
          convertedImages.push(canvas.toDataURL("image/png"));
        }

        setFileImages((prevImages) => ({
          ...prevImages,
          [file.name]: convertedImages,
        }));
        toast.success(`Converted ${file.name} successfully!`);
      };
      fileReader.readAsArrayBuffer(file);
    } catch (err) {
      toast.error("Failed to convert one or more PDFs. Please try again.");
      console.error(err);
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <section>
      <Header />
      <main className="container d-flex flex-column justify-content-center align-items-center vh-100 text-center">
      <ToastContainer autoClose={3000} position="top-right" />
        <h2 className="text-primary mb-4">PDF to Image Converter</h2>

        {/* File Upload Section */}
        <div className="mb-4 w-50">
          <label htmlFor="pdf-upload" className="form-label fw-bold">
            Upload Your PDF Files
          </label>
          <input
            type="file"
            className="form-control"
            id="pdf-upload"
            accept="application/pdf"
            multiple
            onChange={handleFileUpload}
          />
        </div>

        {/* Conversion Spinner */}
        {isConverting && (
          <div className="d-flex justify-content-center my-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Converting...</span>
            </div>
          </div>
        )}

        {/* Display Converted Images for Each File */}
        {Object.keys(fileImages).length > 0 && (
          <div className="container mt-4">
            <h3 className="mb-4 text-success">Converted Images</h3>
            {Object.entries(fileImages).map(([fileName, images]) => (
              <div key={fileName} className="mb-5">
                <h5 className="text-secondary mb-3">File: {fileName}</h5>
                <div className="row">
                  {images.map((imgSrc, index) => (
                    <div className="col-md-3 mb-3" key={index}>
                      <div className="card shadow-sm" style={{ animation: "fadeIn 0.5s ease-in-out" }}>
                        <img
                          src={imgSrc}
                          className="card-img-top rounded"
                          alt={`Page ${index + 1}`}
                        />
                        <div className="card-body text-center">
                          <a
                            href={imgSrc}
                            download={`${fileName.replace(".pdf", "")}-page-${index + 1}.png`}
                            className="btn btn-sm btn-outline-primary"
                          >
                            Download Page {index + 1}
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />

      {/* Animations */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </section>
  );
};

export default PDFtoImage;
