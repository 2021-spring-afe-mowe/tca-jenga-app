import { React, useState, useRef, useEffect } from "react";
import JengaModal from "./JengaModal";
import QuitModal from './QuitModal';
import GameClock from "./GameClock";
import MoveClock from "./MoveClock";
import TotalClock from "./TotalClock";
import { useHistory } from "react-router-dom";

const Game = ({ players, game, setGame, gamesPlayed, setGamesPlayed }) => {
  const history = useHistory();

  // modals
  const [jengaModalShow, setJengaModalShow] = useState(false);
  const [quitModalShow, setQuitModalShow] = useState(false);

  // inputs
  const [removedFromRow, setRemovedFromRow] = useState("");
  const [removedFromCol, setRemovedFromCol] = useState("");
  const [replacedOnRow, setReplacedOnRow] = useState("");
  const [replacedOnCol, setReplacedOnCol] = useState("");
  const [towerHeight, setTowerHeight] = useState(18);
  const [fullRow, setFullRow] = useState(1);
  const [blocksReplaced, setBlocksReplaced] = useState(0);

  // players
  const [player1, setPlayer1] = useState({});
  const [player2, setPlayer2] = useState({});
  const [currentPlayer, setCurrentPlayer] = useState({});

  // game timer
  const gameTime = useRef("");

  // move timer
  const moveTimeElapsed = useRef(0);
  const [moveTimerReset, setMoveTimerReset] = useState(null);

  // total timer
  const player1TotalTime = useRef(0);
  const player2TotalTime = useRef(0);
  const [currentPlayerTotalTimeSeconds, setCurrentPlayerTotalTimeSeconds] = useState(0);

  useEffect(() => {
    const checkedPlayers = players.filter(player => player.checked);
    setPlayer1(checkedPlayers[0]);
    setPlayer2(checkedPlayers[1]);
    setCurrentPlayer(checkedPlayers[0]);
  }, [players]);

  //Handles the move event on click of move button
  const moveHandler = () => {
    setGame({
      ...game,
      moves: [
        ...game.moves,
        {
          player: currentPlayer,
          removeFrom: [parseInt(removedFromRow), parseInt(removedFromCol)],
          replacedOn: [parseInt(replacedOnRow), parseInt(replacedOnCol)],
        },
      ],
    });

    // reset removeFrom fields
    setRemovedFromRow("");
    setRemovedFromCol("");

    // reset replacedOn fields
    setReplacedOnRow("");
    setReplacedOnCol("");

    // increment height of tower
    setFullRow(fullRow + 1);
    if (fullRow % 3 == 0) {
      setTowerHeight(towerHeight + 1);
    }

    // increment blocks replaced
    setBlocksReplaced(blocksReplaced + 1);
      
    // add move time to playerTotalTime for current player
    if (currentPlayer == player1){
      player1TotalTime.current += moveTimeElapsed.current;
    } else {
      player2TotalTime.current += moveTimeElapsed.current;
    }

    // switch player and update total time
    if (currentPlayer === player1) {
      setCurrentPlayer(player2);
      setCurrentPlayerTotalTimeSeconds(player2TotalTime.current);
    } else {
      setCurrentPlayer(player1);
      setCurrentPlayerTotalTimeSeconds(player1TotalTime.current);
    }

    // reset move time
    setMoveTimerReset(Date.now());

    
    if (currentPlayer === player1) {
      
    } else {
      setCurrentPlayer(player1);
    }
  };

  // Handles the Jenga event on click of the Jenga button
  const jengaHandler = () => {
    setJengaModalShow(true);
  };

  const quitHandler = () => {
    setQuitModalShow(true);
  };

  const onWinnerClick = (jengaStats) => {
    let finalGame = {
      ...game,
      gameTime: gameTime.current,
      player1time: player1TotalTime.current,
      player2time: player2TotalTime.current,
      towerHeight: towerHeight,
      winnerPlayer: jengaStats.winner,
      loserPlayer: jengaStats.loser,
      jenga: {
        removedFrom: [jengaStats.removedFromCol, jengaStats.removedFromRow],
        replacedOn: [jengaStats.removedFromCol, jengaStats.removedFromRow]
      }
    }
    setGame(finalGame);
    setGamesPlayed([...gamesPlayed, finalGame]);

    history.push("/postGame");
  };

  const setGameTime = (time) => {
    gameTime.current = time;
  };

  const setMoveTimeElapsed = (seconds) => {
    moveTimeElapsed.current = seconds;
  }

  //Handles the quit event on click of the Quit button
  const onQuit = () => {
    history.push('/');
  };

  return (
    <>
      <JengaModal
        show={jengaModalShow}
        onHide={() => setJengaModalShow(false)}
        player1={player1}
        player2={player2}
        onWinnerClick={onWinnerClick}
      />
      <QuitModal
        show={quitModalShow}
        onHide={() => setQuitModalShow(false)}
        onQuit={onQuit}
      />
      <div className={`row blue darken-1 header mbp valign-wrapper game-head`}>
        <h5 className={`col s3 m3 header-text game-pad htext-hide`}>
          Gameplay
        </h5>

        <button
          className={`waves-effect waves-light btn-large col s4 sm4 m3 valign-wrapper light-blue lighten-1 ml-0 blue-buttons`}
          onClick={moveHandler}
        >
          MOVE
          <i className="large material-icons"></i>
        </button>

        <button
          className={`waves-effect waves-light btn-large col s4 sm4 m3 valign-wrapper deep-orange buttons`}
          onClick={jengaHandler}
        >
          JENGA!
          <i className="large material-icons"></i>
        </button>

        <button
          className={`waves-effect waves-light btn-large col s4 sm4 m3 valign-wrapper purple lighten-1 buttons`}
          onClick={quitHandler}
        >
          QUIT
          <i className="large material-icons"></i>
        </button>
      </div>

      <div className="row marquis-mt">
        <div className="col s5 m5 names">
          <div className="card-panel light-blue lighten-1 blue-buttons center names2">
            <h4 className="white-text names3">{player1.name}</h4>
          </div>
        </div>

        <div className="col s2 m2 names">
          <div className="card-panel blue darken-1 center names2">
            <h4 className="white-text names3">VS</h4>
          </div>
        </div>

        <div className="col s5 m5 names">
          <div className="card-panel light-blue lighten-1 blue-buttons center names2">
            <h4 className="white-text names3">{player2.name}</h4>
          </div>
        </div>
      </div>

      <div>
        <form>
          <h3 className="center turn">{currentPlayer.name}'s Turn</h3>
          <div className="row center">
            <h5 className="col s4 offset-s1 from-on">Removed From:</h5>
            <h5 className="col s4 offset-s2 from-on">Replaced On:</h5>
          </div>

          <div className="row center">
            <div className="col s3 rc">
              <h6 className="row-label1">Row:</h6>
              <input
                placeholder="00"
                id="first_name"
                type="text"
                className="center validate in"
                value={removedFromRow}
                onChange={(e) => setRemovedFromRow(e.target.value)}
              />
            </div>

            <div className="col s3 rc">
              <h6 className="col-label1">Column:</h6>
              <input
                placeholder="00"
                id="first_name"
                type="text"
                className="center validate in"
                value={removedFromCol}
                onChange={(e) => setRemovedFromCol(e.target.value)}
              />
            </div>

            <div className="col s3 rc">
              <h6 className="row-label2">Row:</h6>
              <input
                placeholder="00"
                id="first_name"
                type="text"
                className="validate in center"
                value={replacedOnRow}
                onChange={(e) => setReplacedOnRow(e.target.value)}
              />
            </div>

            <div className="col s3 rc">
              <h6 className="col-label2">Column:</h6>
              <input
                placeholder="00"
                id="first_name"
                type="text"
                className="validate in center"
                value={replacedOnCol}
                onChange={(e) => setReplacedOnCol(e.target.value)}
              />
            </div>
          </div>

          <div className="row">
            <div className="col s6 center">
              <h5>Height of Tower:</h5>
              <h4 className="numbers">Row: {towerHeight}</h4>
            </div>
            <div className="col s6 center">
              <h5>Blocks Replaced:</h5>
              <h4 className="numbers">{blocksReplaced}</h4>
            </div>
          </div>
        </form>
      </div>

      <div className="row center mt-half">
        <div className="col s12 m4 p-0 center">
          <div className="clocks card-panel light-blue lighten-1 center">
            <h5 className="clock">Game Clock</h5>
            <h3 className="white-text center time">
              <GameClock setTime={setGameTime}/>
            </h3>
          </div>
        </div>

        <div className="col s12 m4 p-0 center">
          <div className="clocks card-panel blue darken-1 center">
            <h5 className="clock">Move Timer</h5>
            <h3 className="white-text time">
              <MoveClock setTimeElapsed={setMoveTimeElapsed} resetTimerTrigger={moveTimerReset}/>
            </h3>
          </div>
        </div>

        <div className="col s12 m4 p-0 center">
          <div className="clocks card-panel light-blue lighten-1 center">
            <h5 className="clock">Total Time</h5>
            <h3 className="white-text time">
              <TotalClock resetTimerTrigger={moveTimerReset} AddTimeSeconds={currentPlayerTotalTimeSeconds}/>
            </h3>
          </div>
        </div>
      </div>

      <div className={`row blue darken-1 footer mbp valign-wrapper game-head`}>
        <h5 className={`"col s3 m3 footer-text htext-hide game-pad`}>
          Gameplay
        </h5>
        <button
          className={`waves-effect waves-light btn-large col s4 sm4 m3 valign-wrapper light-blue lighten-1 ml-0 blue-buttons`}
          onClick={moveHandler}
        >
          MOVE
          <i className="large material-icons"></i>
        </button>
        <button
          className={`waves-effect waves-light btn-large col s4 sm4 m3 valign-wrapper deep-orange buttons`}
          onClick={jengaHandler}
        >
          JENGA!
          <i className="large material-icons"></i>
        </button>
        <button
          className={`waves-effect waves-light btn-large col s4 sm4 m3 valign-wrapper purple lighten-1 buttons`}
          onClick={quitHandler}
        >
          QUIT
          <i className="large material-icons"></i>
        </button>
      </div>
    </>
  );
};

export default Game;
