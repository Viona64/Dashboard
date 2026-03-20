# Dashboard Builder UI

A React-based dashboard builder with drag-and-drop functionality.

## Features

- Grid-based drag-and-drop layout using react-grid-layout
- Widget panel with available components
- Resizable and draggable widgets
- Layout persistence in localStorage
- Multiple widget types (KPI, Charts, Table)

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm start
```

3. Open http://localhost:3000

## Usage

1. Click on widgets in the left panel to add them to the canvas
2. Drag widgets to reposition them
3. Resize widgets using the bottom-right corner handle
4. Click the × button to remove widgets
5. Click "Save Layout" to persist the dashboard configuration

## Widget Types

- **KPI Card**: Displays key metrics with large values
- **Bar Chart**: Vertical bar chart visualization
- **Line Chart**: Trend line chart
- **Pie Chart**: Pie chart for proportional data
- **Table**: Data table display

## Layout Structure

The dashboard layout is stored as JSON with the following structure:

```json
{
  "widgets": [
    {
      "id": "widget-type-timestamp",
      "type": "kpi|bar|line|pie|table",
      "title": "Widget Title",
      "config": {}
    }
  ],
  "layout": [
    {
      "i": "widget-id",
      "x": 0,
      "y": 0,
      "w": 3,
      "h": 2
    }
  ],
  "timestamp": "ISO timestamp"
}
```

## Components

- `Dashboard`: Main container component
- `WidgetPanel`: Sidebar with available widgets
- `DashboardCanvas`: Grid layout container
- `WidgetFactory`: Renders widget components based on type
- Individual widget components in `components/widgets/`
