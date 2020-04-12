import React, { useEffect, useState } from 'react';
import Flicking from '@egjs/react-flicking';
import filtersJson from '../../data/filters';
import { startCase } from 'lodash';
import NormalFilter from '../../assets/forFilter.jpg';
import style from './ImageFilters.module.scss';
import cx from 'classnames';

const STATIC_SERVER = process.env.REACT_APP_STATIC_SERVER || 'http://localhost:4000';

export default ({ imageUploaded, onSelectFilter, onRevertFilter }) => {
  const [filters, setFilters] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('Normal');

  const parseFilters = () => {
    const filters = filtersJson.map(filter => {
      return {
        name: filter,
        image: `${STATIC_SERVER}/static/filters/${filter}.jpg`
      }
    });
    setFilters(filters);
  };

  useEffect(() => {
    parseFilters();
  }, []);

  const selectFilteredImage = filter => {
    onSelectFilter(filter);
    setSelectedFilter(filter);
  };

  const revertFilter = () => {
    onRevertFilter();
    setSelectedFilter('Normal')
  }

  return (
    <div className={`${style.ImageFilter} ${!imageUploaded ? style.disabled : null}`}>
      <Flicking
        moveType={'freeScroll'}
        gap={10}
        anchor="0"
        hanger="0"
        className={style.Slider}
      >
        <div className={cx(style.Filter, selectedFilter === 'Normal' && style.active)} onClick={revertFilter}>
          <div className={style.FilterName}>
            Normal
          </div>
          <div className={style.FilterImage}>
            <img src={NormalFilter} alt="Normal" />
          </div>
        </div>
        { filters.map((filter, index) => {
          return (
            <div className={cx(style.Filter, selectedFilter === filter.name && style.active)} key={index} id={`it-${filter.name}`} onClick={() => selectFilteredImage(filter.name)}>
              <div className={style.FilterName}>
                { startCase(filter.name) }
              </div>
              <div className={style.FilterImage}>
                <img src={filter.image} data-preset={filter.name} alt={filter.name} />
              </div>
            </div>
          )
        }) }
      </Flicking>
    </div>
  )
};
