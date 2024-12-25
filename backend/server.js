const express = require('express');
const cors = require('cors');
const ytdl = require('ytdl-core');
const app = express();

app.use(cors({
  origin: ['http://localhost:5174', 'http://localhost:5000', 'http://localhost:3000'],
  methods: ['GET', 'POST'],
  credentials: true
}));
app.use(express.json());

const getVideoSource = (url) => {
  if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
  if (url.includes('twitter.com')) return 'twitter';
  if (url.includes('instagram.com')) return 'instagram';
  return 'unknown';
};

app.post('/api/video-info', async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ message: 'URL is required' });

    const source = getVideoSource(url);
    let videoInfo;

    switch (source) {
      case 'youtube':
        if (!ytdl.validateURL(url)) {
          return res.status(400).json({ message: 'Invalid YouTube URL' });
        }
        const info = await ytdl.getInfo(url);
        const formats = info.formats.filter(format => {
          return format.hasVideo && format.hasAudio && format.container === 'mp4';
        });

        const qualities = formats
          .map(format => ({
            quality: format.qualityLabel,
            itag: format.itag
          }))
          .filter((value, index, self) => 
            index === self.findIndex(t => t.quality === value.quality)
          );

        videoInfo = {
          title: info.videoDetails.title,
          thumbnail: info.videoDetails.thumbnails[0].url,
          duration: info.videoDetails.lengthSeconds,
          qualities: qualities.sort((a, b) => {
            const aNum = parseInt(a.quality);
            const bNum = parseInt(b.quality);
            return bNum - aNum;
          }),
          source
        };
        break;

      case 'twitter':
      case 'instagram':
        videoInfo = {
          title: `${source.charAt(0).toUpperCase() + source.slice(1)} Video`,
          qualities: ['default'],
          source
        };
        break;

      default:
        return res.status(400).json({ message: 'Unsupported video platform' });
    }

    res.json(videoInfo);
  } catch (error) {
    console.error('Video info error:', error);
    res.status(500).json({ message: 'Failed to fetch video info' });
  }
});

app.post('/api/preview', async (req, res) => {
  try {
    const { url, quality } = req.body;
    if (!url || !quality) {
      return res.status(400).json({ message: 'URL and quality are required' });
    }

    const source = getVideoSource(url);
    
    if (source === 'youtube') {
      const info = await ytdl.getInfo(url);
      const format = info.formats.find(f => 
        f.qualityLabel === quality.quality && 
        f.hasVideo && 
        f.hasAudio && 
        f.container === 'mp4'
      );

      if (!format) {
        return res.status(404).json({ message: 'Selected quality not available' });
      }

      res.header('Content-Type', 'video/mp4');
      ytdl(url, { format }).pipe(res);
    } else {
      return res.status(400).json({ 
        message: 'Preview currently supported only for YouTube videos' 
      });
    }
  } catch (error) {
    console.error('Preview error:', error);
    res.status(500).json({ message: 'Failed to load preview' });
  }
});

app.post('/api/download', async (req, res) => {
  try {
    const { url, quality } = req.body;
    if (!url || !quality) {
      return res.status(400).json({ message: 'URL and quality are required' });
    }

    const source = getVideoSource(url);
    
    if (source === 'youtube') {
      const info = await ytdl.getInfo(url);
      const format = info.formats.find(f => 
        f.qualityLabel === quality.quality && 
        f.hasVideo && 
        f.hasAudio && 
        f.container === 'mp4'
      );

      if (!format) {
        return res.status(404).json({ message: 'Selected quality not available' });
      }

      const sanitizedTitle = info.videoDetails.title.replace(/[^\w\s-]/g, '');
      res.header('Content-Disposition', `attachment; filename="${sanitizedTitle}.mp4"`);
      ytdl(url, { format }).pipe(res);
    } else {
      return res.status(400).json({ 
        message: 'Direct download currently supported only for YouTube videos' 
      });
    }
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ message: 'Failed to download video' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});