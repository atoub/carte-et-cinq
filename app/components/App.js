import React from 'react';
import CarteOL from './CarteOL';
import Options from './Options';

const App = () => {
    return (
        <div>
            <div id="carteComplete">
                <CarteOL />
                <div id="barInformation" className="row">
                    <div className="col-6">
                        <span className="donneeCamion" />
                        <span className="donneeCoordonees" />
                    </div>
                    <div className="col-6 donneeMessage" />
                </div>
            </div>
            <Options />
        </div>
    );
};

export default App;
