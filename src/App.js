import React, { useState, useEffect, useRef } from 'react';
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
  const [filteredVideos, setFilteredVideos] = useState(videoUrls);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentVideo, setCurrentVideo] = useState(null);
  const [showUploadInfo, setShowUploadInfo] = useState(false);
  const videoRefs = useRef([]);
  const dragRef = useRef({ isDragging: false, startY: 0 });

  useEffect(() => {
    setVideos(videoUrls);
    if (videoUrls.length > 0) {
      setCurrentVideo(videoUrls[0]);
    }
  }, []);

  // Hàm hiển thị thông tin (dùng chung cho các sự kiện)
  const triggerUploadInfo = () => {
    setShowUploadInfo(true);
  };

  // Handle scroll (window) and right arrow key
  useEffect(() => {
    const handleKeydown = (e) => {
      if (e.key === 'ArrowRight') {
        triggerUploadInfo();
      }
    };

    // Vẫn giữ window scroll để dự phòng
    window.addEventListener('scroll', triggerUploadInfo);
    window.addEventListener('keydown', handleKeydown);

    return () => {
      window.removeEventListener('scroll', triggerUploadInfo);
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

  // --- Intersection Observer Logic (Cập nhật currentVideo khi cuộn) ---
  useEffect(() => {
    const observerOptions = {
      root: null, // viewport
      rootMargin: '0px',
      threshold: 0.6, // Giảm xuống 0.6 (60%) để dễ nhận diện video hơn trên màn hình nhỏ
    };

    const handleIntersection = (entries) => {
      entries.forEach((entry) => {
        const videoElement = entry.target;

        if (entry.isIntersecting) {
          videoElement.play().catch(err => console.log("Autoplay prevented", err));

          // Lấy index của video trong danh sách Refs hiện tại
          const index = videoRefs.current.indexOf(videoElement);

          // Nếu tìm thấy index hợp lệ, cập nhật currentVideo theo danh sách đang hiển thị (filteredVideos)
          if (index !== -1 && filteredVideos[index]) {
            setCurrentVideo(filteredVideos[index]);
          }
        } else {
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
  }, [filteredVideos]); // Re-run khi danh sách thay đổi

  // Handle Video Swipe / Key Change
  const handleVideoChange = (direction) => {
    const currentIndex = filteredVideos.findIndex((video) => video.url === currentVideo?.url);
    let newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;

    if (newIndex < 0) newIndex = 0;
    if (newIndex >= filteredVideos.length) newIndex = filteredVideos.length - 1;

    const nextVideo = filteredVideos[newIndex];
    if (nextVideo) {
      setCurrentVideo(nextVideo);
      // Gọi hiển thị info khi chuyển video bằng swipe/phím
      triggerUploadInfo();

      const videoElement = videoRefs.current[newIndex];
      if (videoElement) {
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
    const threshold = 50;

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        handleVideoChange('previous');
      } else {
        handleVideoChange('next');
      }
    }

    dragRef.current.isDragging = false;
  };

  const handleMouseLeave = () => {
    dragRef.current.isDragging = false;
  };

  const handleVideoRef = (index) => (ref) => {
    videoRefs.current[index] = ref;
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);
    const filtered = videoUrls.filter((video) =>
      video.description.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredVideos(filtered);
    if (filtered.length > 0) {
      setCurrentVideo(filtered[0]);
    } else {
      setCurrentVideo(null);
    }
  };

  return (
    <div
      className="app"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onWheel={triggerUploadInfo} /* Bắt sự kiện lăn chuột */
      onScroll={triggerUploadInfo} /* QUAN TRỌNG: Bắt sự kiện cuộn trên container chính */
    >
      <div className="container">
        <TopNavbar className="top-navbar" onSearch={handleSearchChange} />

        {filteredVideos.length === 0 ? (
          <div style={{ color: 'white', textAlign: 'center', marginTop: '50%' }}>No results found</div>
        ) : (
          filteredVideos.map((video, index) => (
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
              onVideoChange={handleVideoChange}
              data={video}
            />
          ))
        )}

        {/* Upload Info Overlay - ĐÃ CHỈNH SỬA KÍCH THƯỚC NHỎ HƠN */}
        {showUploadInfo && currentVideo && (
          <div className="upload-info-overlay" style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(10px)',
            padding: '15px', // Đã giảm padding
            borderRadius: '15px', // Đã giảm border radius
            color: 'white',
            zIndex: 2000,
            textAlign: 'center',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
            minWidth: '220px', // Đã giảm độ rộng
            maxWidth: '280px', // Giới hạn độ rộng tối đa
            border: '1px solid rgba(255, 255, 255, 0.1)',
            transition: 'opacity 0.3s ease'
          }}>
            <div className="upload-info-content">
              {currentVideo.profilePic && (
                <img
                  src={currentVideo.profilePic}
                  alt="profile"
                  className="upload-info-profile"
                  style={{
                    width: '50px', // Đã giảm kích thước ảnh
                    height: '50px',
                    borderRadius: '50%',
                    marginBottom: '10px',
                    border: '2px solid white',
                    objectFit: 'cover',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
                  }}
                />
              )}
              <div className="upload-info-details">
                <p style={{ margin: '0 0 5px 0', fontSize: '1rem', fontWeight: 'bold' }}>@{currentVideo.username}</p> {/* Giảm font size */}
                <p style={{ margin: '0 0 10px 0', fontSize: '0.85rem', lineHeight: '1.3', opacity: 0.9 }}>{currentVideo.description}</p> {/* Giảm font size */}
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'rgba(255,255,255,0.1)',
                  padding: '4px 10px',
                  borderRadius: '15px',
                  fontSize: '0.8rem' // Giảm font size
                }}>
                  <span>🎵</span> <em>{currentVideo.song}</em>
                </div>
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