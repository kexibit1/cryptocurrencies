import React, {useState} from 'react';
import './modal.css';
import styled from 'styled-components';

const Crypto = styled.span`
    font-size: 25px;
    text-align: center;
`


const Modal = ({currentModal, handleClose, price, balance, buyCrypto, sellCrypto, amountOfCrypto}) => {
    const [amountToBuy, setAmountToBuy] = useState(0);
    const [amountToSell, setAmounttoSell] = useState(0)
    const showHideClassName = currentModal ? 'modal display-block' : 'modal display-none';
    const maxAmount = Math.floor(balance / price);

    return (
        <div className={showHideClassName}>
            <section className='modal-main'>
                <Crypto>{currentModal}</Crypto>
                {maxAmount > 0 ?
                    <div>
                    <span style={{fontSize: '20px'}}>{amountToBuy}</span>
                    <input type='range' value={amountToBuy} min='0' max={String(maxAmount)} onChange={e => setAmountToBuy(e.target.value)}/>
                    <input onClick={() => {
                        buyCrypto(price * amountToBuy, currentModal, amountToBuy);
                        setAmountToBuy(0);
                    }} type='submit' value={`Buy ${currentModal}`}/>
                    <hr/>
                    </div>
                    : <div><span>Not enough money</span> <hr/></div>
                }

                {
                    amountOfCrypto > 0 ?
                    <div>
                        <span style={{fontSize: '20px'}}>{amountToSell}</span>
                        <input type='range' value={amountToSell} min='0' max={amountOfCrypto} onChange={e => setAmounttoSell(e.target.value)} />
                        <input onClick={() => {
                            sellCrypto(price, currentModal, amountToSell);
                            setAmounttoSell(0);
                        }} type='submit' value={`Sell ${currentModal}`}/>
                    </div> : 
                    <div><span>There is no ${currentModal} to sell</span></div>
                }

                    



                <button type='button' onClick={() => {
                    handleClose();
                    setAmountToBuy(0);
                    setAmounttoSell(0);
                }}>
                    Close
                </button>
            </section>
        </div>
    );
};

export default Modal;