import React, { useEffect, useRef, useState } from 'react';
import style from './AddPost.module.scss';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { UPLOAD_FILE } from '../../apollo/GlobalQueries';
import { PostHeader, PostSkeleton } from '../../components/Post';
import { MY_PROFILE } from '../../components/Header/HeaderQueries';
import ImageFilters from '../../components/ImageFilters';
import canvasToBlob from '../../utils/canvasToBlob';

const STATIC_SERVER = process.env.REACT_APP_STATIC_SERVER || 'http://localhost:4000';

export default () => {
  const [state, setState] = useState({
    image: null
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

  const [singleUpload] = useMutation(UPLOAD_FILE);

  const uploadFile = (file) => {
    singleUpload({
      variables: {
        file
      },
      update: (_, result) => {
        const { data: { singleUpload } } = result;
        if (singleUpload) {
          setState({ ...state, image: singleUpload.path });
          renderImage(singleUpload.path);
          initCaman();
        }
      }
    })
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
    image.src = STATIC_SERVER + src;
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
    uploadFile(canvasToBlob(canvas, user.username));
  };

  const handleSelectFilter = filter => {
    caman.revert(true);
    caman[filter]();
    caman.render();
  };

  const rotate = right => {
    if (right) {
      caman.rotate(-90);
      caman.render();
    } else {
      caman.rotate(90);
      caman.render();
    }
  };

  return (
    <div className="container">
      { user ?
        <div className={style.AddPost}>
          <div ref={uploadedImageRef} className={style.ImageBlock} onClick={handleClickUploadPhoto}>
            <div className={`${style.AddIcon} sprite`} />
            <form method="POST" encType="multipart/form-data" className={style.UploadPhotoForm}>
              <input ref={fileInputRef} type="file" accept="image/jpeg,image/png" onChange={handleInputFileChange} />
            </form>
          </div>
          <div className={style.AdditionalBlock}>
            <PostHeader username={user.username} avatar={user.avatar} />
          </div>
        </div> : <PostSkeleton />
      }
      <div>
        <button onClick={upload}>Upload</button>
        <button onClick={() => rotate()}>Rotate left</button>
        <button onClick={() => rotate(true)}>Rotate right</button>
      </div>
      <ImageFilters onSelectFilter={handleSelectFilter} />
    </div>
  )
};
