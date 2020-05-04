import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import style from './UploadAvatar.module.scss';
import { useTranslation } from 'react-i18next';
import DialogButton from '../Dialog/DialogButton';
import Dialog from '../Dialog/Dialog';
import { MY_PROFILE } from '../../layout/Main/MainQueries';
import { useMutation } from '@apollo/react-hooks';
import { UPDATE_AVATAR } from '../../routes/Profile/ProfileQuery';
import { DELETE_FILE, UPLOAD_FILE } from '../../apollo/GlobalQueries';

const UploadAvatar = ({ dialogShow, avatar, dialogClose, avatarUpdated }) => {
  const { t } = useTranslation();
  const fileInputRef = useRef();

  const [singleUpload, { loading: singleUploadLoading }] = useMutation(UPLOAD_FILE);
  const [updateAvatar, { loading: updateAvatarLoading }] = useMutation(UPDATE_AVATAR);
  const [deleteFile, { loading: deleteFileLoading }] = useMutation(DELETE_FILE);

  const handleClickUploadPhotoButton = () => {
    fileInputRef.current.click();
  };

  const updateAvatarHelper = avatar => {
    updateAvatar({
      variables: {
        avatar
      },
      update: (cache, result) => {
        const { data: { editUser } } = result;
        if (editUser.data) {
          try {
            const { myProfile } = cache.readQuery({ query: MY_PROFILE });
            if (myProfile) {
              const updated = { ...myProfile, avatar: editUser.data.avatar };
              cache.writeQuery({ query: MY_PROFILE, data: { myProfile: updated } });
            }
          } catch (e) {
            console.log(e);
          }
          avatarUpdated(editUser.data.avatar);
          dialogClose();
        }
      }
    })
  };

  const handleInputFileChange = event => {
    const { validity, files: [file] } = event.target;
    if (validity.valid && file) {
      singleUpload({
        variables: {
          file,
          toGoogleStorage: true,
          optimized: [300, 300]
        },
        update: (_, result) => {
          const { data: { singleUpload } } = result;
          if (singleUpload) {
            updateAvatarHelper(singleUpload.path)
          }
        }
      })
    }
  };

  const handleClickRemovePhotoButton = () => {
    const src = avatar;
    deleteFile({
      variables: {
        src
      },
      update: (_, result) => {
        const { data: { fileDelete } } = result;
        if (fileDelete) {
          updateAvatarHelper('')
        }
      }
    })
  };

  const handleCloseDialog = () => {
    dialogClose()
  };

  return (
    <Dialog show={dialogShow} title={t('Change profile photo')}>
      <DialogButton
        text={t('Upload photo')}
        type="info"
        loading={singleUploadLoading || updateAvatarLoading}
        disabled={singleUploadLoading || updateAvatarLoading}
        onClick={handleClickUploadPhotoButton}
      />
      { avatar &&
      <DialogButton
        text={t('Remove current photo')}
        type="danger"
        loading={deleteFileLoading || updateAvatarLoading}
        disabled={deleteFileLoading || updateAvatarLoading}
        onClick={handleClickRemovePhotoButton}
      />
      }
      <DialogButton
        text={t('Cancel')}
        onClick={handleCloseDialog}
      />
      <form method="POST" encType="multipart/form-data" className={style.UploadPhotoForm}>
        <input ref={fileInputRef} type="file" accept="image/jpeg,image/png" onChange={handleInputFileChange} />
      </form>
    </Dialog>
  )
};

UploadAvatar.propTypes = {
  dialogShow: PropTypes.bool,
  avatar: PropTypes.string,
  dialogClose: PropTypes.func.isRequired,
  avatarUpdated: PropTypes.func.isRequired
};

UploadAvatar.defaultProps = {
  dialogShow: false
};

export default UploadAvatar;
