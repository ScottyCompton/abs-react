import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { reducer as reduxAsyncConnect } from 'redux-connect';
import progress from './progress';
import 'babel-polyfill';
import { intlReducer } from 'react-intl-redux';

import apiAccess from './apiAccess';
import archive from './archive';
import featuredOptions from './featuredOptions';
import featuredCarousel from './featuredCarousel';
import blogFeaturedCarousel from './blogFeaturedCarousel';
import blogFeaturedSections from './blogFeaturedSections';
import showFeaturedCarousel from './showFeaturedCarousel';
import showFeaturedSections from './showFeaturedSections';
import bio from './bio';
import hero from './hero';
import instagram from './instagram';
import ivp from './ivp';
import mailchimp from './mailchimp';
import player from './player';
import post from './post';
import randomPosts from './randomPosts';
import collage from './collage';
import search from './search';
import watch from './watch';
import { reducer as form } from 'redux-form';

export default combineReducers({
  routing: routerReducer,
  reduxAsyncConnect,
  apiAccess,
  archive,
  featuredOptions,
  featuredCarousel,
  blogFeaturedCarousel,
  blogFeaturedSections,
  showFeaturedCarousel,
  showFeaturedSections,
  progress,
  bio,
  hero,
  instagram,
  ivp,
  mailchimp,
  post,
  player,
  randomPosts,
  collage,
  search,
  watch,
  intl: intlReducer,
});
