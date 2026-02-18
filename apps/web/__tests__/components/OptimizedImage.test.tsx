import { render, screen, fireEvent } from '@testing-library/react';
import { OptimizedImage, Avatar } from '../../components/OptimizedImage';

describe('OptimizedImage', () => {
  const defaultProps = {
    src: '/test-image.jpg',
    alt: 'Test image',
    width: 100,
    height: 100,
  };

  it('should render with required props', () => {
    render(<OptimizedImage {...defaultProps} />);
    
    const image = screen.getByAltText('Test image');
    expect(image).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    render(<OptimizedImage {...defaultProps} className="custom-class" />);
    
    const image = screen.getByAltText('Test image');
    expect(image).toHaveClass('custom-class');
  });

  it('should use priority loading when specified', () => {
    render(<OptimizedImage {...defaultProps} priority />);
    
    const image = screen.getByAltText('Test image');
    expect(image).toHaveAttribute('loading', 'eager');
  });

  it('should use lazy loading by default', () => {
    render(<OptimizedImage {...defaultProps} />);
    
    const image = screen.getByAltText('Test image');
    expect(image).toHaveAttribute('loading', 'lazy');
  });

  it('should show fallback on error', () => {
    render(<OptimizedImage {...defaultProps} />);
    
    const image = screen.getByAltText('Test image');
    fireEvent.error(image);
    
    expect(screen.getByText('Failed to load image')).toBeInTheDocument();
  });

  it('should handle fill prop', () => {
    render(<OptimizedImage {...defaultProps} fill />);
    
    const image = screen.getByAltText('Test image');
    expect(image).toBeInTheDocument();
  });

  it('should apply sizes attribute', () => {
    render(<OptimizedImage {...defaultProps} sizes="(max-width: 768px) 100vw, 50vw" />);
    
    const image = screen.getByAltText('Test image');
    expect(image).toHaveAttribute('sizes', '(max-width: 768px) 100vw, 50vw');
  });
});

describe('Avatar', () => {
  it('should render with image when src provided', () => {
    render(<Avatar src="/avatar.jpg" alt="John Doe" />);
    
    const image = screen.getByAltText('John Doe');
    expect(image).toBeInTheDocument();
  });

  it('should render initials when no src', () => {
    render(<Avatar alt="John Doe" />);
    
    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  it('should render single initial for single name', () => {
    render(<Avatar alt="John" />);
    
    expect(screen.getByText('J')).toBeInTheDocument();
  });

  it('should use custom fallback initials', () => {
    render(<Avatar alt="John Doe" fallback="AB" />);
    
    expect(screen.getByText('AB')).toBeInTheDocument();
  });

  it('should handle different sizes', () => {
    const { rerender } = render(<Avatar alt="John" size="xs" />);
    expect(screen.getByText('J').parentElement).toHaveClass('w-6', 'h-6');

    rerender(<Avatar alt="John" size="xl" />);
    expect(screen.getByText('J').parentElement).toHaveClass('w-24', 'h-24');
  });

  it('should apply custom className', () => {
    render(<Avatar alt="John" className="custom-avatar" />);
    
    expect(screen.getByText('J').parentElement).toHaveClass('custom-avatar');
  });

  it('should show initials when image fails to load', () => {
    render(<Avatar src="/broken.jpg" alt="John Doe" />);
    
    const image = screen.getByAltText('John Doe');
    fireEvent.error(image);
    
    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  it('should handle null src', () => {
    render(<Avatar src={null} alt="John Doe" />);
    
    expect(screen.getByText('JD')).toBeInTheDocument();
  });
});
