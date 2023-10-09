import React, { CSSProperties, ReactNode } from 'react';
import { Alignment, Directions } from './types';

const getSliderListWidth = (
  count: number,
  slidesToShow?: number,
  wrapAround?: boolean
): string => {
  const visibleSlides = slidesToShow || 1;

  if (wrapAround) {
    const percentage = (count * 100) / visibleSlides;
    return `${3 * percentage}%`;
  }
  const percentage = (count * 100) / visibleSlides;
  return `${percentage}%`;
};

const getTransition = (
  count: number,
  direction: Directions | null,
  initialValue: number,
  currentSlide: number,
  wrapAround?: boolean
): number => {
  if (direction === Directions.Next || direction === Directions.Prev) {
    if (wrapAround) {
      const slideTransition = 100 / (3 * count);
      const currentTransition =
        initialValue - slideTransition * (currentSlide - 1);

      return currentTransition - slideTransition;
    }
    const slideTransition = (100 / count) * currentSlide;
    return -(slideTransition + initialValue);
  }

  return initialValue;
};

// eslint-disable-next-line complexity
const getPositioning = (
  cellAlign: 'left' | 'right' | 'center',
  slidesToShow: number,
  count: number,
  direction: Directions | null,
  currentSlide: number,
  wrapAround?: boolean,
  move?: number
): string => {
  if (!cellAlign || cellAlign === Alignment.Left) {
    const initialValue = wrapAround ? -(3 * (100 / count)) : 0;
    const horizontalMove = getTransition(
      count,
      direction,
      initialValue,
      currentSlide,
      wrapAround
    );
    const draggableMove = move
      ? `calc(${horizontalMove}% - ${move}px)`
      : `${horizontalMove}%`;
    return `translate3d(${draggableMove}, 0, 0)`;
  }
  if (cellAlign === Alignment.Right) {
    const right = slidesToShow > 1 ? (100 / count) * (slidesToShow - 1) : 0;

    // if wrapAround is enabled
    const startingPoint = 3 * (100 / count);
    const rightAlignedFirstSlide = (100 / (count * 3)) * (slidesToShow - 1);
    const initialValue = wrapAround
      ? -(startingPoint - rightAlignedFirstSlide)
      : right;

    const horizontalMove = getTransition(
      count,
      direction,
      initialValue,
      currentSlide,
      wrapAround
    );
    const draggableMove = move
      ? `calc(${horizontalMove}% - ${move}px)`
      : `${horizontalMove}%`;
    return `translate3d(${draggableMove}, 0, 0)`;
  }
  if (cellAlign === Alignment.Center) {
    const center =
      slidesToShow > 1 ? (100 / count) * Math.floor(slidesToShow / 2) : 0;

    // if wrapAround is enabled
    const startingPoint = 3 * (100 / count);
    const centerAlignedFirstSlide =
      (100 / (count * 3)) * Math.floor(slidesToShow / 2);
    const initialValue = wrapAround
      ? -(startingPoint - centerAlignedFirstSlide)
      : center;

    const horizontalMove = getTransition(
      count,
      direction,
      initialValue,
      currentSlide,
      wrapAround
    );
    const draggableMove = move
      ? `calc(${horizontalMove}% - ${move}px)`
      : `${horizontalMove}%`;
    return `translate3d(${draggableMove}, 0, 0)`;
  }

  return 'translate3d(0, 0, 0)';
};

export const getSliderListStyles = (
  children: ReactNode | ReactNode[],
  direction: Directions | null,
  currentSlide: number,
  animation: boolean,
  slidesToShow?: number,
  cellAlign?: 'left' | 'right' | 'center',
  wrapAround?: boolean,
  speed?: number,
  move?: number
): CSSProperties => {
  const count = React.Children.count(children);

  const width = getSliderListWidth(count, slidesToShow, wrapAround);
  const positioning = getPositioning(
    cellAlign || Alignment.Left,
    slidesToShow || 1,
    count,
    direction,
    currentSlide,
    wrapAround,
    move
  );

  return {
    width,
    textAlign: 'left',
    transition: animation ? `${speed || 500}ms ease 0s` : 'none',
    transform: positioning
  };
};
