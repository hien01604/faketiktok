import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCirclePlus,
  faCircleCheck,
  faHeart,
  faCommentDots,
  faBookmark,
  faShare,
  faVolumeMute,
  faVolumeUp,
  faTimes, // Icon for closing the popup
  faLink   // Icon for copying link
} from '@fortawesome/free-solid-svg-icons';

// Import brand icons (Facebook, Instagram, Threads)
import { faFacebook, faInstagram, faThreads } from '@fortawesome/free-brands-svg-icons';
import './FooterRight.css';

function FooterRight({
  likes,
  comments,
  saves,
  shares,
  profilePic,
  toggleMute,
  isMuted,
  videoUrl,
}) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [userAddIcon, setUserAddIcon] = useState(faCirclePlus);
  const [showSharePopup, setShowSharePopup] = useState(false);
  const [copyMessage, setCopyMessage] = useState("");

  const handleUserAddClick = () => {
    setUserAddIcon(faCircleCheck);
    setTimeout(() => setUserAddIcon(null), 3000);
  };

  const handleSaveClick = () => {
    navigator.clipboard.writeText(videoUrl).then(() => {
      setSaved(true);
      setCopyMessage("Copied link!");
      setTimeout(() => setCopyMessage(""), 2000);
    });
  };

  // Handle Copy Link functionality
  const handleCopyLink = () => {
    navigator.clipboard.writeText(videoUrl).then(() => {
      setCopyMessage("Copied!");
      setTimeout(() => setCopyMessage(""), 2000);
      setShowSharePopup(false); // Close popup after copy
    });
  };

  const handleShareClick = () => {
    setShowSharePopup(true);
  };

  const handleClosePopup = (e) => {
    // Close popup when clicking the overlay or close button
    if (e.target.className === 'share-overlay' || e.currentTarget.classList.contains('close-btn')) {
      setShowSharePopup(false);
    }
  };

  const parseLikeCount = (count) => {
    if (typeof count === 'string' && count.endsWith('K')) {
      return parseFloat(count) * 1000;
    }
    return parseInt(count);
  };

  const formatLikeCount = (count) => {
    if (count >= 10000) {
      return (count / 1000).toFixed(1) + 'K';
    }
    return count;
  };

  const handleLikeClick = () => {
    setLiked((prev) => !prev);
  };

  const handleMuteClick = () => {
    if (toggleMute) {
      toggleMute();
    }
  };

  return (
    <div className="footer-right">
      {/* Profile */}
      <div className="sidebar-icon">
        {profilePic && (
          <img src={profilePic} className="userprofile" alt="Profile" style={{ width: '45px', height: '45px' }} />
        )}
        {userAddIcon && (
          <FontAwesomeIcon
            icon={userAddIcon}
            className="useradd"
            style={{ width: '15px', height: '15px', color: '#FF0000' }}
            onClick={handleUserAddClick}
          />
        )}
      </div>

      {/* Like */}
      <div className="sidebar-icon" onClick={handleLikeClick}>
        <FontAwesomeIcon
          icon={faHeart}
          style={{
            width: '35px',
            height: '35px',
            color: liked ? '#FF0000' : 'white',
          }}
        />
        <p>{formatLikeCount(parseLikeCount(likes) + (liked ? 1 : 0))}</p>
      </div>

      {/* Comment */}
      <div className="sidebar-icon" onClick={(e) => e.stopPropagation()}>
        <FontAwesomeIcon icon={faCommentDots} style={{ width: '35px', height: '35px', color: 'white' }} />
        <p>{comments}</p>
      </div>

      {/* Save */}
      <div className="sidebar-icon" onClick={handleSaveClick}>
        <FontAwesomeIcon
          icon={faBookmark}
          style={{ width: '35px', height: '35px', color: saved ? '#ffc107' : 'white' }}
        />
        <p>{saved ? saves + 1 : saves}</p>
        {copyMessage && <span className="copy-message">{copyMessage}</span>}
      </div>

      {/* Share Button */}
      <div className="sidebar-icon" onClick={handleShareClick}>
        <FontAwesomeIcon icon={faShare} style={{ width: '35px', height: '35px', color: 'white' }} />
        <p>{shares}</p>
      </div>

      {/* New Share Popup */}
      {showSharePopup && (
        <div className="share-overlay" onClick={handleClosePopup}>
          <div className="share-content">
            <div className="share-header">
              <h3>Share to</h3>
              <button className="close-btn" onClick={() => setShowSharePopup(false)}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <div className="share-grid">
              {/* Facebook */}
              <div className="share-item" onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${videoUrl}`)}>
                <div className="icon-circle facebook-bg">
                  <FontAwesomeIcon icon={faFacebook} />
                </div>
                <span>Facebook</span>
              </div>

              {/* Instagram */}
              <div className="share-item" onClick={() => window.open(`https://www.instagram.com/sharer.php?url=${videoUrl}`)}>
                <div className="icon-circle instagram-bg">
                  <FontAwesomeIcon icon={faInstagram} />
                </div>
                <span>Instagram</span>
              </div>

              {/* Threads */}
              <div className="share-item" onClick={() => window.open(`https://www.threads.net/share?url=${videoUrl}`)}>
                <div className="icon-circle threads-bg">
                  <FontAwesomeIcon icon={faThreads} />
                </div>
                <span>Threads</span>
              </div>

              {/* Copy Link */}
              <div className="share-item" onClick={handleCopyLink}>
                <div className="icon-circle copy-bg">
                  <FontAwesomeIcon icon={faLink} />
                </div>
                <span>{copyMessage || "Copy Link"}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mute/Unmute */}
      <div className="sidebar-icon" onClick={handleMuteClick}>
        <FontAwesomeIcon
          icon={isMuted ? faVolumeMute : faVolumeUp}
          style={{ width: '35px', height: '35px', color: 'white' }}
        />
      </div>

      {/* Record Icon */}
      <div className="sidebar-icon record">
        <img src="https://static.thenounproject.com/png/934821-200.png" alt="Record Icon" />
      </div>
    </div>
  );
}

export default FooterRight;
