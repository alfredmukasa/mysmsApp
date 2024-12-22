import React, { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { PDFDocument } from "pdf-lib";
import { saveAs } from "file-saver";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { FileUp, Scissors, Download } from 'lucide-react';

const SplitPDFs = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [pageRange, setPageRange] = useState("");
  const [isSplitting, setIsSplitting] = useState(false);
  const [splitFiles, setSplitFiles] = useState([]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file || file.type !== "application/pdf") {
      toast.error("Please upload a valid PDF file.");
      return;
    }
    setPdfFile(file);
    setSplitFiles([]);
    toast.success("PDF file uploaded successfully!");
  };

  const handleSplitPDF = async () => {
    if (!pdfFile) {
      toast.error("Please upload a PDF file.");
      return;
    }

    if (!pageRange.trim()) {
      toast.error("Please specify valid page ranges (e.g., '1-2,4').");
      return;
    }

    setIsSplitting(true);
    setSplitFiles([]);
    toast.info("Splitting PDF, please wait...");

    try {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(pdfFile);

      fileReader.onload = async () => {
        const pdfData = new Uint8Array(fileReader.result);
        const pdfDoc = await PDFDocument.load(pdfData);

        const ranges = pageRange
          .split(",")
          .map((range) => range.split("-").map(Number));

        const splitFilesList = [];

        for (let i = 0; i < ranges.length; i++) {
          const [start, end] = ranges[i];
          const splitPdf = await PDFDocument.create();

          for (let pageIndex = start - 1; pageIndex < (end || start); pageIndex++) {
            const [copiedPage] = await splitPdf.copyPages(pdfDoc, [pageIndex]);
            splitPdf.addPage(copiedPage);
          }

          const splitPdfBytes = await splitPdf.save();
          const fileName = `split-${start}-${end || start}.pdf`;
          const blob = new Blob([splitPdfBytes], { type: "application/pdf" });

          splitFilesList.push({ name: fileName, blob });
        }

        setSplitFiles(splitFilesList);
        toast.success("PDF split successfully!");
      };
    } catch (err) {
      console.error(err);
      toast.error("Failed to split PDF. Please check the file and ranges.");
    } finally {
      setIsSplitting(false);
    }
  };

  const handleDownload = (file) => {
    saveAs(file.blob, file.name);
    toast.info(`Downloading ${file.name}`);
  };

  return (
    <div className="min-vh-100 bg-light">
      <Header />
      <ToastContainer autoClose={3000} position="top-right" />
      
      <main className="container py-5">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-8">
            <div className="text-center mb-4 mt-5">
              <h1 className="display-5 lead text-primary mb-2">Split PDF Files</h1>
              <p className="text-muted">Split your PDF documents into multiple files with ease</p>
            </div>

            <div className="card shadow-sm mb-4">
              <div className="card-body p-4">
                {/* Upload Section */}
                <div className="border border-2 border-dashed rounded-3 p-4 text-center mb-4">
                  <FileUp className="text-primary mb-3" size={48} />
                  <div className="mb-3">
                    <label className="form-label">
                      <span className="d-block mb-2">Choose a PDF file to split</span>
                      <input
                        type="file"
                        className="form-control"
                        accept="application/pdf"
                        onChange={handleFileUpload}
                      />
                    </label>
                  </div>
                  {pdfFile && (
                    <div className="alert alert-success py-2 mb-0">
                      Selected: <strong>{pdfFile.name}</strong>
                    </div>
                  )}
                </div>

                {/* Page Range Input */}
                <div className="mb-4">
                  <label className="form-label">Page Ranges</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Example: 1-3,5,7-9"
                    value={pageRange}
                    onChange={(e) => setPageRange(e.target.value)}
                  />
                  <div className="form-text">
                    Specify page ranges separated by commas (e.g., "1-3,5,7-9")
                  </div>
                </div>

                {/* Split Button */}
                <div className="text-center">
                  <button
                    className="btn btn-primary btn-lg d-inline-flex align-items-center"
                    onClick={handleSplitPDF}
                    disabled={isSplitting || !pdfFile}
                  >
                    {isSplitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Processing...
                      </>
                    ) : (
                      <>
                        <Scissors className="me-2" size={20} />
                        Split PDF
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Results Section */}
            {splitFiles.length > 0 && (
              <div className="card shadow-sm">
                <div className="card-header bg-white">
                  <h5 className="card-title mb-0">Split Files Ready for Download</h5>
                </div>
                <div className="card-body">
                  <div className="list-group">
                    {splitFiles.map((file, index) => (
                      <div key={index} className="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
                        <span className="me-3">{file.name}</span>
                        <button
                          className="btn btn-outline-primary btn-sm d-inline-flex align-items-center"
                          onClick={() => handleDownload(file)}
                        >
                          <Download size={16} className="me-2" />
                          Download
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SplitPDFs;