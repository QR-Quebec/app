import React, { Component } from 'react';

//Components
import Loading from 'components/ui/Loading';

type Props = {};
type State = { time: string };

class TestApi extends Component<Props, State> {
  timer: any;

  componentDidMount() {
    this.timer = setInterval(async () => {
      try {
        let response = await fetch(process.env.REACT_APP_API_URL + '/time');
        let data = await response.json();

        this.setState({ time: data.time });
      } catch (error) {
        //Do nothing
        console.error(error);
      }
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  render() {
    if (!this.state || !this.state.time) {
      return (
        <Loading />
      );
    }

    return (
      <div className="container-fluid">
        <br />
        Time from API: { this.state.time }
      </div>
    );
  }
}

export default TestApi;