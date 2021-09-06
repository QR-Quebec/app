import React, { Component } from 'react';
import { RouteComponentProps, StaticContext } from 'react-router';

//Composantes
import ErrorWronngAlg from 'components/pages/errors/ErrorWrongAlg';

type LocationState = { alg: string };
type PathParams = {};
type Props = RouteComponentProps<PathParams, StaticContext, LocationState> & {};
type State = {};

class PassportsInvalidAlg extends Component<Props, State> {

  render() {
    return (
      <div className="container-fluid">
        <ErrorWronngAlg alg={this.props.location.state.alg} />
      </div>
    );
  }
}

export default PassportsInvalidAlg;