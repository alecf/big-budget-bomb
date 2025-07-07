# Salt Cap Calculator - Data Processing

This directory contains Python scripts and notebooks for processing geospatial Tiger data and SNAP benefits data.

## Setup

### Requirements
- Python 3.11 or higher
- Virtual environment (venv)

### Installation

1. **Activate the virtual environment:**
   ```bash
   source venv/bin/activate  # On Linux/Mac
   # or
   venv\Scripts\activate     # On Windows
   ```

2. **Install dependencies:**
   ```bash
   pip install -e .
   ```

   Or for development with additional tools:
   ```bash
   pip install -e ".[dev]"
   ```

### Project Structure

```
python/
├── notebooks/          # Jupyter notebooks for data exploration and processing
├── src/               # Source code modules
├── data/              # Raw and processed data files
├── tests/             # Unit tests
├── venv/              # Virtual environment
├── pyproject.toml     # Project configuration and dependencies
└── README.md          # This file
```

## Usage

### Starting Jupyter Lab
```bash
source venv/bin/activate
jupyter lab
```

### Data Processing Workflow

1. **Data Download**: Use notebooks to download Tiger shapefiles and SNAP benefits data
2. **Data Preprocessing**: Clean and standardize the data formats
3. **Geospatial Analysis**: Process zip code boundaries and spatial relationships
4. **Data Export**: Generate processed datasets for the web application

## Data Sources

- **Tiger Data**: US Census Bureau TIGER/Line Shapefiles for ZIP Code Tabulation Areas
- **SNAP Benefits Data**: State and federal SNAP program data

## Dependencies

### Core Libraries
- **pandas**: Data manipulation and analysis
- **geopandas**: Geospatial data processing
- **shapely**: Geometric operations
- **numpy**: Numerical computing

### Geospatial Stack
- **fiona**: File I/O for geospatial data
- **pyproj**: Coordinate system transformations
- **rasterio**: Raster data processing
- **folium**: Interactive maps

### Visualization
- **matplotlib**: Static plotting
- **seaborn**: Statistical visualization
- **plotly**: Interactive charts

### Development Tools
- **black**: Code formatting
- **isort**: Import sorting
- **flake8**: Linting
- **mypy**: Type checking
- **pytest**: Testing framework