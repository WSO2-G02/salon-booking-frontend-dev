import { render, screen } from '@testing-library/react';
import Footer from '@/components/Footer';

describe('Footer Component', () => {
  it('renders the brand name', () => {
    render(<Footer />);
    expect(screen.getByText('AURORA')).toBeInTheDocument();
  });

  it('renders Quick Links section', () => {
    render(<Footer />);
    expect(screen.getByText('Quick Links')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Terms & Conditions')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
  });

  it('renders Contact Us section', () => {
    render(<Footer />);
    expect(screen.getByText('Contact Us')).toBeInTheDocument();
  });

  it('displays business hours', () => {
    render(<Footer />);
    expect(screen.getByText(/Tuesday–Sunday: 9:00am–7:00pm/)).toBeInTheDocument();
  });

  it('displays address', () => {
    render(<Footer />);
    expect(screen.getByText(/No.6, Pagoda Road, Nugegoda/)).toBeInTheDocument();
  });

  it('displays phone number', () => {
    render(<Footer />);
    expect(screen.getByText(/\+94 77 388 5122/)).toBeInTheDocument();
  });
});
