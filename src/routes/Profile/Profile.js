import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import NoAvatarImg from '../../assets/noAvatar.jpg';
import style from './Profile.module.scss';
import { Button, Image } from '../../components/UI';
import SettingIcon from '../../components/Icon/SettingIcon';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { MY_PROFILE, UPDATE_AVATAR } from './ProfileQuery';
import Dialog from '../../components/Dialog/Dialog';
import DialogButton from '../../components/Dialog/DialogButton';
import { UPLOAD_FILE } from '../../apollo/GlobalQueries';
import { USER_INFO } from '../../components/Header/HeaderQueries';

export default ({ history }) => {
  const { t } = useTranslation();
  const [profile, setProfile] = useState(null);
  const [dialogChangePhoto, setDialogChangePhoto] = useState({
    show: false
  });
  const { data } = useQuery(MY_PROFILE, { fetchPolicy: 'network-only' });
  const [singleUpload] = useMutation(UPLOAD_FILE);
  const [updateAvatar] = useMutation(UPDATE_AVATAR);

  useEffect(() => {
    if (data) {
      const { myProfile } = data;
      if (myProfile) {
        setProfile(myProfile);
      }
    }
  }, [data]);

  const handleClickAvatar = () => {
    setDialogChangePhoto({ ...dialogChangePhoto, show: true });
  };

  const fileInputRef = useRef();
  const handleClickUploadPhotoButton = () => {
    fileInputRef.current.click();
  };

  const handleInputFileChange = event => {
    const { validity, files: [file] } = event.target;
    if (validity.valid) {
      singleUpload({
        variables: {
          file
        },
        update: (_, result) => {
          const { data: { singleUpload } } = result;
          if (singleUpload) {
            updateAvatar({
              variables: {
                avatar: singleUpload.path
              },
              update: (cache, result) => {
                const { data: { editUser } } = result;
                if (editUser) {
                  try {
                    const { myProfile } = cache.readQuery({ query: USER_INFO });
                    if (myProfile) {
                      console.log(myProfile);
                      const updated = { ...myProfile, avatar: editUser.avatar };
                      cache.writeQuery({ query: USER_INFO, data: { myProfile: updated } })
                    }
                  } catch (e) {
                    console.log(e);
                  }
                  setProfile({ ...profile, avatar: editUser.avatar });
                  setDialogChangePhoto({ ...dialogChangePhoto, show: false });
                }
              }
            })
          }
        }
      })
    }
  };

  return (
    <React.Fragment>
      <div className="container">
        { !profile ?
          <div>Loading ...</div>
          :
          <React.Fragment>
            <header className={style.Header}>
              <div className={style.ProfilePhoto}>
                <div className={style.ProfilePhotoContainer}>
                  <div className={style.ProfilePhotoBlock}>
                    <button className={style.ProfilePhotoChange} title={t('Change profile photo')} onClick={handleClickAvatar}>
                      <Image src={profile.avatar || NoAvatarImg} alt={t('Change profile photo')} />
                    </button>
                  </div>
                </div>
              </div>
              <section className={style.Profile}>
                <div className={style.ProfileSettings}>
                  <h1>{ profile.username }</h1>
                  <Button
                    label={t('Edit profile')}
                    type="secondary"
                    className={style.ProfileEdit}
                    onClick={() => history.push('/edit-profile')}
                  />
                  <button className={style.ProfileSettingIcon}>
                    <SettingIcon width="24" height="24" color="var(--blackColor)" />
                  </button>
                </div>
                <div className={style.ProfileInfo}>

                </div>
                <div className={style.ProfileBio}>

                </div>
              </section>
            </header>
            <div className="stories">
              {/*{ todo: Stories }*/}
            </div>
            <div className={style.Navigation}>

            </div>
            <div className={style.Posts}>

            </div>
          </React.Fragment>
        }
      </div>
      { dialogChangePhoto.show &&
        <Dialog title={t('Change profile photo')}>
          <DialogButton text={t('Upload photo')} type="info" onClick={handleClickUploadPhotoButton} />
          <DialogButton text={t('Remove current photo')} type="danger" />
          <DialogButton text={t('Cancel')} onClick={() => setDialogChangePhoto({ ...dialogChangePhoto, show: false })} />
          <form method="POST" encType="multipart/form-data" className={style.UploadPhotoForm}>
            <input ref={fileInputRef} type="file" accept="image/jpeg,image/png" onChange={handleInputFileChange} />
          </form>
        </Dialog>
      }
    </React.Fragment>
  )
};
