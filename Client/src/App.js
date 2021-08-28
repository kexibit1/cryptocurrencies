import React, {useEffect, useState} from 'react';
import CryptoList from './Components/CryptoList';
import Modal from './Components/Modal';
import axios from 'axios';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";




axios.defaults.withCredentials = true;


function App() {

const [bitcoin, setBitcoin] = useState(0);
const [ethereum, setEthereum] = useState(0);
const [data, setData] = useState({'BTC': 0, 'ETH': 0});
const [currentModal, setCurrentmodal] = useState('');
const [balance, setBalance] = useState(100000);
const [currentModalPrice, setCurrentModalPrice] = useState(0);
const [currentTotalBalance, setCurrentTotalBalance] = useState(balance);
const [login, setLogin] = useState('');
const [password, setPassword] = useState('');


let apiKey = "2f6d018e0d1bbf13e23261e3b5e945aaf9f47b0af0bb5837494bc15e4f549472";
const ccStreamer = new WebSocket('wss://streamer.cryptocompare.com/v2?api_key=' + apiKey);

ccStreamer.onopen =  function open() {
    var subRequest = {
        "action": "SubAdd",
        "subs": ["2~Coinbase~BTC~USD","2~Coinbase~ETH~USD"],
        

    };
    ccStreamer.send(JSON.stringify(subRequest));
};

ccStreamer.onmessage = function incoming(event) {
    let data = JSON.parse(event.data);
    if (data.PRICE) {
      if (data.FROMSYMBOL === 'ETH') {
        setEthereum(data.PRICE)
      }
      else {
        setBitcoin(data.PRICE);
      }
    }
};

useEffect(() => {
  totalBalance();
}, [balance, bitcoin, ethereum])


const totalBalance = () => {
  let currentBalance = balance + (data.BTC * +bitcoin) + (data.ETH * +ethereum);
  setCurrentTotalBalance(currentBalance);
}

const changeCurrentCrypto = (currency) => {
  setCurrentmodal(currency);
  switch (currency){
      case 'BTC':
          setCurrentModalPrice(bitcoin);
          break;
      case 'ETH':
          setCurrentModalPrice(ethereum);
          break;
      default:
        return;
  }
}

const handleClose = () => {
  setCurrentmodal('');
}


const buyCrypto = (price, cryptoData, amount) => {
  if (price > balance) {
      alert('You doesnt have enough money');
  } else {
      setBalance(balance - price);
      setData(prevData => {
          return {...prevData, [cryptoData]: prevData[cryptoData] + +amount}
      })
  }
}

const sellCrypto = (price, cryptoData, amount) => {
  setBalance(balance + price * amount);
  setData(prevData => {
    return {...prevData, [cryptoData]: prevData[cryptoData] - +amount}
  })
  
}

const sendRegisterData = async (e) => {
    e.preventDefault();
    try {
        const registerData = {
            username: login,
            password
        };
        await axios.post('http://localhost:5000/auth/register', registerData, {
            withCredentials: true
        });
    } catch (error) {
        console.error(error);
    }
    
}

const sendLoginData = async (e) => {
    e.preventDefault();
    try {
        const loginData = {
            username: login,
            password
        }
        await axios.post('http://localhost:5000/auth/login', loginData, {
            withCredentials: true
        });
    } catch (error) {
        console.error(error)
    }

}

const logoutFetch = (e) => {
    axios.get('http://localhost:5000/auth/logout');
}


  

  return (
    <Router>
    <div>
        <nav>
            <ul>
                <li>
                    <Link to="/">Main Page</Link>
                </li>
                <li>
                    <Link to="/register">Register Page</Link>
                </li>
                <li>
                    <Link to="/login">Login Page</Link>
                </li>
                <li>
                    <Link to="/logout">Logout Page</Link>
                </li>
            </ul>
        </nav>
    <Switch>
        <Route exact path='/'>
            <div>
                <h1>Баланс: {balance}</h1>
                <h1>Ваш Общий Баланс с учетом криптовалюты: ${currentTotalBalance.toFixed(2)}</h1>
                {bitcoin !== 0 && ethereum !== 0 ? <CryptoList changeCurrentCrypto={changeCurrentCrypto} prices={{'ETH': ethereum, 'BTC': bitcoin}} listOfCrypto={data}/> : null}
                {bitcoin !== 0 && ethereum !== 0 ? <Modal amountOfCrypto={data[currentModal]} sellCrypto={sellCrypto} buyCrypto={buyCrypto} price={currentModalPrice} balance={balance} currentModal={currentModal} handleClose={handleClose}/> : null}
            </div>
        </Route>
        <Route path='/register'>
            <form>
                <input type={"text"} onChange={e => setLogin(e.target.value)} required={true} placeholder={"Login"}/>
                <input type={"password"} onChange={e => setPassword(e.target.value)} required={true} placeholder={"Password"}/>
                <input type={"submit"} onClick={sendRegisterData} value={'Register'}/>
            </form>
        </Route>
        <Route path='/login'>
            <form>
                <input type={"text"} onChange={e => setLogin(e.target.value)} required={true} placeholder={"Login"}/>
                <input type={"password"} onChange={e => setPassword(e.target.value)} required={true} placeholder={"Password"}/>
                <input type={"submit"} onClick={sendLoginData} value={'Login'}/>
            </form>
        </Route>
        <Route path='/logout'>
            <button onClick={logoutFetch}>Logout</button>
        </Route>
    </Switch>

    </div>
    </Router>
  );
}

export default App;
