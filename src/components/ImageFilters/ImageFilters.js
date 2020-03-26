import React, { useEffect, useState } from 'react';
import Carousel from '@brainhubeu/react-carousel';
import filtersJson from '../../data/filters';
import style from './ImageFilters.module.scss';
import '@brainhubeu/react-carousel/lib/style.css';

const STATIC_SERVER = process.env.REACT_APP_STATIC_SERVER || 'http://localhost:4000';

export default ({ onSelectFilter }) => {
  const [filters, setFilters] = useState([]);

  const parseFilters = () => {
    const filters = filtersJson.map(filter => {
      return {
        name: filter,
        image: STATIC_SERVER + '/static/filters/' + `${filter}.jpg`
      }
    });
    setFilters(filters);
  };

  useEffect(() => {
    parseFilters();
  }, []);

  const selectFilteredImage = filter => {
    onSelectFilter(filter);
  };

  return (
    <div className={style.ImageFilter}>
      <Carousel
        id="filterCarousel"
        slidesPerPage={6}
        breakpoints={{
          980: {
            slidesPerPage: 5
          },
          500: {
            slidesPerPage: 4
          },
          320: {
            slidesPerPage: 3
          }
        }}
      >
        { filters.map((filter, index) => {
          return (
            <div className={style.Filter} key={index} id={`it-${filter.name}`} onClick={() => selectFilteredImage(filter.name)}>
              <div className={style.FilterName}>
                { filter.name }
              </div>
              <div className={style.FilterImage}>
                <img src={filter.image} data-preset={filter.name} alt={filter.name} />
              </div>
            </div>
          )
        }) }
      </Carousel>
    </div>
  )
};
