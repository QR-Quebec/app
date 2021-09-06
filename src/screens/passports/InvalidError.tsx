import React, { Component } from 'react';
import { RouteComponentProps, StaticContext } from 'react-router';

//Composantes
import ErrorOther from 'components/pages/errors/ErrorOther';

type LocationState = { message: string };
type PathParams = {};
type Props = RouteComponentProps<PathParams, StaticContext, LocationState> & {};
type State = {};

class PassportsInvalidError extends Component<Props, State> {

  render() {
    return (
      <div className="container-fluid">
        <ErrorOther message={this.props.location.state.message} />
      </div>
    );
  }
}

export default PassportsInvalidError;