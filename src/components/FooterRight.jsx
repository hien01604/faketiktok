import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCirclePlus,
  faCircleCheck,
  faHeart,
  faCommentDots,
  faBookmark,
  faShare
} from '@fortawesome/free-solid-svg-icons';
import './FooterRight.css';

function FooterRight({ likes, comments, saves, shares, profilePic }) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [userAddIcon, setUserAddIcon] = useState(faCirclePlus);

  const handleUserAddClick = () => {
    setUserAddIcon(faCircleCheck); // ✔ đã sửa đúng tên hàm

    setTimeout(() => {
      setUserAddIcon(null); // ✔ sẽ ẩn icon
    }, 3000);
  };

  const parseLikeCount = (count) => {
    if (typeof count === 'string') {
      if (count.endsWith('K')) {
        return parseFloat(count) * 1000;
      }
      return parseInt(count);
    }
    return count;
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

  return (
    <div className="footer-right">

      {/* Profile + Add button */}
      <div className="sidebar-icon">
        {profilePic && (
          <img
            src={profilePic}
            className="userprofile"
            alt="Profile"
            style={{ width: '45px', height: '45px' }}
          />
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
      <div className="sidebar-icon">
        <FontAwesomeIcon
          icon={faHeart}
          style={{
            width: '35px',
            height: '35px',
            color: liked ? '#FF0000' : 'white'
          }}
          onClick={handleLikeClick}
        />
        <p>{formatLikeCount(parseLikeCount(likes) + (liked ? 1 : 0))}</p>
      </div>

      {/* Comment */}
      <div className="sidebar-icon">
        <FontAwesomeIcon
          icon={faCommentDots}
          style={{ width: '35px', height: '35px', color: 'white' }}
        />
        <p>{comments}</p>
      </div>

      {/* Save */}
      <div className="sidebar-icon">
        {saved ? (
          <FontAwesomeIcon
            icon={faBookmark}
            style={{ width: '35px', height: '35px', color: '#ffc107' }}
            onClick={() => setSaved(false)}
          />
        ) : (
          <FontAwesomeIcon
            icon={faBookmark}
            style={{ width: '35px', height: '35px', color: 'white' }}
            onClick={() => setSaved(true)}
          />
        )}
        <p>{saved ? saves + 1 : saves}</p>
      </div>

      {/* Share */}
      <div className="sidebar-icon">
        <FontAwesomeIcon
          icon={faShare}
          style={{ width: '35px', height: '35px', color: 'white' }}
        />
        <p>{shares}</p>
      </div>

      {/* Record CD */}
      <div className="sidebar-icon record">
        <img
          src="https://static.thenounproject.com/png/934821-200.png"
          alt="Record Icon"
        />
      </div>
    </div>
  );
}

export default FooterRight;
