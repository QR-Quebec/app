import React, { Component } from 'react';

//Style
import './ErrorCrash.scss';

type Props = { error: any, errorInfo: any };
type State = {};

class ErrorCrash extends Component<Props, State> {

  render() {
    return (
      <div>
        <div className="alert alert-great-danger invalid-crash--header mt-3" role="alert">
          <span className="ms-2">Erreur interne</span>
        </div>

        <div className="card">
          <div className="card-header">
            Une erreur interne s'est produite
          </div>

          <div className="card-body fs-6">
            Une erreur interne s'est produite et QR Québec a planté.

            <div className="mt-3 mb-3 text-center">
              <a className="btn btn-qrqc" href="/">Relancer l'application</a>
            </div>

            Si cette erreur se reproduit de nouveau, veuillez envoyer les informations ci-dessous
            à l'adresse <a href="mailto:support@kyber.studio">support@kyber.studio</a> afin
            que nous investiguions la situation.
          </div>

          <div className="card-footer">
            <div className="text-qrqc fw-bold">Erreur technique:</div>
            <div className="text-muted fs-6 mt-1">
              <pre>
                {this.props.error && this.props.error.toString()}
              </pre>
            </div>

            <div className="text-qrqc fw-bold mt-3">Call stack:</div>
            <div className="text-muted fs-6 mt-1">
              <pre>
                {this.props.error && this.props.error.stack && this.props.error.stack.toString()}
              </pre>
            </div>

            <div className="text-qrqc fw-bold mt-3">Component stack:</div>
            <div className="text-muted fs-6">
              <pre>
                {this.props.errorInfo && this.props.errorInfo.componentStack && this.props.errorInfo.componentStack.toString()}
              </pre>
            </div>
          </div>
        </div>

        <br />
      </div>
    );
  }
}

export default ErrorCrash;