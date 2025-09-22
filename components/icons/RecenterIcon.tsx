// THIS FILE IS FOR A REACT NATIVE BUILD AND IS NOT USED IN THE CURRENT WEB APPLICATION.
// It is kept for reference or future native development.

import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface IconProps {
  color?: string;
  size?: number;
}

const RecenterIcon: React.FC<IconProps> = ({ color = '#FFFFFF', size = 24 }) => (
  <Svg
    width={size}
    height={size}
    fill="none"
    stroke={color}
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24"
  >
    <Path d="M9 4H4v5m11-5h5v5m-5 11h5v-5M9 20H4v-5" />
  </Svg>
);

export default RecenterIcon;