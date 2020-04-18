import React from 'react';
import PropTypes from 'prop-types';
import SkeletonString from '../Skeleton/SkeletonString';
import style from './Profile.module.scss';

const ProfileBio = ({ profile, isMobile }) => {

  return (
    <div className={`${style.ProfileBio} ${isMobile && style.ProfileBioMobile}`}>
      { profile ?
        <React.Fragment>
          <h2>{ profile.fullName }</h2>
          { profile.bio && <span>{ profile.bio }</span> }
          { profile.website && <a href={profile.website} target="_blank" rel="noopener noreferrer">{ profile.website }</a> }
        </React.Fragment>
        : <SkeletonString height={16} width={300} />
      }
    </div>
  )
};

ProfileBio.propTypes = {
  isMobile: PropTypes.bool,
  loading: PropTypes.bool
};

export default ProfileBio;

