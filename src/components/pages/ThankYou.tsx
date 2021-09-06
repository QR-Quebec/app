import React, { Component } from 'react';

//Style
import './ThankYou.scss';
import { colors } from 'consts/colors';

//Icones
import { ReactComponent as ThumbsUpSolid } from 'assets/svg/fontawesome-5-pro/thumbs-up-solid.svg';

//Images
import Cart from 'assets/img/cart.png';

//Components
import ErrorMissingState from 'components/pages/errors/ErrorMissingState';

type Props = { product: string, description: string };
type State = {};

class ThankYou extends Component<Props, State> {
  render() {
    if (!this.props || !this.props.product) {
      return (
        <ErrorMissingState message="props.product" />
      );
    }

    if (!this.props || !this.props.description) {
      return (
        <ErrorMissingState message="props.description" />
      );
    }

    return (
      <div>
        <div className="alert alert-great-success thank-you--header mt-3" role="alert">
          <ThumbsUpSolid className="me-2" height="24px" width="24px" color={colors.active} />
          QR Québec vous remercie !
        </div>

        <div className="card mt-3">
          <div className="card-header">
            Votre achat est confirmé
          </div>

          <div className="card-body fs-6">
          <div className="mb-1">
              Vous avez acheté l'option:
            </div>

            <div className="thank-you--description mb-3" role="alert">
              {this.props.description}
            </div>

            <div className="mb-3">
              Cette option est maintenant active, vous pouvez en profiter immédiatement.
            </div>

            <div className="text-center mb-3">
              <img className="sm-img" src={Cart} alt="Panier d'achat" />
            </div>

            <div className="mb-3">
              Votre paiement est complété, vous recevrez une confirmation par courriel dans les prochaines minutes.
              Si vous ne trouvez pas ce courriel, vérifiez votre dossier de courriels indésirables.
            </div>

            <div className="mb-3">
              L'équipe de QR Québec vous remercie pour votre soutien ! Votre achat nous permet de poursuivre le développement de ce projet.
            </div>
          </div>
        </div>

        <br />
      </div>
    );
  }
}

export default ThankYou;