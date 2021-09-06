import React, { Component } from 'react';

//Components
import ErrorPageNotFound from 'components/pages/errors/ErrorPageNotFound';

type Props = {};
type State = {};

class ErrorNotFound extends Component<Props, State> {
  render() {
    return (
      <div className="container-fluid">
        <ErrorPageNotFound />
      </div>
    );
  }
}

export default ErrorNotFound;