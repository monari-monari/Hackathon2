# AfriMeal Planner  

A modern, responsive web application for tracking daily nutrition and meal planning with a focus on African cuisine.

## Features 

- ** Daily Progress Tracking**: Visual progress bars and calorie counting
- ** Macronutrient Breakdown**: Interactive pie chart showing protein, carbs, and fats
- ** Recipe Suggestions**: AI-powered recipe generation based on ingredients
- ** Meal Logging**: Easy meal entry with nutritional information
- ** Regional Focus**: African cuisine from different regions
- ** Responsive Design**: Works on desktop, tablet, and mobile devices

## Technology Stack 

- ** Frontend**: HTML5, CSS3, Vanilla JavaScript
- ** Styling**: Custom CSS with Flexbox and Grid
- ** Charts**: HTML5 Canvas for data visualization
- ** Responsive**: Mobile-first design approach
- ** Performance**: DOM caching and optimized rendering

## Project Structure 

```
Hackathon/
├── wendy.html          # Main HTML file
├── afri.css           # Stylesheet
├── afri.js            # JavaScript functionality
└── README.md          # Project documentation
```

## Key Features Explained 

### 1. Daily Progress Tracking
- Real-time calorie counting
- Visual progress bars with animations
- Remaining calories calculation
- Percentage completion display

### 2. Macronutrient Visualization
- Interactive pie chart using HTML5 Canvas
- Color-coded sections (Green: Protein, Yellow: Carbs, Red: Fats)
- Educational information about each macronutrient
- Daily recommendations display

### 3. Recipe Generation
- Input-based recipe suggestions
- Regional cuisine selection (East, West, North, South, Central Africa)
- Nutritional information for each recipe
- One-click meal logging from recipes

### 4. Meal Logging System
- Comprehensive meal entry form
- Nutritional data tracking
- Meal type categorization
- Form validation and error handling

## Security Features 

- ** Input Sanitization**: All user inputs are sanitized to prevent XSS attacks
- ** Data Validation**: Comprehensive validation for meal data
- ** Error Handling**: Graceful error handling with user-friendly messages
- ** Safe DOM Manipulation**: Cached DOM elements and safe content insertion

## Performance Optimizations

- ** DOM Caching**: Elements are cached on page load for faster access
- ** Efficient Rendering**: Canvas-based chart rendering
- ** Error Boundaries**: Try-catch blocks prevent application crashes
- ** Optimized Updates**: Minimal DOM manipulation

## Code Quality Standards 

- ** Clean Code**: Well-organized, readable functions
- ** Documentation**: JSDoc comments for key functions
- ** Consistent Naming**: Clear, descriptive variable and function names
- ** Modular Design**: Separated concerns and reusable functions

## Browser Compatibility 

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Getting Started 

1. ** Clone or download** the project files
2. ** Open** `index.html` in a modern web browser
3. ** Start tracking** your meals and nutrition!

## Usage Guide 

### Adding a Meal
1. Scroll to the "Today's Logged Meals" section
2. Fill in the meal details (name, calories, macros)
3. Select meal type (Breakfast, Lunch, Dinner, Snack)
4. Click "Log Meal"

### Generating Recipes
1. Go to the "Recipe Suggestions" section
2. Enter ingredients (e.g., "chicken, tomatoes, rice")
3. Select your preferred African region
4. Click "Generate Recipes"
5. Click "Log as Meal" on any recipe you like

### Viewing Progress
- Check the "Daily Progress" card for calorie tracking
- View the "Macronutrient Breakdown" chart for nutritional balance
- See educational tips and recommendations

## API Integration 

The application is designed to work with a backend API for:
- `/progress/daily` - Get daily progress data
- `/recipes/suggest` - Generate recipe suggestions
- `/meals/log` - Log new meals
- `/meals/today` - Get today's logged meals

## Error Handling 

- ** Network Errors**: Graceful fallback to demo data
- ** Validation Errors**: Clear error messages for users
- ** API Failures**: Application continues to function offline
- ** User Input Errors**: Helpful validation messages

## Future Enhancements 

- [ ] Offline functionality with Service Workers
- [ ] Local storage for data persistence
- [ ] Export functionality for meal data
- [ ] Social sharing features
- [ ] Advanced analytics and trends
- [ ] Integration with fitness trackers

## Contributing 

This is a hackathon project demonstrating modern web development practices. Feel free to:
- Report bugs or issues
- Suggest new features
- Improve documentation
- Optimize performance

---

** Built for African cuisine and healthy living!**
