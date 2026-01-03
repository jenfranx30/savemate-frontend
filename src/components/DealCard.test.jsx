import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../test-utils';
import DealCard from './DealCard';

const mockDeal = {
  id: '123',
  deal_id: '123',
  title: 'Special Pizza Offer',
  businessName: 'Pizza Paradise',
  location: 'Warsaw, Poland',
  discount_percentage: 50,
  originalPrice: 40.00,
  discountedPrice: 20.00,
  image_url: '/images/pizza.jpg',
  validUntil: '2026-12-31T23:59:59Z',
  source: 'business',
  deal_url: 'https://example.com/deal'
};

const expiredDeal = {
  ...mockDeal,
  validUntil: '2020-01-01T00:00:00Z'
};

describe('DealCard Component', () => {
  it('renders deal title', () => {
    renderWithProviders(<DealCard deal={mockDeal} />);
    // Use heading role for the title
    expect(screen.getByRole('heading', { name: /special pizza offer/i })).toBeInTheDocument();
  });

  it('renders business name', () => {
    renderWithProviders(<DealCard deal={mockDeal} />);
    expect(screen.getByText('Pizza Paradise')).toBeInTheDocument();
  });

  it('renders location', () => {
    renderWithProviders(<DealCard deal={mockDeal} />);
    expect(screen.getByText('Warsaw, Poland')).toBeInTheDocument();
  });

  it('shows discount badge', () => {
    renderWithProviders(<DealCard deal={mockDeal} />);
    expect(screen.getByText('50% OFF')).toBeInTheDocument();
  });

  it('shows source badge', () => {
    renderWithProviders(<DealCard deal={mockDeal} />);
    expect(screen.getByText('BUSINESS')).toBeInTheDocument();
  });

  it('displays prices with correct formatting', () => {
    renderWithProviders(<DealCard deal={mockDeal} />);
    
    // Check for price text (the formatter adds "zł")
    const priceText = screen.getByText(/20\.00/);
    expect(priceText).toBeInTheDocument();
    
    // Check for original price
    const originalPrice = screen.getByText(/40\.00/);
    expect(originalPrice).toBeInTheDocument();
  });

  it('shows valid until date', () => {
    renderWithProviders(<DealCard deal={mockDeal} />);
    expect(screen.getByText(/valid until/i)).toBeInTheDocument();
  });

  it('shows View Deals button for active deals', () => {
    renderWithProviders(<DealCard deal={mockDeal} />);
    const button = screen.getByRole('button', { name: /view deals/i });
    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();
  });

  it('shows favorite toggle button', () => {
    renderWithProviders(<DealCard deal={mockDeal} />);
    const favoriteButton = screen.getByRole('button', { name: /toggle favorite/i });
    expect(favoriteButton).toBeInTheDocument();
  });

  it('opens deal URL when View Deals clicked', async () => {
    const user = userEvent.setup();
    const mockOpen = vi.fn();
    global.window.open = mockOpen;

    renderWithProviders(<DealCard deal={mockDeal} />);
    
    const viewButton = screen.getByRole('button', { name: /view deals/i });
    await user.click(viewButton);

    expect(mockOpen).toHaveBeenCalledWith(mockDeal.deal_url, '_blank');
  });

  it('shows Deal Ended for expired deals', () => {
    const { container } = renderWithProviders(<DealCard deal={expiredDeal} />);
    
    // Check if "Deal Ended" text exists anywhere in the component
    const dealEndedText = container.textContent.includes('Deal Ended');
    expect(dealEndedText).toBe(true);
  });

  it('disables button for expired deals', () => {
    renderWithProviders(<DealCard deal={expiredDeal} />);
    
    // Find the button (there might be multiple "Deal Ended" texts, we want the button)
    const buttons = screen.getAllByRole('button');
    const dealButton = buttons.find(btn => btn.textContent.includes('Deal Ended'));
    
    expect(dealButton).toBeDisabled();
  });

  it('shows Expired status in date section', () => {
    const { container } = renderWithProviders(<DealCard deal={expiredDeal} />);
    
    // Check if "Expired" text exists in the component
    const expiredText = container.textContent.includes('Expired');
    expect(expiredText).toBe(true);
  });
});
