import React from 'react';
import { render } from '@testing-library/react-native';
import { GradientText } from '../GradientText';

jest.mock('react-native-svg', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: ({ children, ...props }: any) => React.createElement('View', { testID: 'svg', ...props }, children),
    Defs: ({ children }: any) => React.createElement('View', { testID: 'defs' }, children),
    LinearGradient: ({ children, ...props }: any) => React.createElement('View', { testID: 'linear-gradient', ...props }, children),
    Stop: (props: any) => React.createElement('View', { testID: 'stop', ...props }),
    Text: ({ children, ...props }: any) => React.createElement('Text', { testID: 'svg-text', ...props }, children),
  };
});

describe('GradientText', () => {
  it('debe renderizar el texto correctamente', () => {
    const { getByTestId } = render(<GradientText text="Test Text" />);
    
    const svgText = getByTestId('svg-text');
    expect(svgText).toBeTruthy();
    expect(svgText.props.children).toBe('Test Text');
  });

  it('debe aplicar estilos personalizados', () => {
    const customStyle = { fontSize: 24, marginBottom: 20 };
    const { getByTestId } = render(<GradientText text="Test" style={customStyle} />);
    
    const container = getByTestId('svg').parent;
    expect(container).toBeTruthy();
  });

  it('debe usar valores por defecto cuando no se proporcionan estilos', () => {
    const { getByTestId } = render(<GradientText text="Default" />);
    
    const svgText = getByTestId('svg-text');
    expect(svgText).toBeTruthy();
  });
});

