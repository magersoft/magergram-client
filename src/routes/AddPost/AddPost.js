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
import { BackIcon, CloseIcon } from '../../components/Icon';
import AppHeader from '../../components/AppHeader';

export default ({ history }) => {
  const { t } = useTranslation();
  const [state, setState] = useState({
    image: null,
    caption: '',
    location: '',
    imageUploaded: false,
    filter: null,
    disableShare: false,
    file: null
  });
  const [caman, setCaman] = useState(null);
  const [user, setUser] = useState(null);
  const [next, setNext] = useState(false);
  const uploadedImageRef = useRef();

  const { data } = useQuery(MY_PROFILE);
  useEffect(() => {
    if (data) {
      const { myProfile } = data;
      setUser(myProfile);
    }
  }, [data]);

  useEffect(() => {
    const { location: { state } } = history;
    const file = state.file;
    if (file) {
      setState({ ...state, imageUploaded: true, disableShare: false, file });
      renderImage(file);
    }
  }, [history]);

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
          }
        }
      }
    })
  };

  const handleChange = prop => event => {
    setState({ ...state, [prop]: event.target.value })
  };

  const renderImage = src => {
    const interval = setInterval(() => {
      const uploadedImageEl = uploadedImageRef.current;
      if (uploadedImageEl) {
        clearInterval(interval);
        console.log(uploadedImageEl);
        const existImage = uploadedImageEl.querySelector('canvas');
        if (existImage) existImage.remove();
        const image = new Image();
        image.crossOrigin = 'anonymous';
        image.src = src;
        image.classList.add(style.Image);
        image.id = 'image';
        uploadedImageEl.append(image);

        initCaman();
      }
    }, 100);
  };

  const initCaman = () => {
    const image = document.getElementById('image');
    setCaman(window.Caman(image));
  };

  const upload = () => {
    setState(prevState => ({ ...prevState, disableShare: true }));
    const canvas = document.querySelector('canvas');
    uploadFile(canvasToBlob(canvas, user.username), true);
  };

  const handleSelectFilter = filter => {
    caman.revert(true);
    caman[filter]();
    caman.render();
    setState({ ...state, filter });
  };

  const handleRevertFilter = () => {
    caman.revert(true);
  }

  const rotate = () => {
    caman.rotate(90);
    caman.render();
    if (state.filter) {
      caman[state.filter]();
      caman.render();
    }
  };

  const handleClose = () => {
    history.goBack();
  }

  const handleNext = () => {
    setNext(true);
  }

  const handleBack = () => {
    setNext(false);
  }

  return (
    <React.Fragment>
      <AppHeader
        title={ t('New publication') }
        leftButton={
          <button className={style.Close} onClick={handleClose}>
            <CloseIcon width={24} height={24} color="var(--color-main)" />
          </button>
        }
        rightButton={
          <Button
            label={t('Next')}
            className={style.Next}
            onClick={handleNext}
            small
          />
        }
      />
      <div className={`container ${style.Container}`}>
      { user ?
        <div className={style.AddPost}>
          <div className={style.Post}>
            <div ref={uploadedImageRef} className={style.ImageBlock}>
              <div className={`${style.IconRotate} sprite-create`} onClick={rotate} />
            </div>
            <div className={style.AdditionalBlock}>
              { next &&
              <div className={style.PostInfo}>
                <div className={style.Actions}>
                  <button className={style.Back} onClick={handleBack}>
                    <BackIcon width={24} height={24} color="var(--color-main)" />
                  </button>
                  <h1 className={style.Title}>{ t('New publication') }</h1>
                  { !addPostLoading ?
                    <Button
                      onClick={upload}
                      label={t('Share')}
                      className={style.ShareButton}
                      small
                      disabled={state.disableShare || !state.imageUploaded || singleUploadLoading}
                    /> : <Spinner width={30} height={30} fill="var(--color-accent)" />
                  }
                </div>
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
              }
              <ImageFilters
                imageUploaded={state.imageUploaded}
                onSelectFilter={handleSelectFilter}
                onRevertFilter={handleRevertFilter}
              />
            </div>
          </div>
        </div> : <PostSkeleton />
      }
    </div>
    </React.Fragment>
  )
};
