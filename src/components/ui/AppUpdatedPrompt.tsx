import React, { Component } from 'react';
import { withServiceWorkerUpdater } from '@3m1/service-worker-updater';

//Styles
import './AppUpdatedPrompt.scss';

type Props = { newServiceWorkerDetected: boolean, onLoadNewServiceWorkerAccept: any };
type State = {};

class AppUpdatedPrompt extends Component<Props, State> {

  render() {
    if (this.props.newServiceWorkerDetected) {
      return (
        <div className="toast show p-3" role="alert" aria-live="assertive" aria-atomic="true">
          <div className="toast-header text-qrqc">
            <strong className="me-auto">Nouvelle version disponible !</strong>
            <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
          </div>
          <div className="toast-body">
            Une nouvelle version de <span className="text-qrqc fw-bold">QR Québec</span> est maintenant installée !
            <br /><br />
            Relancez l'application pour en profiter !
            <div className="text-center">
              <button type="button" className="btn btn-qrqc mt-4" onClick={ this.props.onLoadNewServiceWorkerAccept }>Relancer</button>
            </div>
          </div>
        </div>
      );
    }

    return null;
  }
}

export default withServiceWorkerUpdater(AppUpdatedPrompt);