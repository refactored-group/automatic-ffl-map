import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock('./components/Dealer/Locator', () => (props: any) => (
  <div data-testid="locator">{`${props.storeHash}:${props.googleMapsApiKey}`}</div>
));

const originalGoogleMapsApiKey = process.env.REACT_APP_GOOGLE_MAPS_KEY;

beforeEach(() => {
  window.history.pushState({}, '', '/');
  process.env.REACT_APP_GOOGLE_MAPS_KEY = '';
});

afterEach(() => {
  process.env.REACT_APP_GOOGLE_MAPS_KEY = originalGoogleMapsApiKey;
});

test('renders a configuration error when required iframe params are missing', () => {
  render(<App />);

  expect(screen.getByText(/Unable to load the Automatic FFL Dealers/i)).toBeInTheDocument();
});

test('allows Shopify iframe loads with the hosted map Google Maps key', () => {
  process.env.REACT_APP_GOOGLE_MAPS_KEY = 'hosted-map-key';
  window.history.pushState({}, '', '/?store_hash=store-1&platform=Shopify');

  render(<App />);

  expect(screen.getByTestId('locator')).toHaveTextContent('store-1:hosted-map-key');
});

test('keeps the legacy maps_api_key query override', () => {
  process.env.REACT_APP_GOOGLE_MAPS_KEY = 'hosted-map-key';
  window.history.pushState({}, '', '/?store_hash=store-1&platform=WooCommerce&maps_api_key=query-key');

  render(<App />);

  expect(screen.getByTestId('locator')).toHaveTextContent('store-1:query-key');
});
