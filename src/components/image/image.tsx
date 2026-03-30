import PropTypes from 'prop-types';
import { forwardRef } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
// @mui
import { alpha, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
//
import { getRatio } from './utils';

// ----------------------------------------------------------------------

interface Props {
  ratio?: string;
  overlay?: string | boolean;
  disabledEffect?: boolean;
  //
  alt: string;
  src: string | Record<string, any>;
  afterLoad?: VoidFunction;
  delayTime?: number;
  threshold?: number;
  beforeLoad?: VoidFunction;
  delayMethod?: 'debounce' | 'throttle';
  placeholder?: React.ReactNode;
  wrapperProps?: object;
  scrollPosition?: number;
  visibleByDefault?: boolean;
  effect?: 'blur' | 'black-and-white' | 'opacity';
  useIntersectionObserver?: boolean;
  wrapperClassName?: string;
  sx?: object;
}


const Image = forwardRef(
  (
    {
      ratio,
      overlay,
      disabledEffect = false,
      //
      alt,
      src,
      afterLoad,
      delayTime,
      threshold,
      beforeLoad,
      delayMethod,
      placeholder,
      wrapperProps,
      scrollPosition,
      effect = 'blur',
      visibleByDefault,
      wrapperClassName,
      useIntersectionObserver,
      sx,
      ...other
    }: Props,
    ref
  ) => {
    const theme = useTheme();

    const overlayStyles = !!overlay && {
      '&:before': {
        content: "''",
        top: 0,
        left: 0,
        width: 1,
        height: 1,
        zIndex: 1,
        position: 'absolute',
        background: overlay || alpha(theme.palette.grey[900], 0.48),
      },
    };

    const content = (
      <Box
        sx={{
          width: 1,
          height: 1,
          ...(!!ratio && {
            top: 0,
            left: 0,
            position: 'absolute',
          }),
        }}
      >
        <LazyLoadImage
          alt={alt}
          src={typeof src === 'string' ? src : ''}
          afterLoad={afterLoad}
          delayTime={delayTime}
          threshold={threshold}
          beforeLoad={beforeLoad}
          delayMethod={delayMethod}
          wrapperProps={wrapperProps}
          visibleByDefault={visibleByDefault}
          effect={disabledEffect ? undefined : effect}
          useIntersectionObserver={useIntersectionObserver}
          wrapperClassName={wrapperClassName || 'component-image-wrapper'}
          placeholderSrc={
            disabledEffect
              ? '/assets/transparent.png'
              : '/assets/placeholder.svg'
          }
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            verticalAlign: 'bottom',
          }}
        />
      </Box>
    );

    return (
      <Box
        ref={ref}
        component="span"
        className="component-image"
        sx={{
          overflow: 'hidden',
          position: 'relative',
          verticalAlign: 'bottom',
          display: 'inline-block',
          ...(!!ratio && {
            width: 1,
          }),
          '& span.component-image-wrapper': {
            width: 1,
            height: 1,
            verticalAlign: 'bottom',
            backgroundSize: 'cover !important',
            ...(!!ratio && {
              pt: getRatio(ratio),
            }),
          },
          ...overlayStyles,
          ...sx,
        }}
        {...other}
      >
        {content}
      </Box>
    );
  }
);

export default Image;
