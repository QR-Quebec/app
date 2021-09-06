import React, { Component } from 'react';

//Style
import './ErrorInvalidSignature.scss';
import { colors } from 'consts/colors';

//Images
import RickRoll from 'assets/img/error.png';

//Icônes
import { ReactComponent as FileTimesSolid } from 'assets/svg/fontawesome-5-pro/file-times-solid.svg';

type Props = { message: string };
type State = {};

class ErrorInvalidSignature extends Component<Props, State> {

  render() {
    return (
      <div>
        <div className="alert alert-great-danger invalid-signature--header mt-3" role="alert">
          <FileTimesSolid className="me-2" height="28px" width="28px" color={colors.active} />
          Ce code QR semble invalide
        </div>

        <div className="card">
          <div className="card-header">
            La signature numérique est invalide
          </div>

          <div className="card-body fs-6">
            Le code QR que vous avez numérisé ne contient pas de signature numérique ou celle-ci est invalide.
            <br />
            <div className="text-center">
              <img src={RickRoll} alt="Erreur" />
            </div>
          </div>

          <div className="card-footer">
            <div className="text-qrqc fw-bold">Erreur technique:</div>
            <div className="text-muted fs-6 mt-1">{this.props.message[0].toLocaleUpperCase() + this.props.message.slice(1)}</div>
          </div>
        </div>

        <br />
      </div>
    );
  }
}

export default ErrorInvalidSignature;