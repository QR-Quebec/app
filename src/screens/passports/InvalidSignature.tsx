import React, { Component } from 'react';
import { RouteComponentProps, StaticContext } from 'react-router';

//Composantes
import ErrorInvalidSignature from 'components/pages/errors/ErrorInvalidSignature';

type LocationState = { message: string };
type PathParams = {};
type Props = RouteComponentProps<PathParams, StaticContext, LocationState> & {};
type State = {};

class PassportsInvalidSignature extends Component<Props, State> {

  render() {
    return (
      <div className="container-fluid">
        <ErrorInvalidSignature message={this.props.location.state.message} />
      </div>
    );
  }
}

export default PassportsInvalidSignature;