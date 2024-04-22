import React from 'react';

const PlayerControl = () => {
    return (
        <div className="player-control">
            <button className="control-button">Prev</button>
            <button className="control-button">Play</button>
            <button className="control-button">Next</button>
            
            <input type="range" className="progress-bar" />
            
            <button className="control-button">Vol-</button>
            <input type="range" className="volume-slider" />
            <button className="control-button">Vol+</button>
        </div>
    );
};

export default PlayerControl;
