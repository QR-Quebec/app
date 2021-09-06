import React, { Component } from 'react';

//Style
import './ErrorNotShc.scss';
import { colors } from 'consts/colors';

//Images
import RickRoll from 'assets/img/error.png';

//Icônes
import { ReactComponent as FileTimesSolid } from 'assets/svg/fontawesome-5-pro/file-times-solid.svg';

type Props = { qrData: string };
type State = {};

class ErrorNotShc extends Component<Props, State> {

  render() {
    return (
      <div>
        <div className="alert alert-great-danger invalid-notshc--header mt-3" role="alert">
          <FileTimesSolid className="me-2" height="28px" width="28px" color={colors.active} />
          Ce code QR est invalide
        </div>

        <div className="card">
          <div className="card-header">
            Ceci n'est pas une preuve de vaccination
          </div>

          <div className="card-body fs-6">
            Le code QR que vous avez numérisé n'est pas une preuve de vaccination.
            <br />
            <div className="text-center">
              <img src={RickRoll} alt="Erreur" />
            </div>
          </div>

          <div className="card-footer">
            <div className="text-qrqc fw-bold">Contenu du code QR numérisé:</div>
            <div className="text-muted invalid-notshc--qrdata fs-6 mt-1">{this.props.qrData}</div>
          </div>
        </div>

        <br />
      </div>
    );
  }
}

export default ErrorNotShc;