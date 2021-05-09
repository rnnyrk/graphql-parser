import React, { lazy, Suspense } from 'react';
import { Switch, Route, withRouter, RouteComponentProps } from 'react-router-dom';
import { useQuery, gql } from '@apollo/client';

import GlobalStyle from 'styles';

const Prime = lazy(() => import('modules/Prime'));

const LARGER_AS = gql`
  query {
    larger_as(Value: 100000) {
      Year
      Value
    }
  }
`;

const App: React.FC<RouteComponentProps> = () => {
  const { loading, error, data } = useQuery(LARGER_AS);
  console.log({ loading, error, data });

  return (
    <main>
      <GlobalStyle />
      <Suspense fallback={<span>loading</span>}>
        <Switch>
          <Route path="/" component={Prime} exact />
        </Switch>
      </Suspense>
    </main>
  );
};

export default withRouter(App);
