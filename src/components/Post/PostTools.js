import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useLocation, useHistory } from 'react-router-dom';
import style from './styles/Post.module.scss';
import { ToolsIcon } from '../Icon';
import DialogButton from '../Dialog/DialogButton';
import Dialog from '../Dialog/Dialog';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/react-hooks';
import { REMOVE_POST } from './PostQueries';
import { sharePublication } from './postShare';

const PostTools = ({ postId, itsMe, className }) => {
  const { t } = useTranslation();
  const [show, setShow] = useState(false);
  const { pathname } = useLocation();
  const history = useHistory();

  const [removePost, { loading: removePostLoading }] = useMutation(REMOVE_POST);

  const handleRemovePublication = () => {
    removePost({
      variables: {
        id: postId
      },
      update: (_, result) => {
        const { data: { removePost } } = result;
        if (removePost) {
          if (pathname !== '/') {
            history.push('/')
          }
          window.location.reload();
        }
      }
    })
  };

  const handleSharePublication = () => sharePublication(postId, t);

  const handleCopyPublicationLink = async () => {
    const link = `${window.location.origin}/post/${postId}`;
    try {
      await navigator.clipboard.writeText(link);
      setShow(false);
    } catch (e) {
      console.log('Wrong copy publication link', e);
    }
  }

  const handleGoPublication = () => {
    history.push(`/post/${postId}`);
    setShow(false);
  }

  const handleReportPublication = () => {
    alert('Coming soon');
  }

  return (
    <React.Fragment>
      <div className={`${style.Tools} ${className}`} onClick={() => setShow(true)}>
        <ToolsIcon width={16} height={16} color="var(--color-main)" />
      </div>
      <Dialog show={show}>
        { itsMe ?
          <DialogButton
            text={t('Remove publication')}
            type="danger"
            loading={removePostLoading}
            onClick={handleRemovePublication}
          /> :
          <DialogButton text={t('Report on publication')} type="danger" onClick={handleReportPublication} />
        }
        <DialogButton text={t('Go to publication')} onClick={handleGoPublication} />
        <DialogButton text={t('Share')} onClick={handleSharePublication} />
        <DialogButton text={t('Copy link')} onClick={handleCopyPublicationLink} />
        <DialogButton text={t('Cancel')} onClick={() => setShow(false)} />
      </Dialog>
    </React.Fragment>
  )
};

PostTools.propTypes = {
  postId: PropTypes.string.isRequired,
  itsMe: PropTypes.bool,
  className: PropTypes.string
};

PostTools.defaultProps = {
  className: ''
};

export default PostTools;
