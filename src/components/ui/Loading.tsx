import React, { Component } from 'react';


type Props = {};
type State = {};

class Loading extends Component<Props, State> {

    render() {
        return (
            <div className="d-flex flex-column align-items-center my-5 py-5 w-100">
                <div className="spinner-border text-qrqc" role="status">
                    <span className="visually-hidden">Chargement...</span>
                </div>

                <div className="text-qrqc mt-3">Chargement...</div>
            </div>
        );
    }
}

export default Loading;