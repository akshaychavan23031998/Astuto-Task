import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TabContainer from '../components/TabContainer/TabContainer';

class MockResizeObserver {
  constructor(callback) {
    this.callback = callback;
  }
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.ResizeObserver = MockResizeObserver;

describe('TabContainer Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders tab container', () => {
    render(<TabContainer />);
    expect(screen.getByTestId('tab-container')).toBeInTheDocument();
  });

  it('renders initial tabs', () => {
    render(<TabContainer />);
    expect(screen.getByText('Tab 1')).toBeInTheDocument();
    expect(screen.getByText('Tab 2')).toBeInTheDocument();
    expect(screen.getByText('Tab 3')).toBeInTheDocument();
  });

  it('renders add tab button', () => {
    render(<TabContainer />);
    expect(screen.getByTestId('add-tab-btn')).toBeInTheDocument();
  });

  it('adds a new tab when add button is clicked', () => {
    render(<TabContainer />);
    const addButton = screen.getByTestId('add-tab-btn');
    
    fireEvent.click(addButton);
    
    expect(screen.getByText('New Tab')).toBeInTheDocument();
  });

  it('sets new tab as active when added', () => {
    render(<TabContainer />);
    const addButton = screen.getByTestId('add-tab-btn');
    
    fireEvent.click(addButton);
    
    expect(screen.getByText('Content of new Tab')).toBeInTheDocument();
  });

  it('displays content of active tab', () => {
    render(<TabContainer />);
    expect(screen.getByTestId('tab-content')).toHaveTextContent('Content of Tab 1');
  });

  it('changes content when different tab is selected', () => {
    render(<TabContainer />);
    const tab2 = screen.getByText('Tab 2');
    
    fireEvent.click(tab2);
    
    expect(screen.getByTestId('tab-content')).toHaveTextContent('Content of Tab 2');
  });

  it('closes a tab when close button is clicked', async () => {
    render(<TabContainer />);
    
    const tab2 = screen.getByText('Tab 2');
    fireEvent.click(tab2);
    
    const closeButtons = screen.getAllByLabelText(/Close Tab/);
    const tab2CloseIndex = closeButtons.findIndex((btn) => 
      btn.getAttribute('aria-label') === 'Close Tab 2'
    );
    
    fireEvent.click(closeButtons[tab2CloseIndex]);
    
    await waitFor(() => {
      expect(screen.queryByText('Tab 2')).not.toBeInTheDocument();
    });
  });

  it('selects next tab when active tab is closed', async () => {
    render(<TabContainer />);
    
    const closeButtons = screen.getAllByLabelText(/Close Tab/);
    const tab1CloseIndex = closeButtons.findIndex((btn) => 
      btn.getAttribute('aria-label') === 'Close Tab 1'
    );
    
    fireEvent.click(closeButtons[tab1CloseIndex]);
    
    await waitFor(() => {
      expect(screen.queryByText('Tab 1')).not.toBeInTheDocument();
      expect(screen.getByTestId('tab-content')).toHaveTextContent('Content of Tab 2');
    });
  });

  it('does not close the last remaining tab', () => {
    render(<TabContainer />);
    
    const getAllCloseButtons = () => screen.getAllByLabelText(/Close Tab/);
    
    fireEvent.click(getAllCloseButtons()[0]);
    fireEvent.click(getAllCloseButtons()[0]);
    
    const remainingCloseButtons = getAllCloseButtons();
    fireEvent.click(remainingCloseButtons[0]);
    
    expect(screen.getByTestId('tabs-list').children.length).toBeGreaterThanOrEqual(1);
  });

  it('renders tabs list', () => {
    render(<TabContainer />);
    expect(screen.getByTestId('tabs-list')).toBeInTheDocument();
  });

  it('add button has correct aria-label', () => {
    render(<TabContainer />);
    const addButton = screen.getByTestId('add-tab-btn');
    expect(addButton).toHaveAttribute('aria-label', 'Add new tab');
  });

  it('tabs are draggable', () => {
    render(<TabContainer />);
    const tabs = screen.getByTestId('tabs-list').children;
    
    Array.from(tabs).forEach((tab) => {
      expect(tab).toHaveAttribute('draggable', 'true');
    });
  });

  it('multiple tabs can be added', () => {
    render(<TabContainer />);
    const addButton = screen.getByTestId('add-tab-btn');
    
    fireEvent.click(addButton);
    fireEvent.click(addButton);
    fireEvent.click(addButton);
    
    const tabsList = screen.getByTestId('tabs-list');
    expect(tabsList.children.length).toBe(6);
  });

  it('reorders tabs on drag and drop', async () => {
    render(<TabContainer />);
    const tabsList = screen.getByTestId('tabs-list');
    const tabs = tabsList.children;
    
    const dataTransfer = {
      setData: jest.fn(),
      getData: jest.fn(() => '0'),
      effectAllowed: '',
    };
    
    fireEvent.dragStart(tabs[0], { dataTransfer });
    fireEvent.dragOver(tabs[2], { dataTransfer, preventDefault: jest.fn() });
    fireEvent.drop(tabs[2], { dataTransfer, preventDefault: jest.fn() });
    fireEvent.dragEnd(tabs[0]);
    
    await waitFor(() => {
      const updatedTabs = screen.getByTestId('tabs-list').children;
      expect(updatedTabs.length).toBe(3);
    });
  });
});

