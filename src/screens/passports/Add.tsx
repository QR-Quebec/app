import React, { Component } from 'react';
import { RouteComponentProps, StaticContext } from 'react-router';
import { withRouter } from 'react-router-dom';

//Components
import QrCamera from 'components/pages/QrCamera';

type LocationState = {};
type PathParams = {};
type Props = RouteComponentProps<PathParams, StaticContext, LocationState> & { baseUrl: string, facingMode: string };
type State = {};

class PassportsAdd extends Component<Props, State> {
  render() {
    return (
      <QrCamera routeOnValid="/presenter/confirmer" routeOnNotShc="/presenter/invalide/format" routeOnWrongAlg="/presenter/invalide/alg" routeOnWrongIssuer="/presenter/invalide/issuer" routeOnInvalidSignature="/presenter/invalide/signature" routeOnError="/presenter/invalide/erreur" />
    );
  }
}

export default withRouter(PassportsAdd);