import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './Pages/HomePage';
import ImageToText from './Pages/ImageToText';
import AboutPage from './Pages/AboutPage';
import ImageConversion from './Pages/ImageConversion';
import PDFTools from './Pages/PdfTools';
// components
import PDFtoImage from './components/PDFtoImage';
import MergePDFs from './components/MergePDFs';
import WordtoPDF from './components/WordtoPdf';
import SplitPDFs from './components/SplitPDFs';
import CompressPDF from './components/CompressPDF';
import PDFtoText from './components/PDFtoText';

// Import message components
import MessageApp from './components/message/MessageApp';
import MessageGenerator from './components/message/MessageGenerator';
// video downloader
import VideoDownload from './components/videodownloader/Videodownload';
const App = () => (
  <Router>
    <Routes>
      {/* Existing routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/image-to-text" element={<ImageToText />} />
      <Route path="/pdf-tools" element={<PDFTools />} />
      <Route path="/image-conversion" element={<ImageConversion />} />
      <Route path="/about" element={<AboutPage />} />
      
      {/* PDF tool routes */}
      <Route path="/pdf-to-image" element={<PDFtoImage />} />
      <Route path="/merge-pdfs" element={<MergePDFs />} />
      <Route path="/word-to-pdf" element={<WordtoPDF />} />
      <Route path="/split-pdfs" element={<SplitPDFs />} />
      <Route path="/compress-pdf" element={<CompressPDF />} />
      <Route path="/pdf-to-text" element={<PDFtoText />} />

      {/* video downloader */}
      <Route path="/video-downloader" element={<VideoDownload />} />
      {/* Message app routes */}
      <Route path="/messages" element={<MessageApp />}>
        <Route path="generate" element={<MessageGenerator />} />
      </Route>
    </Routes>
  </Router>
);

export default App;
