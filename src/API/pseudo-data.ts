import { codeGenerator } from '../utils/code-generator';
import { HUDTypes } from '../types';
import { Types } from '../types/HUD';

export const PSEUDO_DATA: Array<HUDTypes.HUD> = [
    {
        id: 0,
        code: codeGenerator(),
        type: HUDTypes.Types.ADMIN_PANEL,
        hasShifting: false,
        startX: 0,
        startY: 0,
        endX: 0,
        endY: 0,
        zIndex: 0,
        specialData: {
            todo: 'todo',
        },
        size: { width: 100, height: 100 },
    },
    {
        id: 0,
        code: codeGenerator(),
        type: HUDTypes.Types.BAG,
        hasShifting: false,
        startX: 0,
        startY: 0,
        endX: 0,
        endY: 0,
        zIndex: 0,
        specialData: {
            id: 0,
            code: codeGenerator(),
            name: 'basic bag',
            x: 9,
            y: 9,
            mass: 5,
            maxLimit: 250,
            inner: [
                {
                    id: 0,
                    name: 'wood',
                    mass: 10,
                    width: 6,
                    height: 2,
                    x: 1,
                    y: 0,
                    z: 0,
                    code: codeGenerator(),
                },
                {
                    id: 1,
                    name: 'stick',
                    mass: 10,
                    width: 1,
                    height: 2,
                    x: 0,
                    y: 0,
                    z: 0,
                    code: codeGenerator(),
                },
            ],
        },
        size: { width: 100, height: 100 },
    },
    {
        id: 0,
        code: codeGenerator(),
        type: HUDTypes.Types.BAG,
        hasShifting: false,
        startX: 0,
        startY: 0,
        endX: 0,
        endY: 0,
        zIndex: 0,
        specialData: {
            id: 0,
            code: codeGenerator(),
            name: 'basic bag',
            x: 9,
            y: 9,
            mass: 5,
            maxLimit: 250,
            inner: [
                {
                    id: 0,
                    name: 'wood',
                    mass: 10,
                    width: 6,
                    height: 2,
                    x: 1,
                    y: 0,
                    z: 0,
                    code: codeGenerator(),
                },
                {
                    id: 1,
                    name: 'stick',
                    mass: 10,
                    width: 1,
                    height: 2,
                    x: 0,
                    y: 0,
                    z: 0,
                    code: codeGenerator(),
                },
            ],
        },
        size: { width: 100, height: 100 },
    },
    {
        id: 100,
        code: codeGenerator(),
        type: HUDTypes.Types.DEV_INFO,
        hasShifting: false,
        startX: 0,
        startY: 0,
        endX: 0,
        endY: 0,
        size: {
            width: 0,
            height: 0,
        },
        specialData: {
            type: HUDTypes.Types.DEV_INFO,
            todo: 'todo',
        },
    },
];
