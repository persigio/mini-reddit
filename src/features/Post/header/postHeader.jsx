import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
  selectIsLoading,
  setCurrentSubreddit,
} from '../../../store/postFeedSlice';

import { FaReddit } from 'react-icons/fa';
import { timeAgo } from '../../../utils/getPostTime';
import { fetchSubredditAbout } from '../../../api/reddit-api';
import headStyles from './postHeader.module.css';

export const PostHeader = ({ content }) => {
  const postData = content.data;
  const isLoading = useSelector(selectIsLoading);
  const [subredditIcon, setSubredditIcon] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    let mounted = true;
    if (!isLoading) {
      fetchSubredditAbout(postData.subreddit_name_prefixed).then(response => {
        if (mounted) {
          setSubredditIcon(response.icon_img);
        }
      });

      return function cleanup() {
        mounted = false;
      };
    }
  }, [isLoading, postData.subreddit_name_prefixed]);

  const subAvatar = subreddit => {
    if (subreddit) {
      return (
        <img
          src={subreddit}
          alt="subreddits avatar"
          className={headStyles.avatar}
        />
      );
    }
    return <FaReddit size={42} className={headStyles.avatar} />;
  };

  return (
    <div className={headStyles.header}>
      {subAvatar(subredditIcon)}
      <div className={headStyles.details}>
        <button
          className={headStyles.detailsSubreddit}
          onClick={() =>
            dispatch(
              setCurrentSubreddit(`${postData.subreddit_name_prefixed}/`),
            )
          }
        >
          {postData.subreddit_name_prefixed}
        </button>
        <span className={headStyles.detailsAuthor}>
          posted by u/{postData.author}
        </span>
      </div>
      <div className={headStyles.timeStamp}>
        {timeAgo(postData.created_utc)}
      </div>
    </div>
  );
};
