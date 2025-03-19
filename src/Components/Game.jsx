import React, { useState, useEffect } from "react";
import axios from "axios";

const Game = () => {
    const [players, setPlayers] = useState([]);
    const [playerName, setPlayerName] = useState("");
    const [quilles, setQuilles] = useState(0);

    useEffect(() => {
        fetchPlayers();
    }, []);

    const fetchPlayers = async () => {
        const response = await axios.get("http://localhost:8080/game/players");
        setPlayers(response.data);
    };

    const addPlayer = async () => {
        if (playerName) {
            await axios.post(`http://localhost:8080/game/addPlayer/${playerName}`);
            setPlayerName("");
            fetchPlayers();
        }
    };

    const effectuerLancer = async () => {
        if (quilles < 0 || quilles > 15) {
            alert("Le nombre de quilles doit être compris entre 0 et 15.");
            return;
        }

        try {
            await axios.post(`http://localhost:8080/game/lancer/${quilles}`);
            fetchPlayers();
        } catch (error) {
            if (error.response) {
                alert(error.response.data);
            } else {
                alert("Une erreur s'est produite. Veuillez réessayer.");
            }
        }
    };

    const renderLancers = (frame, isLastFrame) => {
        let result = [];
        let total = 0;

        for (let i = 0; i < frame.length; i++) {
            total += frame[i];

            if (frame[i] === 15) {
                result.push("X"); // Strike
            } else if (total === 15 && i > 0) {
                result[i] = "/"; // Spare
                break;
            } else {
                result.push(frame[i] === 0 ? "" : frame[i]);
            }
        }

        while (result.length < (isLastFrame ? 4 : 3)) {
            result.push("");
        }

        return result;
    };

    return (
        <div className="container">
            <h1 className="text-center my-4">Jeu de Bowling Africain</h1>
            <div className="mb-3">
                <input
                    className="form-control w-50 d-inline"
                    type="text"
                    placeholder="Nom du joueur"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                />
                <button className="btn btn-primary ml-2" onClick={addPlayer}>Ajouter</button>
            </div>

            {players.map((player) => (
                <div key={player.playerName} className="mb-5">
                    <h3>{player.playerName}</h3>
                    <table className="table table-bordered text-center">
                        <thead>
                            <tr>
                                <th>Joueur</th>
                                {[1, 2, 3, 4].map((frame) => (
                                    <th key={frame} colSpan={3}>Frame {frame}</th>
                                ))}
                                <th colSpan={4}>Frame 5</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{player.playerName}</td>
                                {player.frames.map((frame, idx) => (
                                    <React.Fragment key={idx}>
                                        {renderLancers(frame, idx === 4).map((val, idx2) => (
                                            <td key={idx2}>{val}</td>
                                        ))}
                                    </React.Fragment>
                                ))}
                            </tr>
                            <tr>
                                <td></td>
                                {player.totalScoreFrame.map((totalScoreFrame, idx) => (
                                    <td key={idx} colSpan={idx === 4 ? 4 : 3}>
                                        <strong>{totalScoreFrame}</strong>
                                    </td>
                                ))}
                            </tr>
                        </tbody>
                    </table>
                </div>
            ))}

            <div className="mb-3">
                <input
                    type="number"
                    className="form-control w-25 d-inline"
                    value={quilles}
                    min="0"
                    max="15"
                    onChange={(e) => setQuilles(Math.max(0, Math.min(15, parseInt(e.target.value))))}
                />
                <button className="btn btn-success ml-2" onClick={effectuerLancer}>Lancer</button>
            </div>
        </div>
    );
};

export default Game;
