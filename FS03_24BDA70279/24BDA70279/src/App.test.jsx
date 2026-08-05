import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

describe('Post scheduler calendar', () => {
  it('renders the calendar with initial posts and allows scheduling a new post', async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(screen.getByText(/Interactive Post Calendar/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Product launch/i })).toBeInTheDocument();

    await user.type(screen.getByLabelText(/Post title/i), 'New campaign');
    await user.type(screen.getByLabelText(/Post date/i), '2026-07-25');
    await user.type(screen.getByLabelText(/Post time/i), '16:30');
    await user.selectOptions(screen.getByLabelText(/Post type/i), 'Community');
    await user.click(screen.getByRole('button', { name: /Schedule post/i }));

    expect(screen.getByText(/New campaign/i)).toBeInTheDocument();
    expect(screen.getByText(/Total posts: 4/i)).toBeInTheDocument();
  });

  it('shows the selected post summary when a post pill is clicked', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: /Product launch/i }));

    expect(screen.getByText(/Selected: Product launch/i)).toBeInTheDocument();
  });
});
