import React, { useState, useEffect } from "react";
import { Copy, Share2 } from "lucide-react";
import { categoryIcons, predefinedMessages } from './predefinedMessages';
import '../../Styles/MessageGenerator.css';  // Import the CSS file

// Audio URLs (using placeholder URLs - replace with actual audio file URLs)
const AUDIO_URLS = {
  select: "https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3",
  share: "https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3",
  copy: "https://assets.mixkit.co/active_storage/sfx/2570/2570-preview.mp3"
};

// Audio Components
const AudioPlayer = () => {
  const [audio] = useState({
    select: new Audio(AUDIO_URLS.select),
    share: new Audio(AUDIO_URLS.share),
    copy: new Audio(AUDIO_URLS.copy)
  });

  const playSound = (type) => {
    audio[type].currentTime = 0;
    audio[type].play().catch(error => console.log("Audio playback failed:", error));
  };

  return { playSound };
};

// Dialog Components
const Dialog = ({ open, onOpenChange, children }) => {
  if (!open) return null;

  return (
    <div className="modal-backdrop show">
      <div className="modal d-block" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

const DialogContent = ({ children }) => (
  <div className="modal-body">{children}</div>
);

const DialogHeader = ({ children }) => (
  <div className="modal-header border-0 pb-0">
    <h5 className="modal-title">{children}</h5>
  </div>
);

const DialogTitle = ({ children }) => (
  <div className="fw-bold">{children}</div>
);

const Button = ({ variant = "default", className = "", children, ...props }) => {
  const variants = {
    default: "btn-primary",
    outline: "btn-outline-secondary"
  };

  return (
    <button
      className={`btn ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// Highlight matching text
const highlightText = (text, searchTerm) => {
  if (!searchTerm) return text;
  
  const parts = text.split(new RegExp(`(${searchTerm})`, 'gi'));
  
  return (
    <>
      {parts.map((part, index) => 
        part.toLowerCase() === searchTerm.toLowerCase() ? (
          <span key={index} className="highlight">{part}</span>
        ) : (
          part
        )
      )}
    </>
  );
};

const MessageGenerator = () => {
  const [selectedCategory, setSelectedCategory] = useState("greetings");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState("");
  const [userName, setUserName] = useState("");
  const [showCopyAlert, setShowCopyAlert] = useState(false);
  const [filteredMessages, setFilteredMessages] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  
  // Initialize audio player
  const { playSound } = AudioPlayer();

  // Filter messages based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredMessages(predefinedMessages);
      return;
    }

    const searchLower = searchTerm.toLowerCase();
    const filtered = Object.entries(predefinedMessages).reduce((acc, [category, messages]) => {
      const matchingMessages = messages.filter(message =>
        message.toLowerCase().includes(searchLower)
      );
      
      if (category.toLowerCase().includes(searchLower) || matchingMessages.length > 0) {
        acc[category] = matchingMessages.length > 0 ? matchingMessages : messages;
      }
      
      return acc;
    }, {});

    setFilteredMessages(filtered);
  }, [searchTerm]);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    playSound('select');
  };

  const handleShare = (message) => {
    setSelectedMessage(message);
    setIsModalOpen(true);
    playSound('share');
  };

  const handleCopy = async (message) => {
    await navigator.clipboard.writeText(message);
    setShowCopyAlert(true);
    playSound('copy');
    setTimeout(() => setShowCopyAlert(false), 2000);
  };

  const generateShareUrl = async (message, category) => {
    try {
      // Create the share page URL
      const baseUrl = `${window.location.origin}/share`;
      const params = new URLSearchParams({
        message,
        category,
        user: userName,
        icon: categoryIcons[category]
      });
      const sharePageUrl = `${baseUrl}?${params.toString()}`;

      // Get short URL from API
      const response = await fetch('/api/shorten', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url: sharePageUrl })
      });

      const { shortUrl } = await response.json();
      return shortUrl;
    } catch (error) {
      console.error('Error generating share URL:', error);
      return null;
    }
  };

  const handleShareSubmit = async () => {
    const shortUrl = await generateShareUrl(selectedMessage, selectedCategory);
    const messageWithName = `${selectedMessage}\n- Shared by ${userName}`;
    
    if (navigator.share) {
      navigator.share({
        title: `Message from ${userName}`,
        text: messageWithName,
        url: shortUrl
      }).catch(error => console.log('Error sharing:', error));
    } else {
      handleCopy(`${messageWithName}\n${shortUrl || ''}`);
    }
    
    setIsModalOpen(false);
    setUserName('');
    playSound('share');
  };

  return (
    <div className="container mt-4">
      <div className="row">
        {/* Left Column - Categories */}
        <div className="col-lg-4 col-md-4 col-sm-12">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Categories</h5>
              <div className="search-container mt-2">
                <div className="search-wrapper">
                  <input
                    type="text"
                    className="search-input"
                    placeholder="Search categories and messages..."
                    onChange={(e) => setSearchTerm(e.target.value)}
                    value={searchTerm}
                  />
                  <span className="search-icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                  </span>
                </div>
                {searchTerm && Object.keys(filteredMessages).length === 0 && (
                  <div className="text-muted mt-2 text-center">
                    No results found for "{searchTerm}"
                  </div>
                )}
              </div>
            </div>
            <div className="card-body">
              <div className="category-list">
                {Object.keys(filteredMessages).map((category, index) => (
                  <div
                    key={index}
                    className={`category-item p-2 d-flex align-items-center ${
                      category === selectedCategory ? "active" : ""
                    }`}
                    onClick={() => handleCategorySelect(category)}
                  >
                    <div className="category-icon">
                      <img 
                        src={categoryIcons[category]}
                        alt={`${category} icon`}
                        style={{ width: '40px', height: '40px', objectFit: 'contain' }}
                      />
                    </div>
                    <span>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Messages */}
        <div className="col-lg-8 col-md-8 col-sm-12">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">
                {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}{" "}
                Messages
              </h5>
            </div>
            <div className="card-body">
              <div className="row">
                {filteredMessages[selectedCategory]?.map((message, index) => (
                  <div key={index} className="col-md-6">
                    <div className="message-bubble">
                      <p className="mb-0">
                        {searchTerm ? highlightText(message, searchTerm) : message}
                      </p>
                      <div className="message-actions">
                        <Button
                          variant="outline"
                          onClick={() => handleCopy(message)}
                          className="btn-sm"
                        >
                          <Copy className="me-1" size={16} />
                          Copy
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => handleShare(message)}
                          className="btn-sm"
                        >
                          <Share2 className="me-1" size={16} />
                          Share
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <div className="profile-image-container">
            <div className="profile-image">
              <img
                src={categoryIcons[selectedCategory]}
                alt="Category"
                className="w-100 h-100 object-fit-cover"
              />
            </div>
          </div>
          <DialogHeader>
            <DialogTitle>Share Message</DialogTitle>
          </DialogHeader>
          <div className="p-3">
            <div className="mb-4 p-3 bg-light rounded">
              <p className="mb-0">{selectedMessage}</p>
            </div>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Enter your name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>
            <div className="d-flex justify-content-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleShareSubmit}
                disabled={!userName.trim()}
              >
                Share
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Copy Alert */}
      {showCopyAlert && (
        <div className="copy-alert">
          Message copied to clipboard!
        </div>
      )}
    </div>
  );
};

export default MessageGenerator;