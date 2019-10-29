import React from 'react';
import { render as reactRender } from 'react-dom';
import Root from '../components/Root.development';

jest.mock('react-dom', () => ({ render: jest.fn() }));
jest.mock('../components/Root.development', () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe('render', () => {
  let render: () => Promise<void>;

  beforeAll(() => {
    Object.defineProperty(document, 'getElementById', { value: jest.fn(() => 'root') });
  });

  beforeEach(async () => {
    process.env.NODE_ENV = 'development';
    jest.clearAllMocks();
    ({ default: render } = await import('../render'));
  });

  it('calls document.getElementById', async () => {
    await render();
    expect(document.getElementById).toHaveBeenCalledWith('root');
  });

  it('calls the render method from React', async () => {
    await render();
    expect(reactRender).toHaveBeenCalledWith(<Root />, 'root');
  });
});
