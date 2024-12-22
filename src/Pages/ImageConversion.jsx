import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import { useDropzone } from 'react-dropzone';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { 
  FileText, File, Image as ImageIcon, FileCode, 
  FileArchive, FileAudio, FileVideo, FileSpreadsheet 
} from 'lucide-react';

function ImageConversion() {
  const [files, setFiles] = useState([]);
  const [convertedFiles, setConvertedFiles] = useState([]);
  const [selectedFormat, setSelectedFormat] = useState('pdf');

  // Comprehensive file type mapping
  const FILE_TYPES = {
    icons: {
      default: <File className="text-muted" />,
      image: <ImageIcon className="text-primary" />,
      pdf: <FileText className="text-danger" />,
      code: <FileCode className="text-info" />,
      document: <FileText className="text-warning" />,
      archive: <FileArchive className="text-secondary" />,
      audio: <FileAudio className="text-success" />,
      video: <FileVideo className="text-purple-500" />,
      spreadsheet: <FileSpreadsheet className="text-green-500" />
    },
    formats: {
      images: [
        'jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 
        'tiff', 'svg', 'raw', 'heic', 'avif'
      ],
      documents: [
        'doc', 'docx', 'txt', 'rtf', 'odt', 
        'pages', 'md', 'html', 'xml'
      ],
      spreadsheets: [
        'xls', 'xlsx', 'csv', 'ods', 
        'numbers', 'tsv'
      ],
      pdfs: ['pdf'],
      archives: [
        'zip', 'rar', '7z', 'tar', 
        'gz', '7zip', 'bz2'
      ],
      audio: [
        'mp3', 'wav', 'ogg', 'flac', 
        'm4a', 'wma', 'aac', 'alac'
      ],
      video: [
        'mp4', 'avi', 'mov', 'wmv', 
        'flv', 'mkv', 'webm', 'mpeg'
      ],
      code: [
        'html', 'css', 'js', 'py', 
        'cpp', 'java', 'php', 'json', 
        'xml', 'ts', 'scss', 'less'
      ]
    }
  };

  // Determine file icon based on extension
  const getFileIcon = (file) => {
    const extension = file.name.split('.').pop().toLowerCase();
    
    for (const [type, formats] of Object.entries(FILE_TYPES.formats)) {
      if (formats.includes(extension)) {
        return FILE_TYPES.icons[type.slice(0, -1)] || FILE_TYPES.icons.default;
      }
    }
    
    return FILE_TYPES.icons.default;
  };

  // Dropzone file handler with advanced configuration
  const onDrop = useCallback((acceptedFiles) => {
    // Optional: File size validation (50MB limit)
    const MAX_FILE_SIZE = 50 * 1024 * 1024;
    const validFiles = acceptedFiles.filter(file => file.size <= MAX_FILE_SIZE);

    if (validFiles.length !== acceptedFiles.length) {
      toast.warn(`Some files exceeded ${MAX_FILE_SIZE / 1024 / 1024}MB limit and were skipped.`);
    }

    const newFiles = validFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      icon: getFileIcon(file)
    }));

    setFiles(prevFiles => [...prevFiles, ...newFiles]);
    toast.success(`${validFiles.length} file(s) added!`, {
      position: "top-right",
      autoClose: 3000,
    });
  }, []);

  // Dropzone configuration
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: Object.fromEntries(
      Object.entries(FILE_TYPES.formats).map(([type, formats]) => 
        [type, formats.map(f => `.${f}`)]
      )
    ),
    multiple: true
  });

  // Remove individual file
  const removeFile = (fileToRemove) => {
    setFiles(prevFiles => 
      prevFiles.filter(fileObj => fileObj.file !== fileToRemove)
    );
  };

  // Simulated file conversion
  const convertFiles = () => {
    if (!files.length) {
      toast.error('No files to convert!');
      return;
    }

    const converted = files.map((fileObj, index) => ({
      id: index,
      name: `${fileObj.file.name.split('.')[0]}.${selectedFormat}`,
      originalFile: fileObj.file,
      icon: getFileIcon(fileObj.file)
    }));

    setConvertedFiles(converted);
    toast.success('Files converted successfully!', {
      position: "top-right",
      autoClose: 3000,
    });
  };

  // Download all converted files
  const downloadAllFiles = () => {
    convertedFiles.forEach(file => {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(file.originalFile);
      link.download = file.name;
      link.click();
    });
  };

  return (
    <section className="d-flex flex-column min-vh-100">
        <Header />
        <main className="container py-5 flex-grow-1 text-center">
      <ToastContainer />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="row justify-content-center"
      >
        <div className="col-md-10 col-lg-8">
          <div 
            className="card shadow-lg border-0" 
            style={{ 
              borderRadius: '15px', 
              overflow: 'hidden' 
            }}
          >
            {/* Animated Header */}
            <motion.div 
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="card-header bg-primary text-white text-center py-4"
            >
              <h1 className="h3 mb-2">Universal File Converter</h1>
              <p className="text-white-50 mb-0">
                Convert files across multiple formats seamlessly
              </p>
            </motion.div>

            <div className="card-body p-4">
              {/* Dropzone */}
              <motion.div 
                {...getRootProps()}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`
                  dropzone text-center border-dashed p-4 mb-4
                  ${isDragActive ? 'border-primary bg-light' : 'border-secondary'}
                `}
                style={{
                  border: '2px dashed',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                <input {...getInputProps()} />
                <div className="mb-3">
                  <FileText 
                    size={50} 
                    className="text-muted mx-auto" 
                    strokeWidth={1.5} 
                  />
                </div>
                <p className="text-muted">
                  Drag & drop files here, or <span className="text-primary fw-bold">click to select</span>
                </p>
              </motion.div>

              {/* Conversion Options */}
              <div className="row mb-4 g-3 align-items-center">
                <div className="col-md-4">
                  <label className="form-label mb-0">Convert to:</label>
                </div>
                <div className="col-md-4">
                  <select 
                    className="form-select" 
                    value={selectedFormat} 
                    onChange={(e) => setSelectedFormat(e.target.value)}
                  >
                    <optgroup label="Images">
                      {FILE_TYPES.formats.images.map(format => (
                        <option key={format} value={format}>
                          {format.toUpperCase()}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Documents">
                      {FILE_TYPES.formats.documents.map(format => (
                        <option key={format} value={format}>
                          {format.toUpperCase()}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Other">
                      {['pdf', 'mp3', 'mp4'].map(format => (
                        <option key={format} value={format}>
                          {format.toUpperCase()}
                        </option>
                      ))}
                    </optgroup>
                  </select>
                </div>
                <div className="col-md-4">
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={convertFiles}
                    className="btn btn-primary w-100"
                  >
                    Convert Files
                  </motion.button>
                </div>
              </div>

              {/* Uploaded Files List */}
              <AnimatePresence>
                {files.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-4"
                  >
                    <h5 className="mb-3">Uploaded Files</h5>
                    <motion.ul 
                      layout 
                      className="list-group"
                    >
                      {files.map((fileObj, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -50 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 50 }}
                          transition={{ delay: index * 0.1 }}
                          className="list-group-item d-flex justify-content-between align-items-center"
                        >
                          <div className="d-flex align-items-center">
                            <span className="me-3">{fileObj.icon}</span>
                            {fileObj.file.name}
                          </div>
                          <motion.button 
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => removeFile(fileObj.file)}
                            className="btn btn-sm btn-outline-danger"
                          >
                            Remove
                          </motion.button>
                        </motion.li>
                      ))}
                    </motion.ul>
                  </motion.div>
                )}

                {/* Converted Files List */}
                {convertedFiles.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h5 className="mb-0">Converted Files</h5>
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={downloadAllFiles}
                        className="btn btn-success"
                      >
                        Download All
                      </motion.button>
                    </div>
                    <motion.ul 
                      layout
                      className="list-group"
                    >
                      {convertedFiles.map((file) => (
                        <motion.li
                          key={file.id}
                          initial={{ opacity: 0, x: 50 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -50 }}
                          className="list-group-item d-flex justify-content-between align-items-center"
                        >
                          <div className="d-flex align-items-center">
                            <span className="me-3">{file.icon}</span>
                            {file.name}
                          </div>
                        </motion.li>
                      ))}
                    </motion.ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>
    </main>
    <Footer />
    </section>
  );
}

export default ImageConversion;