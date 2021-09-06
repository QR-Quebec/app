import React, { Component } from 'react';

//Style
import './ErrorMissingState.scss';
import { colors } from 'consts/colors';

//Images
import RickRoll from 'assets/img/error.png';

//Icônes
import { ReactComponent as FileTimesSolid } from 'assets/svg/fontawesome-5-pro/file-times-solid.svg';

type Props = { message: string };
type State = {};

class ErrorMissingState extends Component<Props, State> {

  render() {
    return (
      <div>
        <div className="alert alert-great-danger invalid-missing-state--header mt-3" role="alert">
          <FileTimesSolid className="me-2" height="28px" width="28px" color={colors.active} />
          État introuvable
        </div>

        <div className="card">
          <div className="card-header">
            L'état de cette page à expiré
          </div>

          <div className="card-body fs-6">
            La page à laquelle vous avez accédé requiert un état, mais celui-ci à probablement expiré.
            <br />
            <div className="text-center">
              <img src={RickRoll} alt="Erreur" />
            </div>
          </div>

          <div className="card-footer">
            <div className="text-qrqc fw-bold">État manquant:</div>
            <div className="text-muted fs-6 mt-1">{this.props.message}</div>
          </div>
        </div>

        <br />
      </div>
    );
  }
}

export default ErrorMissingState;