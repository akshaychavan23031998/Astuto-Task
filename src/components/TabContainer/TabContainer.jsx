import React, { useState, useRef, useEffect, useCallback } from 'react';
import Tab from '../Tab/Tab';
import OverflowMenu from '../OverflowMenu/OverflowMenu';
import useDragAndDrop from '../../hooks/useDragAndDrop';
import './TabContainer.css';

const generateId = () => `tab-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const TabContainer = () => {
  const [tabs, setTabs] = useState([
    { id: generateId(), label: 'Tab 1', content: 'Content of Tab 1' },
    { id: generateId(), label: 'Tab 2', content: 'Content of Tab 2' },
    { id: generateId(), label: 'Tab 3', content: 'Content of Tab 3' },
  ]);
  const [activeTabId, setActiveTabId] = useState(tabs[0]?.id);
  const [visibleTabs, setVisibleTabs] = useState(tabs);
  const [overflowTabs, setOverflowTabs] = useState([]);
  const [newTabCounter, setNewTabCounter] = useState(1);

  const tabsContainerRef = useRef(null);
  const tabsRef = useRef(null);

  const handleReorder = useCallback((newTabs) => {
    setTabs(newTabs);
  }, []);

  const {
    draggedIndex,
    dragOverIndex,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDragLeave,
    handleDrop,
  } = useDragAndDrop(tabs, handleReorder);

  const calculateOverflow = useCallback(() => {
    if (!tabsContainerRef.current || !tabsRef.current) return;

    const containerWidth = tabsContainerRef.current.offsetWidth;
    const addButtonWidth = 44;
    const overflowButtonWidth = 44;
    const gap = 4;
    const availableWidth = containerWidth - addButtonWidth - overflowButtonWidth - (gap * 2);

    const tabElements = tabsRef.current.children;
    let totalWidth = 0;
    let visibleCount = 0;

    for (let i = 0; i < tabElements.length; i++) {
      const tabWidth = tabElements[i].offsetWidth + gap;
      if (totalWidth + tabWidth <= availableWidth) {
        totalWidth += tabWidth;
        visibleCount++;
      } else {
        break;
      }
    }

    const visible = tabs.slice(0, visibleCount);
    const overflow = tabs.slice(visibleCount);

    setVisibleTabs(visible);
    setOverflowTabs(overflow);
  }, [tabs]);

  useEffect(() => {
    calculateOverflow();

    const resizeObserver = new ResizeObserver(() => {
      calculateOverflow();
    });

    if (tabsContainerRef.current) {
      resizeObserver.observe(tabsContainerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, [calculateOverflow]);

  useEffect(() => {
    calculateOverflow();
  }, [tabs, calculateOverflow]);

  const handleAddTab = () => {
    const newTab = {
      id: generateId(),
      label: 'New Tab',
      content: `Content of new Tab`,
    };
    setTabs([...tabs, newTab]);
    setActiveTabId(newTab.id);
    setNewTabCounter(newTabCounter + 1);
  };

  const handleCloseTab = (tabId) => {
    if (tabs.length === 1) return;

    const tabIndex = tabs.findIndex((tab) => tab.id === tabId);
    const newTabs = tabs.filter((tab) => tab.id !== tabId);
    setTabs(newTabs);

    if (activeTabId === tabId) {
      const newActiveIndex = Math.min(tabIndex, newTabs.length - 1);
      setActiveTabId(newTabs[newActiveIndex]?.id);
    }
  };

  const handleSelectTab = (tabId) => {
    setActiveTabId(tabId);
  };

  const handleScroll = (direction) => {
    if (tabsRef.current) {
      const scrollAmount = 150;
      tabsRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const activeTab = tabs.find((tab) => tab.id === activeTabId);

  return (
    <div className="tab-container" data-testid="tab-container">
      <div className="tab-container__header" ref={tabsContainerRef}>
        <div className="tab-container__tabs-wrapper">
          <div className="tab-container__tabs" ref={tabsRef} data-testid="tabs-list">
            {tabs.map((tab, index) => (
              <Tab
                key={tab.id}
                tab={tab}
                index={index}
                isActive={tab.id === activeTabId}
                onSelect={handleSelectTab}
                onClose={handleCloseTab}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                isDragging={draggedIndex === index}
                isDragOver={dragOverIndex === index}
              />
            ))}
          </div>
        </div>
        
        {overflowTabs.length > 0 && (
          <OverflowMenu
            tabs={overflowTabs}
            activeTabId={activeTabId}
            onSelectTab={handleSelectTab}
            onCloseTab={handleCloseTab}
          />
        )}

        <button
          className="tab-container__add-btn"
          onClick={handleAddTab}
          aria-label="Add new tab"
          data-testid="add-tab-btn"
        >
          +
        </button>
      </div>

      <div className="tab-container__content" data-testid="tab-content">
        {activeTab?.content}
      </div>
    </div>
  );
};

export default TabContainer;

