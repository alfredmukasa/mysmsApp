import React, { useState, useRef } from "react";
import Tesseract from "tesseract.js";
import { Spinner, Button, Card, Form, Dropdown } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from '../components/Header';
import Footer from '../components/Footer';
import { 
  FileText as FileTextIcon, 
  Upload as UploadIcon, 
  ClipboardCopy as CopyIcon, 
  Download as DownloadIcon,
  Link as LinkIcon
} from 'lucide-react';

const ImageToTextConverter = () => {
  const [image, setImage] = useState(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState("eng");
  const fileInputRef = useRef(null);
  const [imageUrl, setImageUrl] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const languages = [
    { code: 'eng', name: 'English' },
    { code: 'fra', name: 'French' },
    { code: 'deu', name: 'German' },
    { code: 'spa', name: 'Spanish' },
    { code: 'chi_sim', name: 'Chinese Simplified' },
    { code: 'ara', name: 'Arabic' }
  ];

  const handleImageChange = (e) => {
    const file = e.target.files?.[0] || (e.dataTransfer?.files && e.dataTransfer.files[0]);
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        setText("");
        toast.info("Image selected successfully!", { position: "top-center" });
      };
      reader.readAsDataURL(file);
    } else {
      toast.warn("Please select a valid image file.", { position: "top-center" });
    }
  };

  const handleImageUpload = () => {
    if (!image) {
      toast.error("Please upload an image first.", { position: "top-center" });
      return;
    }

    setLoading(true);
    toast.info("Processing image, please wait...", { position: "top-center" });

    Tesseract.recognize(image, language, {
      logger: (m) => console.log(m),
    })
      .then(({ data: { text } }) => {
        setText(text || "No text could be extracted.");
        toast.success("Text extracted successfully!", { position: "top-center" });
        setLoading(false);
      })
      .catch((error) => {
        console.error("OCR Error:", error);
        toast.error("An error occurred while extracting text.", { position: "top-center" });
        setLoading(false);
      });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success("Text copied to clipboard!", { position: "top-center" });
    }).catch(err => {
      toast.error("Failed to copy text.", { position: "top-center" });
    });
  };

  const downloadText = () => {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'extracted_text.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Text downloaded successfully!", { position: "top-center" });
  };

  const handleUrlSubmit = async () => {
    if (!imageUrl) {
      toast.error("Please enter an image URL.", { position: "top-center" });
      return;
    }

    try {
      setLoading(true);
      toast.info("Processing image URL, please wait...", { position: "top-center" });

      const urlPattern = /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp))$/i;
      if (!urlPattern.test(imageUrl)) {
        throw new Error("Invalid image URL format");
      }

      const response = await fetch(imageUrl);
      if (!response.ok || !response.headers.get('content-type')?.startsWith('image/')) {
        throw new Error("Invalid image URL or image not accessible");
      }

      setImage(imageUrl);
      setText("");

      await Tesseract.recognize(imageUrl, language, {
        logger: (m) => console.log(m),
      }).then(({ data: { text } }) => {
        setText(text || "No text could be extracted.");
        toast.success("Text extracted successfully!", { position: "top-center" });
      });
    } catch (error) {
      console.error("OCR Error:", error);
      toast.error(error.message || "Failed to process image URL. Please check if the URL is valid.", { position: "top-center" });
    } finally {
      setLoading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleImageChange(e);
  };

  return (
    <section className="d-flex flex-column min-vh-100 bg-light">
      <Header />
      <main className="container py-5 flex-grow-1">
        <ToastContainer />
        
        <Card className="shadow-lg border-0 rounded-4">
          <Card.Header className="bg-gradient text-primary text-center py-4" 
            style={{ background: 'linear-gradient(135deg, #4a90e2 0%, #2c5282 100%)' }}>
            <div className="d-flex justify-content-center align-items-center">
              <FileTextIcon className="me-3" size={30} />
              <h2 className="mb-0 lead display-4 ">Image to Text Converter</h2>
            </div>
          </Card.Header>
          
          <Card.Body className="p-4">
            {/* Language Selection */}
            <div className="mb-4">
              <Form.Label className="fw-semibold mb-2">Select Language</Form.Label>
              <Dropdown onSelect={(eventKey) => setLanguage(eventKey)}>
                <Dropdown.Toggle variant="light" className="w-100 d-flex justify-content-between align-items-center border">
                  {languages.find(lang => lang.code === language)?.name || 'Select Language'}
                </Dropdown.Toggle>
                <Dropdown.Menu className="w-100">
                  {languages.map((lang) => (
                    <Dropdown.Item key={lang.code} eventKey={lang.code}>
                      {lang.name}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </div>

            <div className="row g-4">
              {/* File Upload */}
              <div className="col-md-6">
                <div
                  className={`p-4 rounded-3 bg-light border border-2 border-dashed text-center ${
                    isDragging ? 'border-primary' : ''
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <Form.Group controlId="formFile">
                    <Form.Label className="fw-semibold mb-3">Upload Image</Form.Label>
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      ref={fileInputRef}
                      className="d-none"
                    />
                    <div className="text-muted mb-3">
                      Drag and drop an image here or
                    </div>
                    <Button
                      variant="outline-primary"
                      onClick={() => fileInputRef.current.click()}
                      className="w-100 py-3 d-flex justify-content-center align-items-center"
                    >
                      <UploadIcon className="me-2" /> Select Image
                    </Button>
                  </Form.Group>
                </div>
              </div>

              {/* URL Input */}
              <div className="col-md-6">
                <div className="p-4 rounded-3 bg-light border border-2 border-dashed">
                  <Form.Label className="fw-semibold mb-3">Enter Image URL</Form.Label>
                  <div className="input-group">
                    <Form.Control
                      type="url"
                      placeholder="https://example.com/image.jpg"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className="py-2"
                    />
                    <Button
                      variant="outline-primary"
                      onClick={handleUrlSubmit}
                      disabled={loading}
                      className="px-4"
                    >
                      <LinkIcon className="me-2" /> Process
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Image Preview */}
            {image && (
              <div className="text-center my-4">
                <img
                  src={image}
                  alt="Uploaded Preview"
                  className="rounded-3 shadow-sm"
                  style={{ maxWidth: "300px", height: "auto" }}
                />
              </div>
            )}

            {/* Extract Text Button */}
            <Button 
              variant="primary" 
              onClick={handleImageUpload} 
              disabled={!image || loading}
              className="w-100 py-3 mt-3 mb-4"
              style={{ background: 'linear-gradient(135deg, #4a90e2 0%, #2c5282 100%)', border: 'none' }}
            >
              {loading ? (
                <>
                  <Spinner 
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-2"
                  />
                  Extracting...
                </>
              ) : (
                <>
                  <FileTextIcon className="me-2" /> Extract Text
                </>
              )}
            </Button>

            {/* Text Output */}
            {text && !loading && (
              <div className="mt-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="text-success fw-bold m-0">Extracted Text</h5>
                  <div className="btn-group">
                    <Button 
                      variant="light" 
                      className="d-flex align-items-center border"
                      onClick={copyToClipboard}
                    >
                      <CopyIcon className="me-2" size={16} /> Copy
                    </Button>
                    <Button 
                      variant="light"
                      className="d-flex align-items-center border"
                      onClick={downloadText}
                    >
                      <DownloadIcon className="me-2" size={16} /> Download
                    </Button>
                  </div>
                </div>
                <pre 
                  className="bg-light p-4 border rounded-3" 
                  style={{ 
                    whiteSpace: "pre-wrap", 
                    maxHeight: "300px", 
                    overflowY: "auto",
                    fontSize: "0.95rem",
                    backgroundColor: "#f8f9fa"
                  }}
                >
                  {text}
                </pre>
              </div>
            )}
          </Card.Body>
        </Card>
      </main>
      <Footer />
    </section>
  );
};

export default ImageToTextConverter;