import { createContext, useContext } from 'react';
import { games } from './data.js';
import { createEngine } from './engine.js';

export const engines = Object.fromEntries(Object.entries(games).map(([game, data]) => [game, createEngine(data, game)]));
export const GameContext = createContext(engines.wr);
export const useEngine = () => useContext(GameContext);
