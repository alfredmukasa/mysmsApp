import React, { useState, useRef } from 'react';
import { 
  Upload, 
  Computer, 
  CloudUpload, 
  FileText, 
  FilePlus, 
  Download 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { 
  Card, 
  Dropdown, 
  Button, 
  Form, 
  Modal 
} from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import { saveAs } from 'file-saver';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import * as pdfjsLib from 'pdfjs-dist';
import Header from './Header';
import Footer from './Footer';

const PDFtoTextConverter = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [error, setError] = useState("");
  const [isConverting, setIsConverting] = useState(false);
  const [showBrowserModal, setShowBrowserModal] = useState(false);
  const fileInputRef = useRef(null);

  // File browser options
  const fileBrowserOptions = [
    { 
      name: 'Computer', 
      icon: Computer, 
      action: () => fileInputRef.current.click() 
    },
    { 
      name: 'Dropbox', 
      icon: CloudUpload, 
      action: () => handleDropboxUpload() 
    },
    { 
      name: 'Google Drive', 
      icon: FilePlus, 
      action: () => handleGoogleDriveUpload() 
    },
    { 
      name: 'OneDrive', 
      icon: Download, 
      action: () => handleOneDriveUpload() 
    }
  ];

  // Mock file browser methods (would be replaced with actual implementations)
  const handleDropboxUpload = () => {
    toast.info('Dropbox file selection coming soon!');
  };

  const handleGoogleDriveUpload = () => {
    toast.info('Google Drive file selection coming soon!');
  };

  const handleOneDriveUpload = () => {
    toast.info('OneDrive file selection coming soon!');
  };

  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file || file.type !== "application/pdf") {
      toast.error("Please upload a valid PDF file.");
      return;
    }
    setPdfFile(file);
    setShowBrowserModal(false);
  };

  const convertPDFtoWord = async () => {
    if (!pdfFile) {
      toast.error("Please upload a PDF file to convert.");
      return;
    }

    setIsConverting(true);

    try {
      const fileReader = new FileReader();
      fileReader.onload = async () => {
        const pdfData = new Uint8Array(fileReader.result);
        const pdf = await pdfjsLib.getDocument(pdfData).promise;

        const sections = [];
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();

          const pageText = textContent.items
            .map((item) => item.str)
            .join(" ");

          sections.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: `Page ${i}`,
                  bold: true,
                  break: 1,
                }),
                new TextRun(pageText),
              ],
              spacing: { after: 200 },
            })
          );
        }

        // Generate Word document with sections
        const doc = new Document({
          sections: [
            {
              children: sections,
            },
          ],
        });

        const blob = await Packer.toBlob(doc);
        saveAs(blob, "converted.docx");
        toast.success("PDF successfully converted to Word!");
      };
      fileReader.readAsArrayBuffer(pdfFile);
    } catch (err) {
      toast.error("Failed to convert PDF to Word. Please try again.");
      console.error(err);
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <section className="d-flex flex-column min-vh-100">
      <ToastContainer position="top-right" />
      <Header />
      <main className="container py-5 flex-grow-1 text-center">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-primary mb-4">
            <FileText className="me-2" /> Convert PDF to Word
          </h2>
        </motion.div>

        {/* File Input Section */}
        <Card className="shadow-sm mx-auto" style={{ maxWidth: '500px' }}>
          <Card.Body>
            <div className="mb-4">
              <Button 
                variant="outline-primary" 
                onClick={() => setShowBrowserModal(true)}
                className="w-100"
              >
                <Upload className="me-2" /> 
                {pdfFile ? `Selected: ${pdfFile.name}` : 'Select PDF File'}
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                className="d-none"
                accept="application/pdf"
                onChange={handleFileUpload}
              />
            </div>

            {pdfFile && (
              <Button
                variant="primary"
                onClick={convertPDFtoWord}
                disabled={isConverting}
                className="w-100 mt-3"
              >
                {isConverting ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Converting...
                  </>
                ) : (
                  "Convert to Word"
                )}
              </Button>
            )}
          </Card.Body>
        </Card>

        {/* File Browser Modal */}
        <Modal 
          show={showBrowserModal} 
          onHide={() => setShowBrowserModal(false)}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Select File Source</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row">
              {fileBrowserOptions.map((option, index) => (
                <div key={index} className="col-6 mb-3">
                  <Button 
                    variant="outline-primary" 
                    className="w-100 d-flex align-items-center justify-content-center"
                    onClick={option.action}
                  >
                    <option.icon className="me-2" />
                    {option.name}
                  </Button>
                </div>
              ))}
            </div>
          </Modal.Body>
        </Modal>
      </main>
      <Footer />
    </section>
  );
};

export default PDFtoTextConverter;