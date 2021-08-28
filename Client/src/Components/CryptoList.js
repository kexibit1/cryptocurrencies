import React from 'react';
import CryptoItem from './CryptoItem';


const CryptoList = ({listOfCrypto, prices, changeCurrentCrypto}) => {
    let cryptos = Object.keys(listOfCrypto);
    return (
        <div>
            {cryptos.map(item => (
                <CryptoItem changeCurrentCrypto={changeCurrentCrypto} price={prices[item]} key={item} name={item} amount={listOfCrypto[item]}/>
            ))}
        </div>
    )
}
 
export default CryptoList;