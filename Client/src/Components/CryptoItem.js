import React from 'react';


const CryptoItem = ({name, amount, price, changeCurrentCrypto}) => {
    return ( 
        <div>
            <h1>{name}: {amount}. Стоимость - {price} <span><button onClick={() => changeCurrentCrypto(name)}>Buy/Sell</button></span></h1>
            
        </div>
     );
}
 
export default CryptoItem;