import React from 'react';
import { render } from 'react-dom';

export default async (): Promise<void> => {
  const { default: Root } = await import(`./components/Root.${process.env.NODE_ENV}`);
  const root = document.getElementById('root');
  render(<Root />, root);
};
