import {useCallback, useMemo, useRef, useState} from "react";
import {cloneDeep, isEqual} from "lodash";

import wood from './wood.png';
import cellBackground from './inventory-cell.png';

import s from './style.module.css';

const testDataInventory = {
    bags: [
        {
            id: 1,
            name: 'basic bag',
            x: 9,
            y: 9,
            mass: 5,
            maxLimit: 250,
            content: [
                {
                    id: 1,
                    name: 'wood',
                    src: wood,
                    mass: 10,
                    width: 6,
                    height: 2,
                    x: 1,
                    y: 0,
                    z: 0,
                    code: 124124124
                },
                {
                    id: 2,
                    name: 'stick',
                    mass: 10,
                    width: 1,
                    height: 2,
                    x: 0,
                    y: 0,
                    z: 0,
                    code: 4141241
                }
            ]
        }
    ],
}


function getCellPosition(cellWidth, cellHeight, x, y) {
    return {
        x: Math.floor(x / cellWidth),
        y: Math.floor(y / cellHeight)
    }

}

function checkItemOnPosition(content, x, y) {

    const item = content.find((item) => {
        const xCollision = item.x <= x && x <= item.x + item.width - 1;
        const yCollision = item.y <= y && y <= item.y + item.height - 1;

        return xCollision && yCollision;
    }) || null;

    const shiftingCoordinates = {
        x: x - item?.x || 0,
        y: y - item?.y || 0,
    }

    return {
        item,
        shiftingCoordinates,
    }
}

function collisionBetweenItems(content, item1) {
    return content.find(item2 => {
        if (item1.code === item2.code) {
            return
        }

        const xCollision =
            (item1.x >= item2.x && item1.x <= item2.x + item2.width - 1) ||
            (item1.x + item1.width - 1 >= item2.x && item1.x + item1.width - 1 <= item2.x + item2.width - 1) ||
            (item1.x <= item2.x + item2.width - 1 && item1.x + item1.width - 1 >= item2.x + item2.width - 1);
        const yCollision =
            (item1.y >= item2.y && item1.y <= item2.y + item2.height - 1) ||
            (item1.y + item1.height - 1 >= item2.y && item1.y + item1.height - 1 <= item2.y + item2.height - 1) ||
            (item1.y <= item2.y + item2.height - 1 && item1.y + item1.height - 1 >= item2.y + item2.height - 1);
        return xCollision && yCollision;
    })
}

function Bag({bag, width, height}) {
    const [content, setContent] = useState(cloneDeep(bag.content));
    const [currentBufferedItem, setCurrentBufferedItem] = useState(null);
    const [relativeShiftPoint, setRelativeShiftPoint] = useState(null);

    const cellWidth = useMemo(() => width / bag.x, [width, bag.x]);
    const cellHeight = useMemo(() => height / bag.y, [height, bag.y]);

    const container = useRef();

    const styles = useMemo(() => {

        return ({
            width: `${width}px`,
            height: `${height}px`,
            position: 'relative',
            backgroundImage: `url("${cellBackground}")`,
            backgroundSize: `${cellWidth}px`,
        })
    }, [cellHeight, cellWidth]);

    const items = useMemo(() => content.map((item) => {
        const cellStyles = {
            position: 'absolute',
            left: `${cellWidth * item.x}px`,
            top: `${cellHeight * item.y}px`,
            width: `${cellWidth * item.width}px`,
            height: `${cellHeight * item.height}px`,
            cursor: 'pointer',
            backgroundColor: `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`,
        }
        return (
            <div key={`item-${item.id}-${item.x}-${item.y}`} style={cellStyles}>
                {item.name}
            </div>
        )
    }), [content]);

    const handleMouseDown = useCallback((event) => {
        const x = event.pageX - container.current.offsetLeft;
        const y = event.pageY - container.current.offsetTop;
        const position = getCellPosition(cellWidth, cellHeight, x, y);
        const target = checkItemOnPosition(content, position.x, position.y);
        setRelativeShiftPoint({
            x: position.x - target?.item.x,
            y: position.y - target?.item.y,
        })

        setCurrentBufferedItem(target.item);
    }, [setCurrentBufferedItem, content, setRelativeShiftPoint]);

    const handleMouseUp = useCallback((event) => {
        const x = event.pageX - container.current.offsetLeft;
        const y = event.pageY - container.current.offsetTop;
        const position = getCellPosition(cellWidth, cellHeight, x, y);
        const xPosition = position.x - relativeShiftPoint.x;
        const yPosition = position.y - relativeShiftPoint.y;
        if (currentBufferedItem !== null && !collisionBetweenItems(content, {
            ...currentBufferedItem,
            x: xPosition,
            y: yPosition
        })) {
            const newContent = content.map(item => {
                if (isEqual(item, currentBufferedItem)) {
                    return ({
                        ...item,
                        x: xPosition,
                        y: yPosition
                    });
                }

                return item;
            })

            setContent(newContent);

            setCurrentBufferedItem(null);
        }
    }, [currentBufferedItem, setCurrentBufferedItem, content, bag, relativeShiftPoint]);

    return (
        <div style={styles} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} ref={container}>
            {items}
        </div>
    )
}


function Inventory(props) {
    return (
        <div
            className={s.container}
            style={{width: '100%', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center'}}
        >
            <Bag bag={testDataInventory.bags[0]} width={500} height={500}/>
        </div>
    )
}

export {Inventory}
