import React, { useEffect, useRef, useState } from 'react';
import style from './AddPost.module.scss';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { UPLOAD_FILE } from '../../apollo/GlobalQueries';
import { PostSkeleton } from '../../components/Post';
import { MY_PROFILE } from '../../components/Header/HeaderQueries';
import ImageFilters from '../../components/ImageFilters';
import canvasToBlob from '../../utils/canvasToBlob';
import { useTranslation } from 'react-i18next';
import { Button } from '../../components/UI';
import Spinner from '../../components/Loader/Spinner';
import { ADD_POST } from './AddPostQueries';

export default ({ history }) => {
  const { t } = useTranslation();
  const [state, setState] = useState({
    image: null,
    caption: '',
    location: '',
    imageUploaded: false,
    filter: null
  });
  const [caman, setCaman] = useState(null);
  const [user, setUser] = useState(null);
  const fileInputRef = useRef();
  const uploadedImageRef = useRef();

  const { data } = useQuery(MY_PROFILE);
  useEffect(() => {
    if (data) {
      const { myProfile } = data;
      setUser(myProfile);
    }
  }, [data]);

  const [singleUpload, { loading: singleUploadLoading }] = useMutation(UPLOAD_FILE);
  const [addPost, { loading: addPostLoading }] = useMutation(ADD_POST);

  const uploadFile = (file, share) => {
    singleUpload({
      variables: {
        file,
        toGoogleStorage: !!share
      },
      update: (_, result) => {
        const { data: { singleUpload } } = result;
        if (singleUpload) {
          const file = singleUpload.path;
          if (share) {
            addPost({
              variables: {
                caption: state.caption,
                location: state.location,
                files: [file]
              },
              update: (_, result) => {
                const { data: { addPost } } = result;
                if (addPost) {
                  history.push('/');
                }
              }
            })
          } else {
            setState({ ...state, imageUploaded: true });
            renderImage(file);
            initCaman();
          }
        }
      }
    })
  };

  const handleChange = prop => event => {
    setState({ ...state, [prop]: event.target.value })
  };

  const handleClickUploadPhoto = async () => {
    fileInputRef.current.click();
  };

  const handleInputFileChange = event => {
    const { validity, files: [file] } = event.target;
    if (validity.valid && file) {
      uploadFile(file);
    }
  };

  const renderImage = src => {
    const uploadedImageEl = uploadedImageRef.current;
    const existImage = uploadedImageEl.querySelector('canvas');
    if (existImage) existImage.remove();
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.src = src;
    image.classList.add(style.Image);
    image.id = 'image';
    uploadedImageEl.append(image);
  };

  const initCaman = () => {
    const image = document.getElementById('image');
    const caman = window.Caman(image);
    setCaman(caman);
  };

  const upload = () => {
    const canvas = document.querySelector('canvas');
    uploadFile(canvasToBlob(canvas, user.username), true);
  };

  const handleSelectFilter = filter => {
    caman.revert(true);
    caman[filter]();
    caman.render();
    setState({ ...state, filter });
  };

  const rotate = () => {
    caman.rotate(90);
    caman.render();
    if (state.filter) {
      caman[state.filter]();
      caman.render();
    }
  };

  return (
    <div className="container">
      { user ?
        <div className={style.AddPost}>
          <div className={style.Post}>
            <div ref={uploadedImageRef} className={style.ImageBlock} onClick={handleClickUploadPhoto}>
              { singleUploadLoading ? <Spinner width={60} height={60} /> : <div className={`${style.AddIcon} sprite`} /> }
              <form method="POST" encType="multipart/form-data" className={style.UploadPhotoForm}>
                <input ref={fileInputRef} type="file" accept="image/jpeg,image/png" onChange={handleInputFileChange} />
              </form>
            </div>
            <div className={style.AdditionalBlock}>
              <div className={style.Actions}>
                <div className={`${style.IconRotate} sprite`} onClick={rotate} />
                { !addPostLoading ?
                  <Button
                    onClick={upload}
                    label={t('Share')}
                    className={style.ShareButton}
                    small
                    disabled={!state.imageUploaded}
                  /> : <Spinner fill="var(--color-accent)" />
                }
              </div>
              <div className={style.PostInfo}>
                <textarea
                  className={style.Caption}
                  placeholder={`${t('Add caption')} ...`}
                  aria-label={`${t('Add caption')} ...`}
                  autoComplete="off"
                  autoCorrect="off"
                  value={state.caption}
                  onChange={handleChange('caption')}
                />
                <input
                  className={style.Place}
                  type="text"
                  placeholder={t('Indicate place')}
                  value={state.location}
                  onChange={handleChange('location')}
                />
              </div>
            </div>
          </div>
          <ImageFilters imageUploaded={state.imageUploaded} onSelectFilter={handleSelectFilter} />
        </div> : <PostSkeleton />
      }
    </div>
  )
};
