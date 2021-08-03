import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import { FaComments } from 'react-icons/fa';
import { loadComments } from '../../../store/postFeedSlice';
import commentStyles from './postCommentSection.module.css';
import Comment from '../../Comments/Comments';
import LoadingIcon from '../../../components/LoadingIcon/LoadingIcon';

export const PostCommentSection = ({ content, i }) => {
  const [shownComments, setShownComments] = useState(3);
  const comments = content.comments;
  const dispatch = useDispatch();

  const handleCommentClick = () => {
    console.log('fetching comments');
    dispatch(loadComments({ index: i, permalink: content.permalink }));
  };
  const handleMoreClick = () => {
    const next = shownComments + 3;
    const total = comments.length;
    next > total ? setShownComments(total) : setShownComments(next);
  };
  const handleLessClick = () => {
    const next = shownComments - 3;
    next < 0 ? setShownComments(0) : setShownComments(next);
  };
  const handleHideClick = () => {
    setShownComments(0);
  };

  const numComments = num => {
    return (
      <span>
        <FaComments /> {num} comments
      </span>
    );
  };

  const commentList = count => {
    return (
      <ul>
        {comments.slice(0, count).map(comment => (
          <Comment data={comment} key={comment.id} />
        ))}
      </ul>
    );
  };

  const showHideButtons = () => {
    if (shownComments) {
      return (
        <div className={commentStyles.showMoreLess}>
          <button onClick={handleMoreClick} className={commentStyles.button}>
            show more comments
          </button>
          <button onClick={handleLessClick} className={commentStyles.button}>
            show less comments
          </button>
          <button onClick={handleHideClick} className={commentStyles.button}>
            hide comments
          </button>
        </div>
      );
    } else if (content.showComments) {
      return (
        <div className={commentStyles.showMoreLess}>
          <button onClick={handleMoreClick} className={commentStyles.button}>
            show comments
          </button>
        </div>
      );
    }
  };

  return (
    <div className={commentStyles.comments}>
      {!content.showComments && (
        <button onClick={handleCommentClick} className={commentStyles.button}>
          {numComments(content.comment_count)}
        </button>
      )}
      {content.showComments && <div>{numComments(content.comment_count)}</div>}

      {/*Displays loading screen while pulling comments*/}
      {content.isLoadingComments && <LoadingIcon text="Loading Comments" />}

      {/*Displays loaded comments*/}
      {content.showComments && content.comment_count > 0 && (
        <div>
          {commentList(shownComments)}
          {showHideButtons()}
        </div>
      )}
    </div>
  );
};

export default PostCommentSection;