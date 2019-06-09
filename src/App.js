import React, { Component } from 'react';
import './App.css';

import IconexConnect from './IconexConnect';
import {
  IconConverter
} from 'icon-sdk-js'
import SDK from './SDK.js';

import { MemoryRouter as Router } from 'react-router';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/styles';
import Paper from '@material-ui/core/Paper';


const AdapterLink = React.forwardRef((props, ref) => <Link innerRef={ref} {...props} />);

const CollisionLink = React.forwardRef((props, ref) => (
  <Link innerRef={ref} to="/getting-started/installation/" {...props} />
));

const useStyles = makeStyles({
  root: {
    padding: 16,
    color: 'red',
    '& p': {
      color: 'green',
      '& span': {
        color: 'blue',
      },
    },
  },
});

export default class App extends Component {

  state = {
    login: false,
    txevent: false,
    myCnt: 0,
    myAddress: ''
  }

  funcLogin = async (e) => {
    const myAddress = await IconexConnect.getAddress()
    this.setState({
      login: true,
      myAddress: myAddress
    })
  }

  funcUpdate = async (e) => {
    const myCnt = await
      SDK.iconService.call(
        SDK.callBuild({
          from: this.state.myAddress,
          methodName: 'getyourcount',
          params: {
          },
          to: window.CONTRACT_ADDRESS,
        })
      ).execute()

    this.setState({
      myCnt: Number(myCnt),
      txevent: true
    })
  }

  funcTx = async () => {
    const { sendTxBuild2 } = SDK
    const txObj = sendTxBuild2({
      from: this.state.myAddress,
      to: window.CONTRACT_ADDRESS,
    })
    const tx = await IconexConnect.sendTransaction(txObj)
    setTimeout(this.funcUpdate, 2500);
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          {
            !this.state.login ? (
              <>
                <Button color="primary" to="/" onClick={this.funcLogin}>
                  Login
            </Button>
              </>
            ) : (
                <>{
                  !this.state.txevent ? (
                    <>
                      <Button color="primary" to="/" onClick={this.funcTx}>
                        send tx
                </Button>
                    </>
                  ) : (
                      <>
                        <Paper >
                          <p>
                            반가워요.
                  당신은 {this.state.myCnt}번째 방문객입니다.
                          </p>
                        </Paper>
                      </>
                    )
                }
                </>
              )
          }

        </header>
      </div>
    );
  }

}



