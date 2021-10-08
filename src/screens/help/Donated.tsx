import React, { Component } from 'react';
import { RouteComponentProps, StaticContext } from 'react-router';

//Styles
import './Donated.scss';
import { colors } from 'consts/colors';

//Icones
import { ReactComponent as ThumbsUpSolid } from 'assets/svg/fontawesome-5-pro/thumbs-up-solid.svg';

//Images
import Cart from 'assets/img/cart.png';

type LocationState = {};
type PathParams = {};
type Props = RouteComponentProps<PathParams, StaticContext, LocationState> & {};
type State = {};

class HelpDonated extends Component<Props, State> {
  render() {
    return (
      <div className="container-fluid help-donated">
        <div className="alert alert-great-success help-donated--header mt-3" role="alert">
          <ThumbsUpSolid className="me-2" height="24px" width="24px" color={colors.active} />
          QR Québec vous remercie !
        </div>

        <div className="card mt-3">
          <div className="card-header">
            Merci pour votre don !
          </div>

          <div className="card-body fs-6">
            <div className="mb-3">
              L'équipe de QR Québec vous remercie pour votre soutien !
            </div>

            <div className="text-center mb-3">
              <img className="sm-img" src={Cart} alt="Panier d'achat" />
            </div>

            <div className="mb-3">
              Votre don nous permet de poursuivre le développement de ce projet.
            </div>
          </div>
        </div>

        <br />
      </div>
    );
  }
}

export default HelpDonated;