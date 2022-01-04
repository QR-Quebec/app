import React, { Component } from 'react';
import { RouteComponentProps, StaticContext } from 'react-router';
import { withRouter } from 'react-router-dom';

//Styles
import './PaypalButton.scss';

//Libs
import { setDonation } from 'lib/data';

//PayPal
import { PayPalButtons } from '@paypal/react-paypal-js';
import { CreateOrderActions, OnApproveData, OnApproveActions, UnknownObject, OnCancelledActions, OnClickActions } from '@paypal/paypal-js/types/components/buttons'

type LocationState = {};
type PathParams = {};
type Props = RouteComponentProps<PathParams, StaticContext, LocationState> & { description: string, price: string, routeOnCompleted: string, };
type State = {};

class PaypalButton extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.paypalClick = this.paypalClick.bind(this);
        this.paypalCreateOrder = this.paypalCreateOrder.bind(this);
        this.paypalApprove = this.paypalApprove.bind(this);
        this.paypalCancel = this.paypalCancel.bind(this);
        this.paypalError = this.paypalError.bind(this);
    }

    async paypalClick(data: UnknownObject, actions: OnClickActions) {
        return actions.resolve();
    }

    paypalCreateOrder(data: UnknownObject, actions: CreateOrderActions) {
        return actions.order.create({
            purchase_units: [
                {
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
        setDonation(Number.parseInt(this.props.price));

        this.props.history.push(this.props.routeOnCompleted);
        return;
    }

    async paypalCancel(data: UnknownObject, actions: OnCancelledActions) {
        //TODO message ?
    }

    async paypalError(err: UnknownObject) {
        //TODO redirect to error page
        console.error(err);
    }

    render() {
        return (
            <PayPalButtons
                style={{ layout: 'horizontal', tagline: false }}
                onClick={this.paypalClick}
                createOrder={this.paypalCreateOrder}
                onApprove={this.paypalApprove}
                onCancel={this.paypalCancel}
                onError={this.paypalError}
            />
        );
    }
}

export default withRouter(PaypalButton);