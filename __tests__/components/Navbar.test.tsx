import { render, screen } from '@testing-library/react';
import Navbar from '@/components/Navbar';

describe('Navbar Component', () => {
  it('renders the brand name', () => {
    render(<Navbar />);
    expect(screen.getByText('AURORA')).toBeInTheDocument();
  });

  it('renders all navigation links', () => {
    render(<Navbar />);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Services')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
  });

  it('renders the book now button', () => {
    render(<Navbar />);
    expect(screen.getByText('BOOK NOW')).toBeInTheDocument();
  });

  it('has correct link destinations', () => {
    render(<Navbar />);
    const homeLink = screen.getByText('Home').closest('a');
    const aboutLink = screen.getByText('About').closest('a');
    const servicesLink = screen.getByText('Services').closest('a');
    const contactLink = screen.getByText('Contact').closest('a');

    expect(homeLink).toHaveAttribute('href', '/');
    expect(aboutLink).toHaveAttribute('href', '/about');
    expect(servicesLink).toHaveAttribute('href', '/services');
    expect(contactLink).toHaveAttribute('href', '/contact');
  });

  it('has book now link pointing to /booknow', () => {
    render(<Navbar />);
    const bookNowButton = screen.getByText('BOOK NOW');
    const bookNowLink = bookNowButton.closest('a');
    expect(bookNowLink).toHaveAttribute('href', '/booknow');
  });
});
