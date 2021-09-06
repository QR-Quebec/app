import React, { Component } from 'react';
import { RouteComponentProps, StaticContext } from 'react-router';

//Composantes
import ErrorNotShc from 'components/pages/errors/ErrorNotShc';

type LocationState = { qrData: string };
type PathParams = {};
type Props = RouteComponentProps<PathParams, StaticContext, LocationState> & {};
type State = {};

class PassportsInvalidNotShc extends Component<Props, State> {

  render() {
    return (
      <div className="container-fluid">
        <ErrorNotShc qrData={this.props.location.state.qrData} />
      </div>
    );
  }
}

export default PassportsInvalidNotShc;