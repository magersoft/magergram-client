import React, { useState } from 'react';
import PropTypes from 'prop-types';
import style from './styles/Post.module.scss';
import { ToolsIcon } from '../Icon';
import DialogButton from '../Dialog/DialogButton';
import Dialog from '../Dialog/Dialog';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/react-hooks';
import { REMOVE_POST } from './PostQueries';

const PostTools = ({ postId, itsMe, className }) => {
  const { t } = useTranslation();
  const [show, setShow] = useState(false);

  const [removePost, { loading: removePostLoading }] = useMutation(REMOVE_POST);

  const handleRemovePublication = () => {
    removePost({
      variables: {
        id: postId
      },
      update: (_, result) => {
        const { data: { removePost } } = result;
        if (removePost) {
          window.location.reload();
        }
      }
    })
  };

  return (
    <React.Fragment>
      <div className={`${style.Tools} ${className}`} onClick={() => setShow(true)}>
        <ToolsIcon width={16} height={16} color="var(--blackColor)" />
      </div>
      <Dialog show={show}>
        { itsMe ?
          <DialogButton
            text={t('Remove publication')}
            type="danger"
            loading={removePostLoading}
            onClick={handleRemovePublication}
          /> :
          <DialogButton text={t('Report on publication')} type="danger" />
        }
        <DialogButton text={t('Go to publication')} />
        <DialogButton text={t('Share')} />
        <DialogButton text={t('Copy link')} />
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
