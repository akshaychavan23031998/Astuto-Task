# Tab Component

A React-based Tab component built without any external UI libraries.

## Features

- **Add new tabs**: Click the "+" button to add new tabs
- **Delete existing tabs**: Click the "×" button on any tab to close it
- **Horizontal scrolling**: Tabs overflow horizontally with smooth scrolling
- **Overflow menu**: Hover over the ellipsis (···) to see tabs that don't fit in the visible area
- **Drag and drop**: Reorder tabs by dragging and dropping them

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

```bash
cd tab-component
npm install
```

### Running the Application

```bash
npm start
```

The application will open at [http://localhost:3000](http://localhost:3000).

### Running Tests

```bash
npm test
```

To run tests with coverage:

```bash
npm test -- --coverage --watchAll=false
```

## Project Structure

```
tab-component/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── TabContainer/     # Main container component
│   │   ├── Tab/              # Individual tab component
│   │   └── OverflowMenu/     # Dropdown for overflow tabs
│   ├── hooks/
│   │   └── useDragAndDrop.js # Custom hook for drag-and-drop
│   ├── __tests__/            # Unit tests
│   ├── App.jsx
│   ├── App.css
│   └── index.js
└── package.json
```

## Technical Details

### No External Libraries
This component is built using only React and native browser APIs:
- Native HTML5 Drag and Drop API
- ResizeObserver for overflow detection
- CSS for styling and animations

### Components

1. **TabContainer**: Main container that manages tab state, handles add/delete operations, and detects overflow
2. **Tab**: Individual tab with label, close button, and drag-and-drop handlers
3. **OverflowMenu**: Dropdown menu showing tabs that overflow the visible area

### Custom Hook

- **useDragAndDrop**: Encapsulates drag-and-drop logic for tab reordering

## Browser Support

Tested on modern browsers:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

