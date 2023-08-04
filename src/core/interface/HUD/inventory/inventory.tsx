import {
    CSSProperties,
    MouseEvent,
    MutableRefObject,
    useCallback,
    useMemo,
    useRef,
    useState,
} from 'react'
import { cloneDeep, isEqual } from 'lodash'

import { utils } from './utils'

import { useAppDispatch, useAppSelector } from '../../../../redux/hooks'
import { coreStateSelector, setBufferItem } from '../../../../redux/HUDReducer'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import wood from './wood.png'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import stick from './stick.png'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import cellBackground from './inventory-cell.png'

import { HUDTypes } from 'src/types'

import s from './style.module.scss'
import { ItemExemplar } from '../../../../types/HUD'

type Props = {
    bag: HUDTypes.Bag
    width: number
    height: number
}

function BagUnit({ bag, width, height }: Props) {
    const selectedCoreStateSelector = useAppSelector(coreStateSelector)
    const dispatch = useAppDispatch()

    const [inner, setInner] = useState(cloneDeep(bag.inner))
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const [currentBufferedItem, setCurrentBufferedItem] =
        useState<ItemExemplar | null>(null)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const [relativeShiftPoint, setRelativeShiftPoint] = useState<{
        x: number
        y: number
    } | null>(null)
    // const [itemTargetCell, setItemTargetCell] = useState(null);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const [spectatorCloneItem, setSpectatorCloneItem] = useState(null)

    const cellWidth = useMemo(() => width / bag.x, [width, bag.x])
    const cellHeight = useMemo(() => height / bag.y, [height, bag.y])

    const container: MutableRefObject<HTMLDivElement> = useRef()
    const spectatorCloneItemElement: MutableRefObject<HTMLDivElement> = useRef()

    // useEffect(() => {
    //     dispatch(moveItem(inner));
    // }, [dispatch, inner])

    const styles: CSSProperties = useMemo(() => {
        return {
            width: `${width}px`,
            height: `${height}px`,
            position: 'relative',
            backgroundImage: `url("${cellBackground}")`,
            backgroundSize: `${cellWidth}px`,
        }
    }, [width, height, cellWidth])

    const items: Array<JSX.Element> = useMemo(
        () =>
            inner.map((item) => {
                const cellStyles: CSSProperties = {
                    position: 'absolute',
                    left: `${cellWidth * item.x}px`,
                    top: `${cellHeight * item.y}px`,
                    width: `${cellWidth * item.width}px`,
                    height: `${cellHeight * item.height}px`,
                    cursor: 'pointer',
                    // backgroundColor: `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`,
                }

                if (item?.id === 0) {
                    cellStyles.backgroundImage = `url("${wood}")`
                    cellStyles.backgroundSize = 'cover'
                    cellStyles.backgroundColor = 'none'
                } else if (item?.id === 1) {
                    cellStyles.backgroundImage = `url("${stick}")`
                    cellStyles.backgroundSize = 'cover'
                    cellStyles.backgroundColor = 'none'
                }

                return (
                    <div
                        key={`item-${item.id}-${item.x}-${item.y}`}
                        style={cellStyles}
                    ></div>
                )
            }),
        [inner, cellWidth, cellHeight]
    )

    const handleMouseDown = useCallback(
        (event: MouseEvent<HTMLDivElement>): void => {
            if (!container?.current) {
                return
            }
            const x =
                event['pageX'] - container.current.getBoundingClientRect().left
            const y =
                event['pageY'] - container.current.getBoundingClientRect().top
            const position = utils.getCellPosition(cellWidth, cellHeight, x, y)
            const target = utils.checkItemOnPosition(
                inner,
                position?.x,
                position?.y
            )
            setRelativeShiftPoint({
                x: position?.x - target?.item?.x,
                y: position?.y - target?.item?.y,
            })

            setCurrentBufferedItem(target.item)
        },
        [cellWidth, cellHeight, inner]
    )

    const handleMouseUp = useCallback(
        (event: MouseEvent<HTMLDivElement>): void => {
            if (!container?.current || !relativeShiftPoint) {
                return
            }
            console.log('mouseUp')
            const x =
                event['pageX'] - container.current.getBoundingClientRect().left
            const y =
                event['pageY'] - container.current.getBoundingClientRect().top
            const position = utils.getCellPosition(cellWidth, cellHeight, x, y)
            const xPosition = position.x - relativeShiftPoint.x
            const yPosition = position.y - relativeShiftPoint.y
            if (
                currentBufferedItem !== null &&
                !utils.collisionBetweenItems(inner, {
                    ...currentBufferedItem,
                    x: xPosition,
                    y: yPosition,
                }) &&
                !utils.collisionOutlineBag(bag.x, bag.y, {
                    ...currentBufferedItem,
                    x: xPosition,
                    y: yPosition,
                })
            ) {
                const newInner = inner.map((item) => {
                    if (isEqual(item, currentBufferedItem)) {
                        return {
                            ...item,
                            x: xPosition,
                            y: yPosition,
                        }
                    }

                    return item
                })

                if (
                    !newInner.find(
                        (item) => item.code === currentBufferedItem.code
                    )
                ) {
                    newInner.push(currentBufferedItem)
                }
                console.log(currentBufferedItem)
                console.log(newInner)
                setInner(newInner)

                setCurrentBufferedItem(null)
                setSpectatorCloneItem(null)
            }
        },
        [
            relativeShiftPoint,
            cellWidth,
            cellHeight,
            currentBufferedItem,
            inner,
            bag.x,
            bag.y,
            dispatch,
            selectedCoreStateSelector,
        ]
    )

    const handleMouseMove = useCallback(
        (event: MouseEvent<HTMLDivElement>): void => {
            if (
                !currentBufferedItem ||
                !currentBufferedItem ||
                !relativeShiftPoint
            ) {
                return
            }
            if (spectatorCloneItem) {
                if (!container?.current) {
                    return
                }
                const x =
                    event['pageX'] -
                    container.current.getBoundingClientRect().left
                const y =
                    event['pageY'] -
                    container.current.getBoundingClientRect().top
                if (!spectatorCloneItemElement) {
                    return
                }
                spectatorCloneItemElement.current.style.left = `${
                    x - relativeShiftPoint.x * cellWidth
                }px`
                spectatorCloneItemElement.current.style.top = `${
                    y - relativeShiftPoint.y * cellWidth
                }px`
            } else {
                const cellStyles: CSSProperties = {
                    position: 'absolute',
                    left: `${cellWidth * currentBufferedItem.x}px`,
                    top: `${cellHeight * currentBufferedItem.y}px`,
                    width: `${cellWidth * currentBufferedItem.width}px`,
                    height: `${cellHeight * currentBufferedItem.height}px`,
                    cursor: 'pointer',
                    // backgroundColor: `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`,
                    zIndex: 1,
                    opacity: 0.5,
                }
                console.log(currentBufferedItem)
                if (currentBufferedItem.id === 0) {
                    cellStyles.backgroundImage = `url("${wood}")`
                    cellStyles.backgroundSize = 'cover'
                    cellStyles.backgroundColor = 'none'
                } else if (currentBufferedItem.id === 1) {
                    cellStyles.backgroundImage = `url("${stick}")`
                    cellStyles.backgroundSize = 'cover'
                    cellStyles.backgroundColor = 'none'
                }
                setSpectatorCloneItem(
                    <div
                        ref={spectatorCloneItemElement}
                        key={`item-${currentBufferedItem.id}-${currentBufferedItem.x}-${currentBufferedItem.y}`}
                        style={cellStyles}
                    ></div>
                )
            }
        },
        [
            currentBufferedItem,
            relativeShiftPoint,
            spectatorCloneItem,
            cellWidth,
            cellHeight,
        ]
    )

    const handleMouseLeave = useCallback(() => {
        console.log('leave')
        console.log(currentBufferedItem)
        dispatch(setBufferItem(currentBufferedItem))
        setCurrentBufferedItem(null)
    }, [dispatch, currentBufferedItem, setCurrentBufferedItem])

    const handleMouseEnter = useCallback(() => {
        console.log(selectedCoreStateSelector.interface.HUD.bufferItem)
        console.log('enter')
        setCurrentBufferedItem(
            selectedCoreStateSelector.interface.HUD.bufferItem
        )
        dispatch(setBufferItem(null))
    }, [
        dispatch,
        currentBufferedItem,
        setCurrentBufferedItem,
        selectedCoreStateSelector,
    ])
    // console.log(currentBufferedItem)

    return (
        <div
            style={styles}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onMouseEnter={handleMouseEnter}
            ref={container}
        >
            {spectatorCloneItem}
            {items}
        </div>
    )
}

function Inventory({ bag, width, height }: Props): JSX.Element {
    return (
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
        <div className={s.container}>
            <BagUnit bag={bag} width={width} height={height} />
        </div>
    )
}

export { Inventory }
