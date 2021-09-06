import React, { Component } from 'react';

//Style
import './ErrorWrongAlg.scss';
import { colors } from 'consts/colors';

//Images
import RickRoll from 'assets/img/error.png';

//Icônes
import { ReactComponent as FileTimesSolid } from 'assets/svg/fontawesome-5-pro/file-times-solid.svg';

type Props = { alg: string };
type State = {};

class ErrorWrongAlg extends Component<Props, State> {

  render() {
    return (
      <div>
        <div className="alert alert-great-danger wrong-alg--header mt-3" role="alert">
          <FileTimesSolid className="me-2" height="28px" width="28px" color={colors.active} />
          Ce code QR semble invalide
        </div>

        <div className="card">
          <div className="card-header">
            L'algorithme de signature de ce code QR n'est pas celui attendu
          </div>

          <div className="card-body fs-6">
            Le code QR que vous avez numérisé n'utilise pas l'algorithme de signature utilisé par le Gouvernement du Québec.
            <br />
            <div className="text-center">
              <img src={RickRoll} alt="Erreur" />
            </div>
          </div>

          <div className="card-footer">
            <div className="text-qrqc fw-bold">Algorithme de signature du code QR numérisé:</div>
            <div className="text-muted fs-6 mt-1">{this.props.alg}</div>
          </div>
        </div>

        <br />
      </div>
    );
  }
}

export default ErrorWrongAlg;