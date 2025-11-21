import React from 'react';
import { View, ViewStyle, TextStyle } from 'react-native';
import Svg, { Defs, LinearGradient as SvgLinearGradient, Stop, Text as SvgText } from 'react-native-svg';
import { gradientTextStyles } from '../styles/gradientTextStyles';

interface GradientTextProps {
  text: string;
  style?: ViewStyle & TextStyle;
}

export const GradientText: React.FC<GradientTextProps> = ({ text, style }) => {
  const fontSize = style?.fontSize ? Number(style.fontSize) : 32;
  const fontWeight = style?.fontWeight || 'bold';
  
  return (
    <View style={[gradientTextStyles.container, style]}>
      <Svg height={fontSize * 1.4} width="100%">
        <Defs>
          <SvgLinearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor="#4A90E2" stopOpacity="1" />
            <Stop offset="100%" stopColor="#50C9C3" stopOpacity="1" />
          </SvgLinearGradient>
        </Defs>
        <SvgText
          fill="url(#textGradient)"
          fontSize={fontSize}
          fontWeight={fontWeight}
          x="50%"
          y={fontSize * 0.9}
          textAnchor="middle"
          fontFamily="System"
        >
          {text}
        </SvgText>
      </Svg>
    </View>
  );
};

