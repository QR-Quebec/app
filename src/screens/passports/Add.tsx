import React, { Component } from 'react';
import { RouteComponentProps, StaticContext } from 'react-router';
import { withRouter } from 'react-router-dom';

//Libs
import { canAddPassport } from 'lib/limits';

//Components
import Loading from 'components/ui/Loading';
import QrCamera from 'components/pages/QrCamera';

type LocationState = {};
type PathParams = {};
type Props = RouteComponentProps<PathParams, StaticContext, LocationState> & { baseUrl: string, facingMode: string };
type State = { canAdd: boolean };

class PassportsAdd extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      canAdd: false,
    };
  }

  async componentDidMount() {
    //Si on a pu de place, on dirige vers achat
    if (!await canAddPassport()) {
      this.props.history.push('/presenter/ajouter/limite');
      return;
    }

    this.setState({ canAdd: true });
  }

  render() {
    if (!this.state.canAdd) {
      return (
        <Loading />
      );
    }

    return (
      <QrCamera routeOnValid="/presenter/confirmer" routeOnNotShc="/presenter/invalide/format" routeOnWrongAlg="/presenter/invalide/alg" routeOnWrongIssuer="/presenter/invalide/issuer" routeOnInvalidSignature="/presenter/invalide/signature" routeOnError="/presenter/invalide/erreur" />
    );
  }
}

export default withRouter(PassportsAdd);