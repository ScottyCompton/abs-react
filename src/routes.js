import React from 'react';
import { browserHistory, IndexRoute, Route, Router } from 'react-router';

import {
  App,
  Archive,
  Bio,
  Content,
  Credits,
  GetTheLook,
  Home,
  IVP,
  NotFound,
  Page,
  Search,
  Show,
  Sponsors,
  Watch
} from 'containers';

export default (store) => {
  return (
    <Router history={browserHistory}>
      <Route path="/" component={App}>
        { /* Home (main) route */ }
        <IndexRoute component={Home}/>

        { /* Static routes at the top so they get intercepted first */ }

        <Route path="show" component={Show}/>
        <Route path="get-the-look" component={GetTheLook}/>

        { /* Content pages */ }
        <Route path="articles/:taxonomy/:slug" component={Content} postType="article"/>
        <Route path="tutorials/:taxonomy/:slug" component={Content} postType="tutorial"/>
        <Route path="looks/:taxonomy/:slug" component={Content} postType="look"/>
        <Route path="sweepstakes/:slug" component={Page}/>
        <Route path="pages/:slug" component={Page}/>

        { /* Content archive pages */ }
        <Route path="articles" component={Archive} postType="article"/>
        <Route path="tutorials" component={Archive} postType="tutorial"/>
        <Route path="looks" component={Archive} postType="look"/>
        <Route path="sweepstakes" component={Archive} postType="sweepstake"/>

        { /* Judge and host pages */ }
        <Route path="show/host/:slug" component={Bio} bioType="host"/>
        <Route path="show/judge/:slug" component={Bio} bioType="judge"/>
        <Route path="show/contestant/:slug" component={Bio} bioType="contestant"/>

        { /* IVPs */ }
        <Route path="watch" component={Watch} activeSlugName="watch"/>
        <Route path="watch/:slug" component={IVP}/>
        <Route path="watch/:slug/video/:video" component={IVP}/>
        {/* <Route path="watch/:slug/:childSlug/:video" component={IVP}/> */}
        <Route path="watch/:slug/:childSlug/video/:video" component={IVP}/>
        <Route path="video/:video" component={IVP} videoType="single"/>

        <Route path="search/:query" component={Search}/>

        { /* Catch all route */ }
        <Route path="*" component={NotFound} status={404}/>
      </Route>
    </Router>
  );
};
