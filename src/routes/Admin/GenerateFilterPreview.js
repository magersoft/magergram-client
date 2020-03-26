import React, { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { MY_PROFILE } from '../../components/Header/HeaderQueries';
import filtersJson from '../../data/filters';
import TEMPLATE_IMAGE from '../../assets/forFilter.jpg';
import style from './GenerateFilterPreview.module.scss';
import { Button } from '../../components/UI';
import canvasToBlob from '../../utils/canvasToBlob';
import { UPLOAD_GENERATED_FILTERS } from './AdminQueries';

const ADMIN_USER = 'magersoft';
const ADMIN_ID = 'ck7hs1q2suyx10950pm8t8gdl';

export default ({ history }) => {
  const [user, setUser] = useState(null);
  const [filters, setFilters] = useState([]);

  const { data } = useQuery(MY_PROFILE);

  useEffect(() => {
    if (data) {
      const { myProfile } = data;
      if (myProfile) {
        setUser(myProfile);
      }
    }
  }, [data]);

  useEffect(() => {
    if (user) {
      if (user.username === ADMIN_USER && user.id === ADMIN_ID) {
        console.log('admin page');
      } else {
        history.push('/');
      }
    }
  }, [user]);

  const parseFilters = () => {
    const filters = filtersJson.map(filter => {
      return {
        name: filter,
        image: generateImage(filter)
      }
    });
    generateFiltersToImage(filters);
    setFilters(filters);
  };

  const generateImage = filterName => {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.src = TEMPLATE_IMAGE;
    image.id = filterName;
    return image;
  };

  const generateFiltersToImage = filters => {
    const caman = window.Caman;

    filters.forEach((filter) => {
      const interval = setInterval(() => {
        const slide = document.getElementById(`it-${filter.name}`);
        if (slide) {
          slide.appendChild(filter.image);
          console.log(caman);
          caman(`#${filter.image.id}`, function() {
            this[filter.name]().render();
          });
          clearInterval(interval);
        }
      }, 1000);
    })
  };

  useEffect(() => {
    parseFilters();
  }, []);

  const [uploadFile] = useMutation(UPLOAD_GENERATED_FILTERS);

  const generatePreview = () => {
    filters.forEach(filter => {
      const canvas = document.getElementById(filter.image.id);
      const file = canvasToBlob(canvas, null, filter.name);
      uploadFile({
        variables: {
          file
        }
      })
    })
  };


  return (
    <div className="container">
      <div className={style.Wrapper}>
        <h1>Generated Filter Preview</h1>
        <div className={style.Filters}>
          { filters.map((filter, index) => {
            return (
              <div className={style.Filter} key={index} id={`it-${filter.name}`}>
                <div className={style.FilterName}>
                  { filter.name }
                </div>
              </div>
            )
          }) }
        </div>
        <Button label="Generate Preview" onClick={generatePreview} />
      </div>
    </div>
  )
}
