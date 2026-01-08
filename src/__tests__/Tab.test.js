import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Tab from '../components/Tab/Tab';

const mockTab = {
  id: 'test-tab-1',
  label: 'Test Tab',
  content: 'Test Content',
};

const defaultProps = {
  tab: mockTab,
  index: 0,
  isActive: false,
  onSelect: jest.fn(),
  onClose: jest.fn(),
  onDragStart: jest.fn(),
  onDragEnd: jest.fn(),
  onDragOver: jest.fn(),
  onDragLeave: jest.fn(),
  onDrop: jest.fn(),
  isDragging: false,
  isDragOver: false,
};

describe('Tab Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders tab with correct label', () => {
    render(<Tab {...defaultProps} />);
    expect(screen.getByText('Test Tab')).toBeInTheDocument();
  });

  it('applies active class when isActive is true', () => {
    render(<Tab {...defaultProps} isActive={true} />);
    const tab = screen.getByTestId('tab-test-tab-1');
    expect(tab).toHaveClass('tab--active');
  });

  it('does not apply active class when isActive is false', () => {
    render(<Tab {...defaultProps} isActive={false} />);
    const tab = screen.getByTestId('tab-test-tab-1');
    expect(tab).not.toHaveClass('tab--active');
  });

  it('calls onSelect when tab is clicked', () => {
    const onSelect = jest.fn();
    render(<Tab {...defaultProps} onSelect={onSelect} />);
    fireEvent.click(screen.getByTestId('tab-test-tab-1'));
    expect(onSelect).toHaveBeenCalledWith('test-tab-1');
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = jest.fn();
    render(<Tab {...defaultProps} onClose={onClose} />);
    fireEvent.click(screen.getByTestId('close-tab-test-tab-1'));
    expect(onClose).toHaveBeenCalledWith('test-tab-1');
  });

  it('does not call onSelect when close button is clicked', () => {
    const onSelect = jest.fn();
    const onClose = jest.fn();
    render(<Tab {...defaultProps} onSelect={onSelect} onClose={onClose} />);
    fireEvent.click(screen.getByTestId('close-tab-test-tab-1'));
    expect(onClose).toHaveBeenCalled();
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('applies dragging class when isDragging is true', () => {
    render(<Tab {...defaultProps} isDragging={true} />);
    const tab = screen.getByTestId('tab-test-tab-1');
    expect(tab).toHaveClass('tab--dragging');
  });

  it('applies drag-over class when isDragOver is true', () => {
    render(<Tab {...defaultProps} isDragOver={true} />);
    const tab = screen.getByTestId('tab-test-tab-1');
    expect(tab).toHaveClass('tab--drag-over');
  });

  it('is draggable', () => {
    render(<Tab {...defaultProps} />);
    const tab = screen.getByTestId('tab-test-tab-1');
    expect(tab).toHaveAttribute('draggable', 'true');
  });

  it('calls onDragStart when drag starts', () => {
    const onDragStart = jest.fn();
    render(<Tab {...defaultProps} onDragStart={onDragStart} />);
    const tab = screen.getByTestId('tab-test-tab-1');
    fireEvent.dragStart(tab, { dataTransfer: { setData: jest.fn(), effectAllowed: '' } });
    expect(onDragStart).toHaveBeenCalled();
  });

  it('calls onDragEnd when drag ends', () => {
    const onDragEnd = jest.fn();
    render(<Tab {...defaultProps} onDragEnd={onDragEnd} />);
    const tab = screen.getByTestId('tab-test-tab-1');
    fireEvent.dragEnd(tab);
    expect(onDragEnd).toHaveBeenCalled();
  });

  it('calls onDrop when drop occurs', () => {
    const onDrop = jest.fn();
    render(<Tab {...defaultProps} onDrop={onDrop} />);
    const tab = screen.getByTestId('tab-test-tab-1');
    fireEvent.drop(tab, { dataTransfer: { getData: jest.fn() }, preventDefault: jest.fn() });
    expect(onDrop).toHaveBeenCalled();
  });

  it('renders close button with correct aria-label', () => {
    render(<Tab {...defaultProps} />);
    const closeButton = screen.getByTestId('close-tab-test-tab-1');
    expect(closeButton).toHaveAttribute('aria-label', 'Close Test Tab');
  });
});

