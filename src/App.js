import React, { useEffect, useState, useRef } from 'react';
import './App.css';
import VideoCard from './components/VideoCard';
import BottomNavbar from './components/BottomNavbar';
import TopNavbar from './components/TopNavbar';

// Data for videos
const videoUrls = [
  {
    url: require('./videos/video1.mp4'),
    profilePic: 'https://i.pinimg.com/736x/55/6c/aa/556caa0862a70035277cd85ebebddfc9.jpg',
    username: 'csjackie',
    description: 'Lol nvm #compsci #chatgpt #ai #openai #techtok',
    song: 'Original sound - Famed Flames',
    likes: 430,
    comments: 13,
    saves: 23,
    shares: 1,
  },
  {
    url: require('./videos/video2.mp4'),
    profilePic: 'https://p16-sign-va.tiktokcdn.com/tos-maliva-avt-0068/eace3ee69abac57c39178451800db9d5~c5_100x100.jpeg?x-expires=1688479200&x-signature=wAkVmwL7lej15%2B16ypSWQOqTP8s%3D',
    username: 'dailydotdev',
    description: 'Every developer brain @francesco.ciulla #developerjokes #programming #programminghumor #programmingmemes',
    song: 'tarawarolin wants you to know this isnt my sound - Chaplain J Rob',
    likes: '13.4K',
    comments: 3121,
    saves: 254,
    shares: 420,
  },
  {
    url: require('./videos/video3.mp4'),
    profilePic: 'https://i.pinimg.com/736x/55/6c/aa/556caa0862a70035277cd85ebebddfc9.jpg',
    username: 'wojciechtrefon',
    description: '#programming #softwareengineer #vscode #programmerhumor #programmingmemes',
    song: 'help so many people are using my sound - Ezra',
    likes: 5438,
    comments: 238,
    saves: 12,
    shares: 117,
  },
  {
    url: require('./videos/video4.mp4'),
    profilePic: 'https://p16-sign-va.tiktokcdn.com/tos-maliva-avt-0068/4bda52cf3ad31c728153859262c329db~c5_100x100.jpeg?x-expires=1688486400&x-signature=ssUbbCpZFJj6uj33D%2BgtcqxMvgQ%3D',
    username: 'faruktutkus',
    description: 'Wait for the end | Im RTX 4090 TI | #softwareengineer #softwareengineer #coding #codinglife #codingmemes ',
    song: 'orijinal ses - Computer Science',
    likes: 9689,
    comments: 230,
    saves: 1037,
    shares: 967,
  },
];

function App() {
  const [videos, setVideos] = useState([]);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [showUploadInfo, setShowUploadInfo] = useState(false); // Track when to show upload info overlay
  const videoRefs = useRef([]);
  // Ref to track mouse drag coordinates
  const dragRef = useRef({ isDragging: false, startY: 0 });

  useEffect(() => {
    setVideos(videoUrls);
  }, []);

  // Handle scroll and right arrow key to show video info
  useEffect(() => {
    const handleScroll = () => {
      // Optimize: Only set state if it's not already true to avoid re-renders on every scroll event
      setShowUploadInfo((prev) => !prev ? true : prev);
    };

    const handleKeydown = (e) => {
      if (e.key === 'ArrowRight') {
        setShowUploadInfo(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('keydown', handleKeydown);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('keydown', handleKeydown);
    };
  }, []);

  // Hide the upload info after 3 seconds
  useEffect(() => {
    if (showUploadInfo) {
      const timer = setTimeout(() => setShowUploadInfo(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showUploadInfo]);

  // Handle Video Swipe / Key Change
  const handleVideoChange = (direction) => {
    const currentIndex = videos.findIndex((video) => video.url === currentVideo?.url);
    let newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;

    // Boundary checks
    if (newIndex < 0) newIndex = 0;
    if (newIndex >= videos.length) newIndex = videos.length - 1;

    const nextVideo = videos[newIndex];
    if (nextVideo) {
      setCurrentVideo(nextVideo);

      // Programmatically scroll to the next video
      const videoElement = videoRefs.current[newIndex];
      if (videoElement) {
        // Scroll the element into view smoothly
        videoElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  // --- Mouse Drag Logic ---
  const handleMouseDown = (e) => {
    dragRef.current.isDragging = true;
    dragRef.current.startY = e.clientY;
  };

  const handleMouseUp = (e) => {
    if (!dragRef.current.isDragging) return;

    const diff = e.clientY - dragRef.current.startY;
    const threshold = 50; // Minimum distance to trigger swipe

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        // Dragged Down -> Previous Video
        handleVideoChange('previous');
      } else {
        // Dragged Up -> Next Video
        handleVideoChange('next');
      }
    }

    dragRef.current.isDragging = false;
  };

  const handleMouseLeave = () => {
    dragRef.current.isDragging = false;
  };

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.8, // Play when 80% of the video is visible
    };

    const handleIntersection = (entries) => {
      entries.forEach((entry) => {
        const videoElement = entry.target;

        if (entry.isIntersecting) {
          // Play the video
          const playPromise = videoElement.play();
          if (playPromise !== undefined) {
            playPromise.catch((error) => {
              console.log("Auto-play prevented or interrupted:", error);
            });
          }

          // Identify which video is playing and set it as current
          const index = videoRefs.current.indexOf(videoElement);
          if (index !== -1 && videos[index]) {
            setCurrentVideo((prev) => (prev !== videos[index] ? videos[index] : prev));
          }
        } else {
          // Pause the video
          videoElement.pause();
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);

    if (videoRefs.current.length > 0) {
      videoRefs.current.forEach((videoRef) => {
        if (videoRef) observer.observe(videoRef);
      });
    }

    return () => {
      if (observer) observer.disconnect();
    };
  }, [videos]);

  const handleVideoRef = (index) => (ref) => {
    videoRefs.current[index] = ref;
  };

  return (
    <div
      className="app"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      <div className="container">
        <TopNavbar className="top-navbar" />

        {videos.map((video, index) => (
          <VideoCard
            key={index}
            username={video.username}
            description={video.description}
            song={video.song}
            likes={video.likes}
            saves={video.saves}
            comments={video.comments}
            shares={video.shares}
            url={video.url}
            profilePic={video.profilePic}
            setVideoRef={handleVideoRef(index)}
            setCurrentVideo={setCurrentVideo}
            onVideoChange={handleVideoChange} // Pass the missing function
            data={video}
          />
        ))}

        {/* Upload Info Overlay */}
        {showUploadInfo && currentVideo && (
          <div className="upload-info-overlay" style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'rgba(0, 0, 0, 0.8)', // Darker, cleaner background
            backdropFilter: 'blur(8px)', // Glassmorphism effect
            padding: '25px',
            borderRadius: '16px',
            color: 'white',
            zIndex: 1000,
            textAlign: 'center',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)', // Modern shadow
            minWidth: '280px',
            border: '1px solid rgba(255, 255, 255, 0.18)' // Subtle border
          }}>
            <div className="upload-info-content">
              {currentVideo.profilePic && (
                <img
                  src={currentVideo.profilePic}
                  alt="profile"
                  className="upload-info-profile"
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    marginBottom: '15px',
                    border: '2px solid white',
                    objectFit: 'cover'
                  }}
                />
              )}
              <div className="upload-info-details">
                <p style={{ margin: '0 0 5px 0', fontSize: '1.2rem' }}><strong>@{currentVideo.username}</strong></p>
                <p style={{ margin: '0 0 10px 0', fontSize: '0.95rem', opacity: 0.9 }}>{currentVideo.description}</p>
                <p style={{ margin: '0', fontSize: '0.85rem', color: '#ccc', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                  <span>🎵</span> <em>{currentVideo.song}</em>
                </p>
              </div>
            </div>
          </div>
        )}

        <BottomNavbar className="bottom-navbar" />
      </div>
    </div>
  );
}

export default App;