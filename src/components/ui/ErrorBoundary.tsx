import React, { Component, ErrorInfo } from 'react';

//Components
import ErrorCrash from 'components/pages/errors/ErrorCrash';

type Props = {};
type State = { hasError: boolean, error: Error|null, errorInfo: ErrorInfo|null };

class ErrorBoundary extends Component<Props, State> {
    constructor(props) {
        super(props);

        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
        };
      }

      /*
      static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
      }
      */

      componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        this.setState({
            hasError: true,
            error: error,
            errorInfo: errorInfo
        })

        // You can also log the error to an error reporting service
        //logErrorToMyService(error, errorInfo);
      }

      render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return (
                <div className="container-fluid">
                    <ErrorCrash error={this.state.error} errorInfo={this.state.errorInfo}></ErrorCrash>
                </div>
            );
        }

        return this.props.children;
      }
}

export default ErrorBoundary;