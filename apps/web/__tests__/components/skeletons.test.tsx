import { render, screen } from '@testing-library/react';
import {
  ToolSkeleton,
  CardSkeleton,
  CardGridSkeleton,
  TableSkeleton,
  FormSkeleton,
  StatsCardSkeleton,
  StatsGridSkeleton,
  ChartSkeleton,
  ContentSkeleton,
  SearchResultsSkeleton,
  PageSkeleton,
} from '../../components/skeletons/ToolSkeleton';

describe('Skeleton Components', () => {
  describe('ToolSkeleton', () => {
    it('should render tool page skeleton', () => {
      render(<ToolSkeleton />);
      
      const skeleton = document.querySelector('.animate-pulse');
      expect(skeleton).toBeInTheDocument();
    });

    it('should have multiple placeholder elements', () => {
      render(<ToolSkeleton />);
      
      const placeholders = document.querySelectorAll('.bg-gray-200, .bg-gray-700');
      expect(placeholders.length).toBeGreaterThan(5);
    });
  });

  describe('CardSkeleton', () => {
    it('should render card skeleton', () => {
      render(<CardSkeleton />);
      
      expect(document.querySelector('.rounded-lg')).toBeInTheDocument();
    });

    it('should have icon placeholder', () => {
      render(<CardSkeleton />);
      
      const icon = document.querySelector('.h-12.w-12');
      expect(icon).toBeInTheDocument();
    });
  });

  describe('CardGridSkeleton', () => {
    it('should render grid with default count', () => {
      render(<CardGridSkeleton />);
      
      const cards = document.querySelectorAll('.animate-pulse');
      expect(cards.length).toBe(6);
    });

    it('should render grid with custom count', () => {
      render(<CardGridSkeleton count={3} />);
      
      const cards = document.querySelectorAll('.animate-pulse');
      expect(cards.length).toBe(3);
    });

    it('should have grid layout classes', () => {
      render(<CardGridSkeleton />);
      
      const grid = document.querySelector('.grid');
      expect(grid).toHaveClass('grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3');
    });
  });

  describe('TableSkeleton', () => {
    it('should render table with default rows', () => {
      render(<TableSkeleton />);
      
      const rows = document.querySelectorAll('.flex');
      expect(rows.length).toBeGreaterThan(5); // Header + 5 data rows
    });

    it('should render table with custom rows', () => {
      render(<TableSkeleton rows={3} />);
      
      const placeholders = document.querySelectorAll('.h-4');
      expect(placeholders.length).toBeGreaterThan(10);
    });

    it('should have header row', () => {
      render(<TableSkeleton />);
      
      const border = document.querySelector('.border-b');
      expect(border).toBeInTheDocument();
    });
  });

  describe('FormSkeleton', () => {
    it('should render form with default fields', () => {
      render(<FormSkeleton />);
      
      const inputs = document.querySelectorAll('.h-10');
      expect(inputs.length).toBe(4);
    });

    it('should render form with custom fields', () => {
      render(<FormSkeleton fields={2} />);
      
      const inputs = document.querySelectorAll('.h-10');
      expect(inputs.length).toBe(2);
    });

    it('should have submit button placeholder', () => {
      render(<FormSkeleton />);
      
      const button = document.querySelector('.h-10.w-32');
      expect(button).toBeInTheDocument();
    });
  });

  describe('StatsCardSkeleton', () => {
    it('should render stats card skeleton', () => {
      render(<StatsCardSkeleton />);
      
      expect(document.querySelector('.rounded-lg')).toBeInTheDocument();
    });

    it('should have value placeholder', () => {
      render(<StatsCardSkeleton />);
      
      const value = document.querySelector('.h-8');
      expect(value).toBeInTheDocument();
    });

    it('should have icon placeholder', () => {
      render(<StatsCardSkeleton />);
      
      const icon = document.querySelector('.h-12.w-12');
      expect(icon).toBeInTheDocument();
    });
  });

  describe('StatsGridSkeleton', () => {
    it('should render grid with default count', () => {
      render(<StatsGridSkeleton />);
      
      const cards = document.querySelectorAll('.rounded-lg');
      expect(cards.length).toBe(4);
    });

    it('should render grid with custom count', () => {
      render(<StatsGridSkeleton count={2} />);
      
      const cards = document.querySelectorAll('.rounded-lg');
      expect(cards.length).toBe(2);
    });

    it('should have responsive grid classes', () => {
      render(<StatsGridSkeleton />);
      
      const grid = document.querySelector('.grid');
      expect(grid).toHaveClass('sm:grid-cols-2', 'lg:grid-cols-4');
    });
  });

  describe('ChartSkeleton', () => {
    it('should render chart skeleton', () => {
      render(<ChartSkeleton />);
      
      expect(document.querySelector('.h-64')).toBeInTheDocument();
    });

    it('should have title placeholder', () => {
      render(<ChartSkeleton />);
      
      const title = document.querySelector('.h-6');
      expect(title).toBeInTheDocument();
    });
  });

  describe('ContentSkeleton', () => {
    it('should render content skeleton', () => {
      render(<ContentSkeleton />);
      
      expect(document.querySelector('.max-w-3xl')).toBeInTheDocument();
    });

    it('should have title placeholder', () => {
      render(<ContentSkeleton />);
      
      const title = document.querySelector('.h-8');
      expect(title).toBeInTheDocument();
    });

    it('should have image placeholder', () => {
      render(<ContentSkeleton />);
      
      const image = document.querySelector('.h-64');
      expect(image).toBeInTheDocument();
    });

    it('should have multiple paragraph placeholders', () => {
      render(<ContentSkeleton />);
      
      const paragraphs = document.querySelectorAll('.space-y-3 .h-4');
      expect(paragraphs.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('SearchResultsSkeleton', () => {
    it('should render search results skeleton', () => {
      render(<SearchResultsSkeleton />);
      
      expect(document.querySelector('.h-10')).toBeInTheDocument();
    });

    it('should render with default result count', () => {
      render(<SearchResultsSkeleton />);
      
      const results = document.querySelectorAll('.border-b');
      expect(results.length).toBe(5);
    });

    it('should render with custom result count', () => {
      render(<SearchResultsSkeleton count={3} />);
      
      const results = document.querySelectorAll('.border-b');
      expect(results.length).toBe(3);
    });
  });

  describe('PageSkeleton', () => {
    it('should render full page skeleton', () => {
      render(<PageSkeleton />);
      
      expect(document.querySelector('.min-h-screen')).toBeInTheDocument();
    });

    it('should have header', () => {
      render(<PageSkeleton />);
      
      const header = document.querySelector('.h-16');
      expect(header).toBeInTheDocument();
    });

    it('should have main content area', () => {
      render(<PageSkeleton />);
      
      const main = document.querySelector('main');
      expect(main).toBeInTheDocument();
    });

    it('should have animated content', () => {
      render(<PageSkeleton />);
      
      const animated = document.querySelector('.animate-pulse');
      expect(animated).toBeInTheDocument();
    });
  });
});
