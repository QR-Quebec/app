import React, { Component } from 'react';

//Style
import './ErrorPageNotFound.scss';
import { colors } from 'consts/colors';

//Images
import RickRoll from 'assets/img/error.png';

//Icônes
import { ReactComponent as FileTimesSolid } from 'assets/svg/fontawesome-5-pro/file-times-solid.svg';

type Props = {};
type State = {};

class ErrorPageNotFound extends Component<Props, State> {

  render() {
    return (
      <div>
        <div className="alert alert-great-danger invalid-page-not-found--header mt-3" role="alert">
          <FileTimesSolid className="me-2" height="28px" width="28px" color={colors.active} />
          Page introuvable
        </div>

        <div className="card">
          <div className="card-header">
            Cette page n'existe pas
          </div>

          <div className="card-body fs-6">
            La page à laquelle vous avez accédé n'existe pas.
            <br />
            <div className="text-center">
              <img src={RickRoll} alt="Erreur" />
            </div>
          </div>
        </div>

        <br />
      </div>
    );
  }
}

export default ErrorPageNotFound;