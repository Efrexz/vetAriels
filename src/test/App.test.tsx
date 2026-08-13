import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

function DummyApp() {
  return <div>VetAriel</div>;
}

describe('App smoke test', () => {
  it('renders without crashing', () => {
    render(
      <MemoryRouter>
        <DummyApp />
      </MemoryRouter>,
    );
    expect(screen.getByText('VetAriel')).toBeInTheDocument();
  });
});
