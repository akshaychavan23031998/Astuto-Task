import React, { useState, useRef, useEffect } from 'react';
import './OverflowMenu.css';

const OverflowMenu = ({ tabs, activeTabId, onSelectTab, onCloseTab }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMouseEnter = () => {
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    setIsOpen(false);
  };

  const handleSelectTab = (tabId) => {
    onSelectTab(tabId);
    setIsOpen(false);
  };

  const handleCloseTab = (e, tabId) => {
    e.stopPropagation();
    onCloseTab(tabId);
  };

  if (tabs.length === 0) {
    return null;
  }

  return (
    <div
      className="overflow-menu"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      data-testid="overflow-menu"
    >
      <button
        ref={buttonRef}
        className="overflow-menu__trigger"
        aria-label="Show more tabs"
        aria-expanded={isOpen}
        data-testid="overflow-trigger"
      >
        ···
      </button>
      {isOpen && (
        <div ref={menuRef} className="overflow-menu__dropdown" data-testid="overflow-dropdown">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className={`overflow-menu__item ${tab.id === activeTabId ? 'overflow-menu__item--active' : ''}`}
              onClick={() => handleSelectTab(tab.id)}
              data-testid={`overflow-item-${tab.id}`}
            >
              <span className="overflow-menu__item-label">{tab.label}</span>
              <button
                className="overflow-menu__item-close"
                onClick={(e) => handleCloseTab(e, tab.id)}
                aria-label={`Close ${tab.label}`}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OverflowMenu;

