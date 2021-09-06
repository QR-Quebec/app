import React, { Component } from 'react';
import { RouteComponentProps, StaticContext } from 'react-router';

//Styles
import './AddLimitPurchased.scss';

//Components
import ErrorMissingState from 'components/pages/errors/ErrorMissingState';
import ThankYou from 'components/pages/ThankYou';

type LocationState = { product: string, description: string };
type PathParams = {};
type Props = RouteComponentProps<PathParams, StaticContext, LocationState> & {};
type State = {};

class PassportsAddLimitPurchased extends Component<Props, State> {
  render() {
    if (!this.props || !this.props.location || !this.props.location.state || !this.props.location.state.product) {
      return (
        <div className="container-fluid">
          <ErrorMissingState message="location.state.product" />
        </div>
      );
    }

    if (!this.props || !this.props.location || !this.props.location.state || !this.props.location.state.description) {
      return (
        <div className="container-fluid">
          <ErrorMissingState message="location.state.description" />
        </div>
      );
    }

    return (
      <div className="container-fluid">
        <ThankYou product={this.props.location.state.product} description={this.props.location.state.description} />
      </div>
    );
  }
}

export default PassportsAddLimitPurchased;