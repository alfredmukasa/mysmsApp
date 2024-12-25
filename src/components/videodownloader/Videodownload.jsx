import React, { useState, useRef } from 'react';
import axios from 'axios';
import { saveAs } from 'file-saver';
import { toast } from 'react-toastify';
import { BsLink45Deg, BsDownload, BsPlayCircle, BsEye } from 'react-icons/bs';
import { motion } from 'framer-motion';
import Header from '../Header';
import Footer from '../Footer';

const API_BASE_URL = 'http://localhost:5000';

const VideoDownload = () => {
  const [url, setUrl] = useState('');
  const [videoInfo, setVideoInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [selectedQuality, setSelectedQuality] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const videoRef = useRef(null);

  const handleUrlChange = (e) => {
    const newUrl = e.target.value;
    setUrl(newUrl);
    if (newUrl) {
      fetchVideoInfo(newUrl);
    }
  };

  const fetchVideoInfo = async (videoUrl) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/api-video-info`, { url: videoUrl });
      setVideoInfo(response.data);
      setSelectedQuality(response.data.qualities[0]);
    } catch (error) {
      console.error('Error fetching video info:', error);
      toast.error('Failed to fetch video info');
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = async () => {
    if (!selectedQuality) {
      toast.error('Please select a quality');
      return;
    }

    try {
      setShowPreview(true);
      if (videoRef.current) {
        const response = await axios({
          url: `${API_BASE_URL}/api/preview`,
          method: 'POST',
          data: { url, quality: selectedQuality },
          responseType: 'blob'
        });

        const videoUrl = URL.createObjectURL(response.data);
        videoRef.current.src = videoUrl;
      }
    } catch (error) {
      console.error('Preview error:', error);
      toast.error('Failed to load preview');
    }
  };

  const handleDownload = async () => {
    if (!selectedQuality) {
      toast.error('Please select a quality');
      return;
    }

    setDownloading(true);
    try {
      const response = await axios({
        url: `${API_BASE_URL}/api/download`,
        method: 'POST',
        data: { url, quality: selectedQuality },
        responseType: 'blob'
      });

      const filename = `video-${Date.now()}.mp4`;
      saveAs(response.data, filename);
      toast.success('Download completed!');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Download failed. Only YouTube downloads are currently supported.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex flex-column">
      <Header />
      <div className="container flex-grow-1 d-flex align-items-center justify-content-center py-5">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card shadow-lg w-100" 
          style={{maxWidth: "800px"}}
        >
          <div className="card-header bg-primary text-white">
            <h4 className="mb-0 d-flex align-items-center">
              <BsPlayCircle className="me-2" />
              Universal Video Downloader
            </h4>
          </div>
          
          <div className="card-body">
            <form onSubmit={(e) => e.preventDefault()} className="mb-4">
              <div className="input-group">
                <span className="input-group-text">
                  <BsLink45Deg size={20} />
                </span>
                <input
                  type="url"
                  value={url}
                  onChange={handleUrlChange}
                  placeholder="Paste video URL from YouTube, Twitter, or Instagram"
                  className="form-control form-control-lg"
                />
              </div>
            </form>

            {videoInfo && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mt-4"
              >
                {showPreview && (
                  <div className="ratio ratio-16x9 mb-4 shadow rounded overflow-hidden">
                    <video
                      ref={videoRef}
                      controls
                      className="w-full h-full"
                    >
                      Your browser does not support the video tag.
                    </video>
                  </div>
                )}
                
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="d-flex justify-content-center gap-3"
                >
                  <select
                    value={selectedQuality}
                    onChange={(e) => setSelectedQuality(e.target.value)}
                    className="form-select"
                    style={{width: "auto"}}
                  >
                    {videoInfo.qualities.map(quality => (
                      <option key={quality.quality || quality} value={JSON.stringify(quality)}>
                        {quality.quality || quality}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={handlePreview}
                    disabled={!selectedQuality}
                    className="btn btn-info"
                  >
                    <BsEye className="me-2" />
                    Preview
                  </button>

                  <button
                    onClick={handleDownload}
                    disabled={downloading || !selectedQuality}
                    className="btn btn-success"
                  >
                    <BsDownload className="me-2" />
                    {downloading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        Downloading...
                      </>
                    ) : (
                      'Download'
                    )}
                  </button>
                </motion.div>
                
                {videoInfo.source !== 'youtube' && (
                  <div className="text-center mt-3 text-muted">
                    Note: Direct download is currently only supported for YouTube videos
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default VideoDownload;