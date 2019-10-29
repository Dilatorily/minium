import React from 'react';
import { render } from '@testing-library/react';
import Root from '../Root';

describe('Root', () => {
  it('renders a greeting', () => {
    const { queryByText } = render(<Root />);
    expect(queryByText('Hello World!')).toBeInTheDocument();
  });
});
