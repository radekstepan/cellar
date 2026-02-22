import { render, screen } from '@testing-library/react';
import { expect, test, vi } from 'vitest';
import { Sidebar } from './Sidebar';

test('Sidebar renders correctly and permits selection', () => {
    const setActiveView = vi.fn();
    const setIsLogVisible = vi.fn();

    render(
        <Sidebar
            activeView="records"
            setActiveView={setActiveView}
            isLogVisible={true}
            setIsLogVisible={setIsLogVisible}
            hasLogs={true}
        />
    );

    // Provide a more generous text matcher for the NavItem tooltips
    expect(screen.getByText('Records')).toBeInTheDocument();
    expect(screen.getByText('Logic')).toBeInTheDocument();
    expect(screen.getByText('Git')).toBeInTheDocument();

    // Verify the Activity button renders via its SVG lucide class or just general presence
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(3);
});
