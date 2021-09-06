import React, { Component } from 'react';
import { RouteComponentProps, StaticContext } from 'react-router';
import { withRouter } from 'react-router-dom';

//Styles
import './PaypalButton.scss';

//Components
import { Button, Modal } from 'react-bootstrap';

//Libs
import { licenceExists, paypalOrderInit, paypalOrderCaptured } from 'lib/api';
import { syncUsageStats } from 'lib/sync';
import * as localForage from 'localforage';

//PayPal
import { PayPalButtons } from '@paypal/react-paypal-js';
import { CreateOrderActions, OnApproveData, OnApproveActions, UnknownObject, OnCancelledActions, OnClickActions } from '@paypal/paypal-js/types/components/buttons'

//Types
import { Licences, Licence } from 'types/Licence';

type LocationState = {};
type PathParams = {};
type Props = RouteComponentProps<PathParams, StaticContext, LocationState> & { product: string, description: string, price: string, routeOnCompleted: string, };
type State = { email: string, readyToValidate: boolean, alreadyPurchased: boolean };

class PaypalButton extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.emailOnChange = this.emailOnChange.bind(this);
        this.isEmailValid = this.isEmailValid.bind(this);
        this.paypalClick = this.paypalClick.bind(this);
        this.paypalCreateOrder = this.paypalCreateOrder.bind(this);
        this.paypalApprove = this.paypalApprove.bind(this);
        this.paypalCancel = this.paypalCancel.bind(this);
        this.paypalError = this.paypalError.bind(this);
        this.alreadyPurchasedClosed = this.alreadyPurchasedClosed.bind(this);

        this.state = {
            email: '',
            readyToValidate: false,
            alreadyPurchased: false,
        };
    }

    async componentDidMount() {
        syncUsageStats();

        let email: string | null = await localForage.getItem('email');

        if (email) {
            this.setState({ email: email, readyToValidate: true });
            this.isEmailValid();
        } else {
            this.setState({ readyToValidate: false });
        }
    }

    onSubmit(event: React.FormEvent) {
        event.preventDefault();
        return false;
    }

    emailOnChange(event: React.FormEvent<HTMLInputElement>) {
        this.setState({ email: event.currentTarget.value });

        this.isEmailValid();
    }

    isEmailValid(): boolean {
        let emailField = document.getElementById('email-field') as HTMLInputElement;
        let buttonOverlay = document.getElementById('button-overlay') as HTMLElement;

        if (emailField && buttonOverlay) {
            if (!emailField.checkValidity()) {
                emailField.classList.remove('is-valid');
                emailField.classList.add('is-invalid');

                buttonOverlay.classList.add('paypal-button--disabled-overlay');

                return false;
            }

            emailField.classList.remove('is-invalid');
            emailField.classList.add('is-valid');

            buttonOverlay.classList.remove('paypal-button--disabled-overlay');

            return true;
        }

        return false;
    }

    async paypalClick(data: UnknownObject, actions: OnClickActions) {
        if (!this.isEmailValid()) {
            return actions.reject();
        }

        let email: string | null = null;
        let emailField = document.getElementById('email-field') as HTMLInputElement;
        if (emailField) {
            email = emailField.value;
            await localForage.setItem('email', email);

            let licence = await licenceExists(email, this.props.product);

            if (licence && licence.exists) {
                this.setState({ alreadyPurchased: true });
                return actions.reject();
            }
        }

        return actions.resolve();
    }

    paypalCreateOrder(data: UnknownObject, actions: CreateOrderActions) {
        return actions.order.create({
            purchase_units: [
                {
                    custom_id: this.props.product,
                    description: this.props.description,
                    amount: {
                        value: this.props.price,
                    },
                },
            ],
            application_context: {
                brand_name: 'QR Québec',
                shipping_preference: 'NO_SHIPPING',
            },
        });
    }


    async paypalApprove(data: OnApproveData, actions: OnApproveActions) {
        let email: string | null = null;
        let emailField = document.getElementById('email-field') as HTMLInputElement;
        if (emailField) {
            email = emailField.value;
        }

        await paypalOrderInit(email, this.props.product, data);

        let details: any = await actions.order.capture();

        let licence = await paypalOrderCaptured(email, details);

        if (licence) {
            let licences = await localForage.getItem<Licences>('licences');

            if (!licences) {
                licences = [];
            }

            let newLicence = {} as Licence;
            newLicence.product = licence?.product;
            newLicence.licence = licence?.licence;

            licences.push(newLicence);

            await localForage.setItem('licences', licences);

            this.props.history.push(this.props.routeOnCompleted, { product: licence.product, description: this.props.description });
            return;
        }

        //PAS DE LICENCE ? TODO
    }

    async paypalCancel(data: UnknownObject, actions: OnCancelledActions) {
        //TODO message ?
    }

    async paypalError(err: UnknownObject) {
        //TODO redirect to error page
        console.error(err);
    }

    alreadyPurchasedClosed() {
        this.setState({ alreadyPurchased: false });
    }

    render() {
        return (
            <div>
                <form id="paypal-form" className={'needs-validation ' + (this.state.readyToValidate ? 'was-validated' : '')} noValidate onSubmit={this.onSubmit}>
                    <div className="mb-3">
                        <label className="form-label" htmlFor="email-field">
                            Adresse courriel:
                            <br className="d-inline d-sm-none" />
                            <small className="ms-0 ms-sm-2 text-muted">(pour la confirmation de paiement)</small>
                        </label>
                        <input id="email-field" className="form-control" type="email" required placeholder="votre-nom@fournisseur.qc.ca" value={this.state.email} onChange={this.emailOnChange} />

                        <div className="valid-feedback">
                            Adresse courriel valide
                        </div>

                        <div className="invalid-feedback">
                            Veuillez saisir une adresse courriel valide
                        </div>
                    </div>
                </form>

                <div id="button-overlay" className="paypal-button--disabled-overlay">
                    <PayPalButtons
                        style={{ layout: 'horizontal', tagline: false }}
                        onClick={this.paypalClick}
                        createOrder={this.paypalCreateOrder}
                        onApprove={this.paypalApprove}
                        onCancel={this.paypalCancel}
                        onError={this.paypalError}
                    />
                </div>

                <Modal
                    centered
                    show={this.state.alreadyPurchased}
                    onHide={this.alreadyPurchasedClosed}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Article déjà acheté !</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <p>
                            Vous avez déjà acheté cet article précédemment.
                        </p>
                        <p>
                            Dirigez-vous dans la
                            section <span className="fw-bold text-qrqc">Aide</span> et
                            sélectionnez <span className="fw-bold text-qrqc">Récupérer mes achats</span> pour
                            le récupérer sur cet appareil.
                        </p>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.alreadyPurchasedClosed}>Fermer</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}

export default withRouter(PaypalButton);