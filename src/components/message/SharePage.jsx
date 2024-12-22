import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Head from 'next/head';

const SharePage = () => {
  const [searchParams] = useSearchParams();
  const message = searchParams.get('message') || '';
  const category = searchParams.get('category') || '';
  const userName = searchParams.get('user') || '';
  const iconUrl = searchParams.get('icon') || '';

  useEffect(() => {
    // Update document title
    document.title = `Shared Message from ${userName}`;
  }, [userName]);

  return (
    <div className="share-page">
      <Head>
        <meta property="og:title" content={`Message shared by ${userName}`} />
        <meta property="og:description" content={message} />
        <meta property="og:image" content={iconUrl} />
        <meta property="og:type" content="website" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`Message shared by ${userName}`} />
        <meta name="twitter:description" content={message} />
        <meta name="twitter:image" content={iconUrl} />
      </Head>

      <div className="share-container">
        <div className="share-card">
          <div className="share-header">
            <img src={iconUrl} alt={category} className="category-icon" />
            <h1 className="category-title">{category}</h1>
          </div>
          
          <div className="share-content">
            <div className="message-bubble">
              <p>{message}</p>
            </div>
            <div className="share-author">
              Shared by {userName}
            </div>
          </div>

          <div className="share-footer">
            <a href="/" className="create-button">
              Create Your Own Message
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SharePage;