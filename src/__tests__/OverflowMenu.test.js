import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import OverflowMenu from '../components/OverflowMenu/OverflowMenu';

const mockTabs = [
  { id: 'tab-1', label: 'Tab 1', content: 'Content 1' },
  { id: 'tab-2', label: 'Tab 2', content: 'Content 2' },
  { id: 'tab-3', label: 'Tab 3', content: 'Content 3' },
];

const defaultProps = {
  tabs: mockTabs,
  activeTabId: 'tab-1',
  onSelectTab: jest.fn(),
  onCloseTab: jest.fn(),
};

describe('OverflowMenu Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders overflow menu trigger button', () => {
    render(<OverflowMenu {...defaultProps} />);
    expect(screen.getByTestId('overflow-trigger')).toBeInTheDocument();
  });

  it('does not render when tabs array is empty', () => {
    render(<OverflowMenu {...defaultProps} tabs={[]} />);
    expect(screen.queryByTestId('overflow-menu')).not.toBeInTheDocument();
  });

  it('shows dropdown on mouse enter', () => {
    render(<OverflowMenu {...defaultProps} />);
    const menu = screen.getByTestId('overflow-menu');
    fireEvent.mouseEnter(menu);
    expect(screen.getByTestId('overflow-dropdown')).toBeInTheDocument();
  });

  it('hides dropdown on mouse leave', () => {
    render(<OverflowMenu {...defaultProps} />);
    const menu = screen.getByTestId('overflow-menu');
    fireEvent.mouseEnter(menu);
    expect(screen.getByTestId('overflow-dropdown')).toBeInTheDocument();
    fireEvent.mouseLeave(menu);
    expect(screen.queryByTestId('overflow-dropdown')).not.toBeInTheDocument();
  });

  it('displays all tabs in dropdown', () => {
    render(<OverflowMenu {...defaultProps} />);
    const menu = screen.getByTestId('overflow-menu');
    fireEvent.mouseEnter(menu);
    
    expect(screen.getByText('Tab 1')).toBeInTheDocument();
    expect(screen.getByText('Tab 2')).toBeInTheDocument();
    expect(screen.getByText('Tab 3')).toBeInTheDocument();
  });

  it('calls onSelectTab when a tab item is clicked', () => {
    const onSelectTab = jest.fn();
    render(<OverflowMenu {...defaultProps} onSelectTab={onSelectTab} />);
    const menu = screen.getByTestId('overflow-menu');
    fireEvent.mouseEnter(menu);
    
    fireEvent.click(screen.getByTestId('overflow-item-tab-2'));
    expect(onSelectTab).toHaveBeenCalledWith('tab-2');
  });

  it('closes dropdown after selecting a tab', () => {
    render(<OverflowMenu {...defaultProps} />);
    const menu = screen.getByTestId('overflow-menu');
    fireEvent.mouseEnter(menu);
    
    fireEvent.click(screen.getByTestId('overflow-item-tab-2'));
    expect(screen.queryByTestId('overflow-dropdown')).not.toBeInTheDocument();
  });

  it('calls onCloseTab when close button is clicked in dropdown', () => {
    const onCloseTab = jest.fn();
    render(<OverflowMenu {...defaultProps} onCloseTab={onCloseTab} />);
    const menu = screen.getByTestId('overflow-menu');
    fireEvent.mouseEnter(menu);
    
    const closeButtons = screen.getAllByLabelText(/Close Tab/);
    fireEvent.click(closeButtons[1]);
    expect(onCloseTab).toHaveBeenCalledWith('tab-2');
  });

  it('applies active class to the active tab item', () => {
    render(<OverflowMenu {...defaultProps} activeTabId="tab-2" />);
    const menu = screen.getByTestId('overflow-menu');
    fireEvent.mouseEnter(menu);
    
    const activeItem = screen.getByTestId('overflow-item-tab-2');
    expect(activeItem).toHaveClass('overflow-menu__item--active');
  });

  it('has correct aria-expanded attribute', () => {
    render(<OverflowMenu {...defaultProps} />);
    const trigger = screen.getByTestId('overflow-trigger');
    
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    
    const menu = screen.getByTestId('overflow-menu');
    fireEvent.mouseEnter(menu);
    
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
  });

  it('has correct aria-label on trigger button', () => {
    render(<OverflowMenu {...defaultProps} />);
    const trigger = screen.getByTestId('overflow-trigger');
    expect(trigger).toHaveAttribute('aria-label', 'Show more tabs');
  });
});

