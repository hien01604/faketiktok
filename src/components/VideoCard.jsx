import React, { useEffect, useState, useRef } from 'react';
import FooterLeft from './FooterLeft';
import FooterRight from './FooterRight';
import './VideoCard.css';

const VideoCard = (props) => {
  const {
    url,
    username,
    description,
    song,
    likes,
    shares,
    comments,
    saves,
    profilePic,
    setVideoRef,
    autoplay,
    onVideoChange, // Callback function to notify parent when video changes
  } = props;

  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true); // Initially mute the video

  // Mouse drag state
  const [dragging, setDragging] = useState(false);
  const [startY, setStartY] = useState(0);

  useEffect(() => {
    if (autoplay && videoRef.current) {
      videoRef.current.play(); // Try playing the video when it comes into view
    }
  }, [autoplay]);

  // Handle mouse down event to start dragging
  const handleMouseDown = (e) => {
    setDragging(true);
    setStartY(e.clientY); // Record the starting mouse position
  };

  // Handle mouse move event to calculate the drag distance
  const handleMouseMove = (e) => {
    if (!dragging) return;

    const diff = e.clientY - startY; // Calculate the difference in Y position
    if (Math.abs(diff) > 50) {  // Only trigger if the mouse moves enough (e.g., 50px)
      if (diff > 50) {
        // Move down → previous video
        onVideoChange('previous');
      } else if (diff < -50) {
        // Move up → next video
        onVideoChange('next');
      }
      setDragging(false);  // Stop dragging after the action is taken
    }
  };

  // Stop dragging when mouse is released
  const handleMouseUp = () => {
    setDragging(false);
  };

  const onVideoPress = () => {
    if (videoRef.current.paused) {
      videoRef.current.play();
    } else {
      videoRef.current.pause();
    }
  };

  // Toggle mute functionality
  const toggleMute = () => {
    setIsMuted((prev) => !prev);
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
  };

  return (
    <div
      className="video"
      onMouseDown={handleMouseDown} // Start mouse tracking
      onMouseMove={handleMouseMove} // Handle mouse movement
      onMouseUp={handleMouseUp}    // Stop mouse tracking
    >
      <video
        className="player"
        onClick={onVideoPress}
        ref={(ref) => {
          videoRef.current = ref;
          setVideoRef(ref);
        }}
        loop
        muted={isMuted}
        src={url}
      ></video>

      <div className="bottom-controls">
        <div className="footer-left">
          <FooterLeft username={username} description={description} song={song} />
        </div>
        <div className="footer-right">
          <FooterRight
            likes={likes}
            shares={shares}
            comments={comments}
            saves={saves}
            profilePic={profilePic}
            toggleMute={toggleMute}  // Pass mute toggle function
            isMuted={isMuted}  // Pass mute state
            videoUrl={url}  // Pass video URL for copying
          />
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
