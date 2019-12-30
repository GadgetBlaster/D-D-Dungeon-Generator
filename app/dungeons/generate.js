
import { generateMap } from './map';
import { generateRooms } from '../rooms/generate';
import { knobs } from '../knobs';
import { roll } from '../utility/roll';

const complexityRoomCountMultiplier = 6;
const complexityMultiplierMinXY     = 5;
const complexityMultiplierMaxXY     = 6;

const getMxRoomCount = (complexity) => {
    return complexity * complexityRoomCountMultiplier;
};

const getMapDimensions = (complexity) => {
    let dimensionMin = complexity * complexityMultiplierMinXY;
    let dimensionMax = complexity * complexityMultiplierMaxXY;

    let gridWidth  = roll(dimensionMin, dimensionMax);
    let gridHeight = roll(dimensionMin, dimensionMax);

    return {
        gridWidth,
        gridHeight,
    };
};

export const generateDungeon = (settings) => {
    let { [knobs.dungeonComplexity]: complexity } = settings;

    settings[knobs.roomCount] = getMxRoomCount(complexity);

    let rooms = generateRooms(settings);

    let mapSettings = {
        ...getMapDimensions(complexity),
        rooms: rooms,
    };

    return generateMap(mapSettings);
};
