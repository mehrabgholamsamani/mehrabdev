import { useState, useEffect, useCallback } from 'react';
import { Gamepad2, RotateCcw, Trophy, ArrowLeft } from 'lucide-react';

type GameType = 'menu' | 'snake' | 'tictactoe' | 'memory' | 'game2048';

// Snake Game Component
const SnakeGame = ({ onBack }: { onBack: () => void }) => {
  const gridSize = 15;
  const [snake, setSnake] = useState([{ x: 7, y: 7 }]);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [direction, setDirection] = useState({ x: 1, y: 0 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => parseInt(localStorage.getItem('snake-high') || '0'));

  const generateFood = useCallback(() => {
    let newFood;
    do {
      newFood = { x: Math.floor(Math.random() * gridSize), y: Math.floor(Math.random() * gridSize) };
    } while (snake.some(s => s.x === newFood.x && s.y === newFood.y));
    return newFood;
  }, [snake]);

  const resetGame = () => {
    setSnake([{ x: 7, y: 7 }]);
    setDirection({ x: 1, y: 0 });
    setFood(generateFood());
    setGameOver(false);
    setScore(0);
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (gameOver) return;
      switch (e.key) {
        case 'ArrowUp': if (direction.y !== 1) setDirection({ x: 0, y: -1 }); break;
        case 'ArrowDown': if (direction.y !== -1) setDirection({ x: 0, y: 1 }); break;
        case 'ArrowLeft': if (direction.x !== 1) setDirection({ x: -1, y: 0 }); break;
        case 'ArrowRight': if (direction.x !== -1) setDirection({ x: 1, y: 0 }); break;
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [direction, gameOver]);

  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => {
      setSnake(prev => {
        const head = { x: (prev[0].x + direction.x + gridSize) % gridSize, y: (prev[0].y + direction.y + gridSize) % gridSize };
        if (prev.some(s => s.x === head.x && s.y === head.y)) {
          setGameOver(true);
          if (score > highScore) {
            setHighScore(score);
            localStorage.setItem('snake-high', score.toString());
          }
          return prev;
        }
        const newSnake = [head, ...prev];
        if (head.x === food.x && head.y === food.y) {
          setScore(s => s + 10);
          setFood(generateFood());
        } else {
          newSnake.pop();
        }
        return newSnake;
      });
    }, 120);
    return () => clearInterval(interval);
  }, [direction, food, gameOver, generateFood, score, highScore]);

  return (
    <div className="h-full flex flex-col items-center justify-center bg-gray-900 p-4">
      <div className="flex items-center justify-between w-full max-w-md mb-4">
        <button onClick={onBack} className="text-white/50 hover:text-white"><ArrowLeft className="w-5 h-5" /></button>
        <div className="text-white/60 text-sm">Score: <span className="text-green-400 font-bold">{score}</span></div>
        <div className="text-white/40 text-sm">Best: {highScore}</div>
      </div>
      <div className="grid gap-px bg-gray-800 p-1 rounded-lg" style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}>
        {Array.from({ length: gridSize * gridSize }).map((_, i) => {
          const x = i % gridSize, y = Math.floor(i / gridSize);
          const isSnake = snake.some(s => s.x === x && s.y === y);
          const isHead = snake[0].x === x && snake[0].y === y;
          const isFood = food.x === x && food.y === y;
          return (
            <div key={i} className={`w-4 h-4 rounded-sm ${isHead ? 'bg-green-400' : isSnake ? 'bg-green-500' : isFood ? 'bg-red-500' : 'bg-gray-700'}`} />
          );
        })}
      </div>
      {gameOver && (
        <div className="mt-4 text-center">
          <p className="text-red-400 font-bold mb-2">Game Over!</p>
          <button onClick={resetGame} className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center gap-2 mx-auto">
            <RotateCcw className="w-4 h-4" /> Play Again
          </button>
        </div>
      )}
      <p className="text-white/30 text-xs mt-4">Use arrow keys to move</p>
    </div>
  );
};

// Tic Tac Toe Component
const TicTacToe = ({ onBack }: { onBack: () => void }) => {
  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
  const [isX, setIsX] = useState(true);
  const [winner, setWinner] = useState<string | null>(null);
  const [scores, setScores] = useState({ x: 0, o: 0, draw: 0 });

  const checkWinner = (b: (string | null)[]) => {
    const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    for (const [a, bb, c] of lines) {
      if (b[a] && b[a] === b[bb] && b[a] === b[c]) return b[a];
    }
    return b.every(cell => cell) ? 'Draw' : null;
  };

  const handleClick = (i: number) => {
    if (board[i] || winner) return;
    const newBoard = [...board];
    newBoard[i] = isX ? 'X' : 'O';
    setBoard(newBoard);
    const result = checkWinner(newBoard);
    if (result) {
      setWinner(result);
      if (result === 'X') setScores(s => ({ ...s, x: s.x + 1 }));
      else if (result === 'O') setScores(s => ({ ...s, o: s.o + 1 }));
      else setScores(s => ({ ...s, draw: s.draw + 1 }));
    }
    setIsX(!isX);
  };

  const reset = () => { setBoard(Array(9).fill(null)); setWinner(null); setIsX(true); };

  return (
    <div className="h-full flex flex-col items-center justify-center bg-gray-900 p-4">
      <div className="flex items-center justify-between w-full max-w-xs mb-4">
        <button onClick={onBack} className="text-white/50 hover:text-white"><ArrowLeft className="w-5 h-5" /></button>
        <div className="flex gap-4 text-sm">
          <span className="text-blue-400">X: {scores.x}</span>
          <span className="text-white/30">Draw: {scores.draw}</span>
          <span className="text-red-400">O: {scores.o}</span>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 mb-4">
        {board.map((cell, i) => (
          <button key={i} onClick={() => handleClick(i)} className={`w-20 h-20 rounded-lg text-4xl font-bold transition-colors ${cell ? 'bg-gray-700' : 'bg-gray-800 hover:bg-gray-700'} ${cell === 'X' ? 'text-blue-400' : 'text-red-400'}`}>
            {cell}
          </button>
        ))}
      </div>
      {winner ? (
        <div className="text-center">
          <p className={`font-bold mb-2 ${winner === 'Draw' ? 'text-white/60' : winner === 'X' ? 'text-blue-400' : 'text-red-400'}`}>
            {winner === 'Draw' ? "It's a Draw!" : `${winner} Wins!`}
          </p>
          <button onClick={reset} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2 mx-auto">
            <RotateCcw className="w-4 h-4" /> New Game
          </button>
        </div>
      ) : (
        <p className={`text-sm ${isX ? 'text-blue-400' : 'text-red-400'}`}>{isX ? 'X' : 'O'}'s turn</p>
      )}
    </div>
  );
};

// Memory Game Component
const MemoryGame = ({ onBack }: { onBack: () => void }) => {
  const emojis = ['🎮', '🎲', '🎯', '🏆', '⭐', '🎪', '🎨', '🎭'];
  const [cards, setCards] = useState<{ id: number; emoji: string; flipped: boolean; matched: boolean }[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [won, setWon] = useState(false);

  const initGame = () => {
    const shuffled = [...emojis, ...emojis].sort(() => Math.random() - 0.5).map((emoji, i) => ({ id: i, emoji, flipped: false, matched: false }));
    setCards(shuffled);
    setSelected([]);
    setMoves(0);
    setWon(false);
  };

  useEffect(() => { initGame(); }, []);

  const handleClick = (id: number) => {
    if (selected.length === 2 || cards[id].flipped || cards[id].matched) return;
    const newCards = cards.map(c => c.id === id ? { ...c, flipped: true } : c);
    setCards(newCards);
    const newSelected = [...selected, id];
    setSelected(newSelected);

    if (newSelected.length === 2) {
      setMoves(m => m + 1);
      const [first, second] = newSelected;
      if (newCards[first].emoji === newCards[second].emoji) {
        setTimeout(() => {
          setCards(prev => prev.map(c => c.id === first || c.id === second ? { ...c, matched: true } : c));
          setSelected([]);
          if (newCards.filter(c => !c.matched).length === 2) setWon(true);
        }, 500);
      } else {
        setTimeout(() => {
          setCards(prev => prev.map(c => c.id === first || c.id === second ? { ...c, flipped: false } : c));
          setSelected([]);
        }, 1000);
      }
    }
  };

  return (
    <div className="h-full flex flex-col items-center justify-center bg-gray-900 p-4">
      <div className="flex items-center justify-between w-full max-w-xs mb-4">
        <button onClick={onBack} className="text-white/50 hover:text-white"><ArrowLeft className="w-5 h-5" /></button>
        <span className="text-white/60 text-sm">Moves: <span className="text-purple-400 font-bold">{moves}</span></span>
        <button onClick={initGame} className="text-white/50 hover:text-white"><RotateCcw className="w-4 h-4" /></button>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {cards.map(card => (
          <button key={card.id} onClick={() => handleClick(card.id)} className={`w-16 h-16 rounded-lg text-2xl transition-all duration-300 ${card.flipped || card.matched ? 'bg-purple-600' : 'bg-gray-700 hover:bg-gray-600'} ${card.matched ? 'opacity-50' : ''}`}>
            {(card.flipped || card.matched) ? card.emoji : '?'}
          </button>
        ))}
      </div>
      {won && (
        <div className="mt-4 text-center">
          <p className="text-green-400 font-bold flex items-center gap-2 justify-center"><Trophy className="w-5 h-5" /> You Won in {moves} moves!</p>
          <button onClick={initGame} className="mt-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600">Play Again</button>
        </div>
      )}
    </div>
  );
};

// 2048 Game Component
const Game2048 = ({ onBack }: { onBack: () => void }) => {
  const [board, setBoard] = useState<number[][]>([]);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(() => parseInt(localStorage.getItem('2048-best') || '0'));
  const [gameOver, setGameOver] = useState(false);

  const initBoard = () => {
    const newBoard = Array(4).fill(null).map(() => Array(4).fill(0));
    addRandomTile(newBoard);
    addRandomTile(newBoard);
    setBoard(newBoard);
    setScore(0);
    setGameOver(false);
  };

  const addRandomTile = (b: number[][]) => {
    const empty: [number, number][] = [];
    b.forEach((row, i) => row.forEach((cell, j) => { if (cell === 0) empty.push([i, j]); }));
    if (empty.length > 0) {
      const [i, j] = empty[Math.floor(Math.random() * empty.length)];
      b[i][j] = Math.random() < 0.9 ? 2 : 4;
    }
  };

  const slide = (row: number[]) => {
    let arr = row.filter(x => x !== 0);
    let points = 0;
    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i] === arr[i + 1]) {
        arr[i] *= 2;
        points += arr[i];
        arr.splice(i + 1, 1);
      }
    }
    while (arr.length < 4) arr.push(0);
    return { arr, points };
  };

  const move = (dir: 'up' | 'down' | 'left' | 'right') => {
    if (gameOver) return;
    let newBoard = board.map(row => [...row]);
    let moved = false;
    let totalPoints = 0;

    if (dir === 'left') {
      for (let i = 0; i < 4; i++) {
        const { arr, points } = slide(newBoard[i]);
        if (arr.join() !== newBoard[i].join()) moved = true;
        newBoard[i] = arr;
        totalPoints += points;
      }
    } else if (dir === 'right') {
      for (let i = 0; i < 4; i++) {
        const { arr, points } = slide(newBoard[i].reverse());
        if (arr.reverse().join() !== newBoard[i].join()) moved = true;
        newBoard[i] = arr;
        totalPoints += points;
      }
    } else if (dir === 'up') {
      for (let j = 0; j < 4; j++) {
        const col = [newBoard[0][j], newBoard[1][j], newBoard[2][j], newBoard[3][j]];
        const { arr, points } = slide(col);
        for (let i = 0; i < 4; i++) {
          if (newBoard[i][j] !== arr[i]) moved = true;
          newBoard[i][j] = arr[i];
        }
        totalPoints += points;
      }
    } else if (dir === 'down') {
      for (let j = 0; j < 4; j++) {
        const col = [newBoard[3][j], newBoard[2][j], newBoard[1][j], newBoard[0][j]];
        const { arr, points } = slide(col);
        for (let i = 0; i < 4; i++) {
          if (newBoard[3 - i][j] !== arr[i]) moved = true;
          newBoard[3 - i][j] = arr[i];
        }
        totalPoints += points;
      }
    }

    if (moved) {
      addRandomTile(newBoard);
      const newScore = score + totalPoints;
      setScore(newScore);
      if (newScore > bestScore) {
        setBestScore(newScore);
        localStorage.setItem('2048-best', newScore.toString());
      }
      setBoard(newBoard);
      checkGameOver(newBoard);
    }
  };

  const checkGameOver = (b: number[][]) => {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (b[i][j] === 0) return;
        if (j < 3 && b[i][j] === b[i][j + 1]) return;
        if (i < 3 && b[i][j] === b[i + 1][j]) return;
      }
    }
    setGameOver(true);
  };

  useEffect(() => { initBoard(); }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
        move(e.key.replace('Arrow', '').toLowerCase() as 'up' | 'down' | 'left' | 'right');
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [board, gameOver, score, bestScore]);

  const getTileColor = (val: number) => {
    const colors: Record<number, string> = {
      0: 'bg-gray-700', 2: 'bg-gray-200 text-gray-800', 4: 'bg-gray-300 text-gray-800',
      8: 'bg-orange-300 text-white', 16: 'bg-orange-400 text-white', 32: 'bg-orange-500 text-white',
      64: 'bg-orange-600 text-white', 128: 'bg-yellow-400 text-white', 256: 'bg-yellow-500 text-white',
      512: 'bg-yellow-600 text-white', 1024: 'bg-yellow-700 text-white', 2048: 'bg-yellow-800 text-white',
    };
    return colors[val] || 'bg-purple-600 text-white';
  };

  return (
    <div className="h-full flex flex-col items-center justify-center bg-gray-900 p-4">
      <div className="flex items-center justify-between w-full max-w-xs mb-4">
        <button onClick={onBack} className="text-white/50 hover:text-white"><ArrowLeft className="w-5 h-5" /></button>
        <div className="flex gap-4">
          <div className="bg-gray-700 px-3 py-1 rounded text-center">
            <div className="text-white/50 text-xs">Score</div>
            <div className="text-white font-bold">{score}</div>
          </div>
          <div className="bg-gray-700 px-3 py-1 rounded text-center">
            <div className="text-white/50 text-xs">Best</div>
            <div className="text-yellow-400 font-bold">{bestScore}</div>
          </div>
        </div>
      </div>
      <div className="bg-gray-800 p-2 rounded-lg">
        <div className="grid grid-cols-4 gap-2">
          {board.flat().map((val, i) => (
            <div key={i} className={`w-16 h-16 rounded flex items-center justify-center font-bold text-lg ${getTileColor(val)}`}>
              {val || ''}
            </div>
          ))}
        </div>
      </div>
      {gameOver && (
        <div className="mt-4 text-center">
          <p className="text-red-400 font-bold mb-2">Game Over!</p>
          <button onClick={initBoard} className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 flex items-center gap-2 mx-auto">
            <RotateCcw className="w-4 h-4" /> Try Again
          </button>
        </div>
      )}
      <p className="text-white/30 text-xs mt-4">Use arrow keys to move tiles</p>
    </div>
  );
};

// Main Games Hub
const Games = () => {
  const [currentGame, setCurrentGame] = useState<GameType>('menu');

  const games = [
    { id: 'snake', name: 'Snake', emoji: '🐍', color: 'from-green-500 to-emerald-600', desc: 'Classic snake game' },
    { id: 'tictactoe', name: 'Tic Tac Toe', emoji: '⭕', color: 'from-blue-500 to-indigo-600', desc: 'X vs O battle' },
    { id: 'memory', name: 'Memory Match', emoji: '🎴', color: 'from-purple-500 to-pink-600', desc: 'Find matching pairs' },
    { id: 'game2048', name: '2048', emoji: '🔢', color: 'from-yellow-500 to-orange-600', desc: 'Merge the tiles!' },
  ];

  if (currentGame === 'snake') return <SnakeGame onBack={() => setCurrentGame('menu')} />;
  if (currentGame === 'tictactoe') return <TicTacToe onBack={() => setCurrentGame('menu')} />;
  if (currentGame === 'memory') return <MemoryGame onBack={() => setCurrentGame('menu')} />;
  if (currentGame === 'game2048') return <Game2048 onBack={() => setCurrentGame('menu')} />;

  return (
    <div className="h-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6 overflow-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
          <Gamepad2 className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Games</h1>
          <p className="text-white/50 text-sm">Pick a game to play</p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {games.map(game => (
          <button
            key={game.id}
            onClick={() => setCurrentGame(game.id as GameType)}
            className={`bg-gradient-to-br ${game.color} p-6 rounded-2xl text-left hover:scale-105 transition-transform shadow-lg`}
          >
            <span className="text-4xl mb-3 block">{game.emoji}</span>
            <h3 className="text-lg font-bold text-white">{game.name}</h3>
            <p className="text-white/70 text-sm">{game.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Games;
