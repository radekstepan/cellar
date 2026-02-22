import { render, screen, waitFor } from '@testing-library/react';
import { expect, test } from 'vitest';
import App from './App';

test('renders app component gracefully and loads table', async () => {
    render(<App />);

    // initially we are loading
    expect(screen.getByText('Loading...')).toBeInTheDocument();

    // after API calls resolve, the mock record should appear in the documents or the headers.
    await waitFor(() => {
        expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    // The header/sidebar should be rendered once loading is complete and API fetches resolve
    await waitFor(() => {
        expect(screen.getByPlaceholderText('Search records…')).toBeInTheDocument();
    }, { timeout: 2000 });
});
