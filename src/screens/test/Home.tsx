import React, { Component } from 'react';
import { Link } from 'react-router-dom';

//Style
import './Home.scss';

type Props = {};
type State = {};

class TestHome extends Component<Props, State> {
  render() {

    return (
      <div className="container-fluid">
        <br />
        <Link to="/test/api">
          <button type="button" className="btn btn-qrqc w-100 mb-3">API</button>
        </Link>
      </div>
    );
  }
}

export default TestHome;