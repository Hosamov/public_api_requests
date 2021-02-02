## Public API Requests
A Mock-up Startup Employee Directory FSJS TD Project 5  

### BASIC FEATURES
1. Uses the Random User Generator API - https://randomuser.me, grabbing 12 random "employees" to build a prototype for a Mock Startup Employee Directory.  
2. Uses the Fetch API to send a single request, fetching the employee data from the Random User Generator API.
3. Utilizing the fetched data, the returned 12 random employees are dynamically/programmatically added to the page, displaying the employee's thumbnail, full name, email, and location on separate cards.
4. Users may click the employee's card to display a modal window with more employee information, including a large thumbnail, full name, email, location, cell phone number, full address, and birthday in EN-us (MM/DD/YYYY) format. This data is also dynamically added to the page.

### EXTRA FEATURES
1. A search bar is dynamically added to index.html to allow the user to quickly search for an employee within the original fetched list.
  - Search bar will update in real-time as the user types the search search value. A search button is also function for user convenience.
2. Modal toggling is available when a modal window is open, allowing the user to effectively cycle through all returned employees in the list.
  - This feature adjusts based on search criteria entered by the user (i.e. if only 3 employees are shown, the modal toggle buttons only allow cycling through the currently-shown list).
3. Styling Adjustments from original styles.css:
  - Colors:
    - Utilized the following color scheme: #2c061f #374045 #d89216 #e1d89f
  - Background Color:
    - Adjusted background color to #2c061f (base color in scheme)
  - Font:
    - Adjusted font to 'Roboto Slab': https://fonts.googleapis.com/css2?family=Noto+Sans&family=Roboto+Slab:wght@300&display=swap
  - Box & Text Shadows:
    - Added box-shadow to all cards: #e1d89f #d89216
    - Added box-shadow to modal window: #2c061f
