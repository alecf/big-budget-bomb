# Session Storage Implementation for SALT Calculator

## Overview
The SALT Calculator now persists user input data using browser session storage. This means that when users reload the page or navigate away and come back, their form data will be restored automatically.

## What's Persisted
The following form fields are now persisted in session storage:
- **AGI (Adjusted Gross Income)**: The user's income input
- **Filing Status**: Single, Married Filing Jointly, etc.
- **State**: The selected state
- **Property Tax**: Annual property tax amount
- **Estimated Federal Tax**: Calculated or manually adjusted federal tax
- **Estimated State Tax**: Calculated or manually adjusted state tax

## Implementation Details

### Custom Hook
Instead of using an external library, I implemented a custom `useSessionStorage` hook that:
- Uses the browser's `sessionStorage` API directly
- Handles server-side rendering (SSR) safely by checking `typeof window`
- Provides type safety with TypeScript generics
- Automatically handles JSON serialization/deserialization

### Auto-restore Results
The component includes logic to automatically show calculation results when:
1. The page loads with persisted data
2. Required fields (AGI, State, Federal Tax, State Tax) are present

## Testing the Implementation

### Manual Testing Steps
1. **Enter form data**:
   - Input an AGI (e.g., 150000)
   - Select a filing status (e.g., Single)
   - Choose a state (e.g., California)
   - Enter property tax if applicable (e.g., 12000)
   - Click "Show Me the Impact"

2. **Verify persistence**:
   - Reload the page (F5 or Ctrl+R)
   - All form fields should be restored with the same values
   - If results were showing, they should automatically appear again

3. **Test session behavior**:
   - Open a new tab and navigate to the calculator
   - Form should be empty (session storage is tab-specific)
   - Close the tab and reopen - data should be gone
   - This is different from localStorage which persists across tabs

### Technical Details
- **Storage Type**: Session storage (clears when tab is closed)
- **Storage Keys**: Prefixed with "salt-calculator-" for organization
- **Error Handling**: Graceful fallback to initial values if storage fails
- **SSR Safety**: Checks for `window` object before accessing storage

## Browser Support
Session storage is supported in all modern browsers:
- Chrome, Firefox, Safari, Edge
- IE 8+ (though the app may have other modern JS requirements)

## Privacy Benefits
Using session storage instead of localStorage provides better privacy:
- Data is automatically cleared when the browser tab is closed
- No persistent storage of sensitive tax information
- Each tab maintains its own isolated session

## Future Enhancements
Possible improvements:
- Add a "Clear Data" button for manual reset
- Implement data encryption for sensitive information
- Add expiration timestamps for security
- Provide import/export functionality for data backup