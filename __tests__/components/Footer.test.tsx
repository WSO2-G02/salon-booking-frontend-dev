/**
 * Footer Component Tests
 * Industry-standard tests using React Testing Library
 */
import React from 'react'
import { render, screen } from '@testing-library/react'
import Footer from '@/components/Footer'

describe('Footer Component', () => {
  beforeEach(() => {
    render(<Footer />)
  })

  describe('Branding', () => {
    it('renders the brand name', () => {
      expect(screen.getByText('AURORA')).toBeInTheDocument()
    })

    it('renders the tagline', () => {
      expect(screen.getByText(/elegance.*luxury.*beauty/i)).toBeInTheDocument()
    })
  })

  describe('Quick Links', () => {
    it('renders Quick Links section header', () => {
      expect(screen.getByText('Quick Links')).toBeInTheDocument()
    })

    it('renders Home link', () => {
      expect(screen.getByRole('link', { name: /^home$/i })).toHaveAttribute('href', '/')
    })

    it('renders About link', () => {
      expect(screen.getByRole('link', { name: /^about$/i })).toHaveAttribute('href', '/about')
    })

    it('renders Terms & Conditions link', () => {
      expect(screen.getByRole('link', { name: /terms/i })).toHaveAttribute('href', '/terms')
    })

    it('renders Contact link', () => {
      expect(screen.getByRole('link', { name: /^contact$/i })).toHaveAttribute('href', '/contact')
    })
  })

  describe('Contact Information', () => {
    it('renders Contact Us section header', () => {
      expect(screen.getByText('Contact Us')).toBeInTheDocument()
    })

    it('renders business hours', () => {
      expect(screen.getByText(/tuesday.*sunday.*9:00am.*7:00pm/i)).toBeInTheDocument()
    })

    it('renders phone number with tel: link', () => {
      const phoneLink = screen.getByRole('link', { name: /\+94 77 388 5122/i })
      expect(phoneLink).toHaveAttribute('href', 'tel:+94773885122')
    })

    it('renders address with Google Maps link', () => {
      const addressLink = screen.getByRole('link', { name: /nugegoda/i })
      expect(addressLink).toHaveAttribute('href', expect.stringContaining('maps.app.goo.gl'))
      expect(addressLink).toHaveAttribute('target', '_blank')
    })
  })

  describe('Social Media Links', () => {
    it('renders social media links', () => {
      const allLinks = screen.getAllByRole('link')
      const socialLinks = allLinks.filter(link =>
        link.getAttribute('href')?.includes('facebook') ||
        link.getAttribute('href')?.includes('instagram') ||
        link.getAttribute('href')?.includes('tiktok')
      )
      
      expect(socialLinks).toHaveLength(3)
    })

    it('has Facebook link', () => {
      const allLinks = screen.getAllByRole('link')
      const fbLink = allLinks.find(link => 
        link.getAttribute('href')?.includes('facebook')
      )
      expect(fbLink).toBeDefined()
    })

    it('social links open in new tab', () => {
      const allLinks = screen.getAllByRole('link')
      const socialLinks = allLinks.filter(link =>
        link.getAttribute('href')?.includes('facebook') ||
        link.getAttribute('href')?.includes('instagram') ||
        link.getAttribute('href')?.includes('tiktok')
      )
      
      socialLinks.forEach(link => {
        expect(link).toHaveAttribute('target', '_blank')
      })
    })
  })

  describe('Accessibility', () => {
    it('renders as a footer element', () => {
      expect(screen.getByRole('contentinfo')).toBeInTheDocument()
    })

    it('has proper heading hierarchy', () => {
      const headings = screen.getAllByRole('heading')
      expect(headings.length).toBeGreaterThan(0)
    })
  })
})
