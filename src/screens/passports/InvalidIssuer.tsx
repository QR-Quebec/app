import React, { Component } from 'react';
import { RouteComponentProps, StaticContext } from 'react-router';

//Composantes
import ErrorWronngIssuer from 'components/pages/errors/ErrorWrongIssuer';

type LocationState = { issuer: string };
type PathParams = {};
type Props = RouteComponentProps<PathParams, StaticContext, LocationState> & {};
type State = {};

class PassportsInvalidIssuer extends Component<Props, State> {

  render() {
    return (
      <div className="container-fluid">
        <ErrorWronngIssuer issuer={this.props.location.state.issuer} />
      </div>
    );
  }
}

export default PassportsInvalidIssuer;