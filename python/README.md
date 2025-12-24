# Big Budget Bomb - Data Processing

This directory contains Python scripts and notebooks for data processing to support the Big Budget Bomb website.

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

1. **Data Download**: Download required datasets
2. **Data Preprocessing**: Clean and standardize the data formats
3. **Analysis**: Process and analyze data as needed
4. **Data Export**: Generate processed datasets for the web application

## Data Sources

Data sources will be added as needed for the Big Budget Bomb website functionality.

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