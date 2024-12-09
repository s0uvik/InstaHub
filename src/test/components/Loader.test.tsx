import { render, screen } from '@testing-library/react';
import Loader from '../../components/shared/Loader';

describe('Loader Component', () => {
  it('renders without crashing', () => {
    render(<Loader />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('has the correct structure', () => {
    render(<Loader />);
    
    const loaderImage = screen.getByAltText('loader');
    expect(loaderImage).toBeInTheDocument();
    expect(loaderImage.tagName).toBe('IMG');
    expect(loaderImage).toHaveAttribute('src', '/assets/icons/loader.svg');


    const loadingText = screen.getByText('Loading...');
    expect(loadingText).toBeInTheDocument();
    expect(loadingText.tagName).toBe('P');
  });
});
