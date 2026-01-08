import React from 'react';
import './Tab.css';

const Tab = ({
  tab,
  index,
  isActive,
  onSelect,
  onClose,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDragLeave,
  onDrop,
  isDragging,
  isDragOver,
}) => {
  const handleClose = (e) => {
    e.stopPropagation();
    onClose(tab.id);
  };

  const handleDragStart = (e) => {
    onDragStart(e, index);
  };

  const handleDragOver = (e) => {
    onDragOver(e, index);
  };

  const handleDrop = (e) => {
    onDrop(e, index);
  };

  return (
    <div
      className={`tab ${isActive ? 'tab--active' : ''} ${isDragging ? 'tab--dragging' : ''} ${isDragOver ? 'tab--drag-over' : ''}`}
      onClick={() => onSelect(tab.id)}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={onDragEnd}
      onDragOver={handleDragOver}
      onDragLeave={onDragLeave}
      onDrop={handleDrop}
      data-testid={`tab-${tab.id}`}
    >
      <span className="tab__label">{tab.label}</span>
      <button
        className="tab__close"
        onClick={handleClose}
        aria-label={`Close ${tab.label}`}
        data-testid={`close-tab-${tab.id}`}
      >
        ×
      </button>
    </div>
  );
};

export default Tab;

