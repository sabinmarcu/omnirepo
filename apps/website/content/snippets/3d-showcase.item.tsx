/* eslint-disable prefer-arrow-callback */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-redeclare */

// #region ignore

'use client';

import {
  forwardRef,
  useCallback,
  useState,
} from 'react';
import type {
  MouseEventHandler,
  HTMLAttributes,
  ImgHTMLAttributes,
} from 'react';
import { assignInlineVars } from '@vanilla-extract/dynamic';
import type { ShowcaseWrapperStylesProps } from './3d-showcase.css';
import {
  showcaseImageStyles,
  showcaseWrapperStyles,
  xPosition,
  yPosition,
} from './3d-showcase.css';
// #endregion

// #region Types
export interface SizeType {
  width: number
  height: number
}
export interface MousePosition {
  x: number;
  y: number;
}
// #endregion

// #region Wrappers
/**
  * Define a custom wrapper component for our styles
  */
namespace ShowcaseItemWrapper {
  export type Props = (
    & HTMLAttributes<HTMLDivElement>
    & ShowcaseWrapperStylesProps
  );
}

const ShowcaseItemWrapper = forwardRef<HTMLDivElement, ShowcaseItemWrapper.Props>(
  function ShowcaseItemWrapper({
    className,
    which,
    active,
    ...props
  }, reference) {
    return (<div
      {...props}
      ref={reference}
      className={
        [className, showcaseWrapperStyles({
          which,
          active,
        })]
          .filter(Boolean)
          .join(' ')
      }
    />);
  },
);
// #endregion

// #region Showcase Component
/**
 * This is where we will tap into our topmost wrapper to track
 * mouse movement and relay this information to our CSS
 * to achieve our tilt effect
 */
export namespace ShowcaseItem {
  export type Props = ImgHTMLAttributes<HTMLImageElement>;
}

export function ShowcaseItem({ className, ...props }: ShowcaseItem.Props) {
  // Define our position state
  const [position, setPosition] = useState<MousePosition>();

  // Handle mouse movements within our wrapper (both enter and move)
  // We'll be tracking the position of our cursor relative to our item
  // in the [0, 1] range with respects to the item's size
  // (eg. item is 300x200px, cursor is at 100x20,
  // our position will be 0.33x0.1)
  const onEnterMove = useCallback<MouseEventHandler<HTMLDivElement>>(
    ({
      clientX,
      clientY,
      currentTarget: element,
    }) => {
      const {
        top,
        left,
        width,
        height,
      } = element.getBoundingClientRect();

      const [x, y] = [clientX - left, clientY - top];

      setPosition({
        x: x / width,
        y: y / height,
      });
    },
    [setPosition],
  );

  // Handle the loss of interaction (mouse moves outside our component)
  const onLeave = useCallback(() => {
    setPosition(undefined);
  }, [setPosition]);

  const isActive = !!position;

  return (
    // Outer wrapper will handle scaling and interactions
    // It will also relay our position to our CSS
    <ShowcaseItemWrapper
      onMouseEnter={onEnterMove}
      onMouseMove ={onEnterMove}
      onMouseLeave={onLeave}
      which="outer"
      active={isActive}
      style={isActive
        ? assignInlineVars({
          [xPosition]: `${position.x}`,
          [yPosition]: `${position.y}`,
        })
        : {}
      }
    >{(

      // Inner wrapper will handle the tilting effect
      <ShowcaseItemWrapper
        which='inner'
        active={isActive}
      >{(

        // Finally, render the image itself
        <img {...props} className={
          [className, showcaseImageStyles]
            .filter(Boolean)
            .join(' ')
        } />

      )}</ShowcaseItemWrapper>

    )}
    </ShowcaseItemWrapper>
  );
}
// #endregion
