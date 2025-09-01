// Global variables
let dailyProgress = {
    consumed: 1150,
    goal: 2000,
    macros: { protein: 45, carbs: 125, fats: 35 }
};

// Cache DOM elements for better performance
const elements = {
    progressText: null,
    progressFill: null,
    consumedCalories: null,
    remainingCalories: null,
    progressPercentage: null,
    macroChart: null,
    ingredientsInput: null,
    mealName: null,
    mealCalories: null,
    mealProtein: null,
    mealCarbs: null,
    mealFats: null,
    mealType: null
};

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    initializeElements();
    loadDailyProgress();
    loadTodaysMeals();
    initializeMacroChart();
    initializePremiumFeatures();
});

// Cache DOM elements on load
function initializeElements() {
    elements.progressText = document.getElementById('progress-text');
    elements.progressFill = document.getElementById('progress-fill');
    elements.consumedCalories = document.getElementById('consumed-calories');
    elements.remainingCalories = document.getElementById('remaining-calories');
    elements.progressPercentage = document.getElementById('progress-percentage');
    elements.macroChart = document.getElementById('macro-chart');
    elements.ingredientsInput = document.getElementById('ingredients-input');
    elements.mealName = document.getElementById('meal-name');
    elements.mealCalories = document.getElementById('meal-calories');
    elements.mealProtein = document.getElementById('meal-protein');
    elements.mealCarbs = document.getElementById('meal-carbs');
    elements.mealFats = document.getElementById('meal-fats');
    elements.mealType = document.getElementById('meal-type');
}

// Load demo data on page load for demonstration
setTimeout(() => {
    if (dailyProgress.consumed === 0) {
        loadDemoData();
    }
}, 1000);

/**
 * Sanitize user input to prevent XSS attacks
 * @param {string} input - User input to sanitize
 * @returns {string} Sanitized input
 */
function sanitizeInput(input) {
    if (typeof input !== 'string') return '';
    return input.replace(/[<>]/g, '').trim();
}

/**
 * Validate meal data before submission
 * @param {Object} mealData - Meal data to validate
 * @returns {boolean} True if valid, throws error if invalid
 */
function validateMealData(mealData) {
    if (!mealData.meal_name || mealData.meal_name.length < 2) {
        throw new Error('Meal name must be at least 2 characters long');
    }
    if (mealData.calories < 0 || mealData.calories > 5000) {
        throw new Error('Calories must be between 0 and 5000');
    }
    if (mealData.protein < 0 || mealData.carbs < 0 || mealData.fats < 0) {
        throw new Error('Macronutrients cannot be negative');
    }
    return true;
}

/**
 * Show error message to user
 * @param {string} message - Error message to display
 */
function showErrorMessage(message) {
    alert(`Error: ${message}`);
}

/**
 * Show success message to user
 * @param {string} message - Success message to display
 */
function showSuccessMessage(message) {
    alert(message);
}

// Load daily progress data
async function loadDailyProgress() {
    try {
        const response = await fetch('/progress/daily');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.error) {
            console.error('Error loading progress:', data.error);
            return;
        }

        dailyProgress = {
            consumed: data.consumed || 0,
            goal: data.daily_goal || 2000,
            macros: data.macros || { protein: 0, carbs: 0, fats: 0 }
        };

        updateProgressDisplay();
        updateMacroChart();
    } catch (error) {
        console.error('Error fetching daily progress:', error);
        // Continue with default data if API fails
    }
}

// Update progress display
function updateProgressDisplay() {
    try {
        const progressPercentage = Math.min((dailyProgress.consumed / dailyProgress.goal) * 100, 100);
        const remaining = Math.max(dailyProgress.goal - dailyProgress.consumed, 0);

        if (elements.progressText) {
            elements.progressText.textContent = `${dailyProgress.consumed} / ${dailyProgress.goal} kcal`;
        }
        if (elements.progressFill) {
            elements.progressFill.style.width = `${progressPercentage}%`;
        }
        if (elements.consumedCalories) {
            elements.consumedCalories.textContent = dailyProgress.consumed;
        }
        if (elements.remainingCalories) {
            elements.remainingCalories.textContent = remaining;
        }
        if (elements.progressPercentage) {
            elements.progressPercentage.textContent = `${Math.round(progressPercentage)}%`;
        }
    } catch (error) {
        console.error('Error updating progress display:', error);
    }
}

// Initialize macro chart
function initializeMacroChart() {
    try {
        if (!elements.macroChart) {
            console.error('Macro chart element not found');
            return;
        }
        
        const ctx = elements.macroChart.getContext('2d');
        
        // Set canvas size
        elements.macroChart.width = 200;
        elements.macroChart.height = 200;
        
        updateMacroChart();
    } catch (error) {
        console.error('Error initializing macro chart:', error);
    }
}

// Update macro chart
function updateMacroChart() {
    try {
        if (!elements.macroChart) return;
        
        const ctx = elements.macroChart.getContext('2d');
        
        // Clear canvas
        ctx.clearRect(0, 0, elements.macroChart.width, elements.macroChart.height);
        
        const centerX = elements.macroChart.width / 2;
        const centerY = elements.macroChart.height / 2;
        const radius = 80;
        
        const macros = dailyProgress.macros;
        const total = macros.protein + macros.carbs + macros.fats;
        
        if (total === 0) {
            // Draw empty circle
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
            ctx.strokeStyle = '#e9ecef';
            ctx.lineWidth = 20;
            ctx.stroke();
            
            // Add "No data" text
            ctx.fillStyle = '#666';
            ctx.font = '14px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('No meals logged', centerX, centerY);
            return;
        }

        // Calculate angles
        const proteinAngle = (macros.protein / total) * 2 * Math.PI;
        const carbsAngle = (macros.carbs / total) * 2 * Math.PI;
        const fatsAngle = (macros.fats / total) * 2 * Math.PI;

        let currentAngle = -Math.PI / 2; // Start at top

        // Draw protein slice
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + proteinAngle);
        ctx.strokeStyle = '#28a745';
        ctx.lineWidth = 20;
        ctx.stroke();
        currentAngle += proteinAngle;

        // Draw carbs slice
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + carbsAngle);
        ctx.strokeStyle = '#ffc107';
        ctx.lineWidth = 20;
        ctx.stroke();
        currentAngle += carbsAngle;

        // Draw fats slice
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + fatsAngle);
        ctx.strokeStyle = '#dc3545';
        ctx.lineWidth = 20;
        ctx.stroke();

        // Add legend
        const legendY = centerY + radius + 30;
        ctx.font = '12px Arial';
        ctx.textAlign = 'left';
        
        // Protein
        ctx.fillStyle = '#28a745';
        ctx.fillRect(centerX - 60, legendY, 12, 12);
        ctx.fillStyle = '#333';
        ctx.fillText(`Protein: ${Math.round(macros.protein)}g`, centerX - 45, legendY + 10);
        
        // Carbs
        ctx.fillStyle = '#ffc107';
        ctx.fillRect(centerX - 60, legendY + 20, 12, 12);
        ctx.fillStyle = '#333';
        ctx.fillText(`Carbs: ${Math.round(macros.carbs)}g`, centerX - 45, legendY + 30);
        
        // Fats
        ctx.fillStyle = '#dc3545';
        ctx.fillRect(centerX - 60, legendY + 40, 12, 12);
        ctx.fillStyle = '#333';
        ctx.fillText(`Fats: ${Math.round(macros.fats)}g`, centerX - 45, legendY + 50);
    } catch (error) {
        console.error('Error updating macro chart:', error);
    }
}

// Generate recipes using AI
async function generateRecipes() {
    try {
        const ingredients = sanitizeInput(elements.ingredientsInput?.value || '');
        const region = document.getElementById('region-select')?.value || 'East Africa';
        
        if (!ingredients) {
            showErrorMessage('Please enter some ingredients!');
            return;
        }

        const button = document.getElementById('generate-btn-text');
        if (button) {
            button.innerHTML = '<div class="spinner"></div>Generating...';
        }
        
        const response = await fetch('/recipes/suggest', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ingredients: ingredients.split(',').map(i => i.trim()),
                region: region
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.error) {
            showErrorMessage('Error generating recipes: ' + data.error);
            return;
        }

        displayRecipes(data.recipes);
    } catch (error) {
        console.error('Error generating recipes:', error);
        showErrorMessage('Failed to generate recipes. Please try again.');
    } finally {
        const button = document.getElementById('generate-btn-text');
        if (button) {
            button.textContent = 'Generate Recipes';
        }
    }
}

// Display recipe cards
function displayRecipes(recipes) {
    try {
        const container = document.getElementById('recipe-grid');
        if (!container) return;
        
        container.innerHTML = '';

        if (!Array.isArray(recipes)) {
            container.innerHTML = '<div style="text-align: center; color: #666; padding: 20px;">No recipes found</div>';
            return;
        }

        recipes.forEach(recipe => {
            const recipeCard = document.createElement('div');
            recipeCard.className = 'recipe-card';
            
            // Sanitize recipe data
            const safeName = sanitizeInput(recipe.name || 'Unknown Recipe');
            const safeIngredients = Array.isArray(recipe.ingredients) 
                ? recipe.ingredients.map(i => sanitizeInput(i)).join(', ')
                : 'No ingredients listed';
            
            recipeCard.innerHTML = `
                <div class="recipe-title">${safeName}</div>
                <div class="recipe-ingredients">
                    <strong>Ingredients:</strong> ${safeIngredients}
                </div>
                <div class="recipe-nutrition">
                    <div class="nutrition-item">
                        <div class="nutrition-value">${recipe.nutrition?.calories || 'N/A'}</div>
                        <div>Calories</div>
                    </div>
                    <div class="nutrition-item">
                        <div class="nutrition-value">${Math.round(recipe.nutrition?.protein || 0)}g</div>
                        <div>Protein</div>
                    </div>
                    <div class="nutrition-item">
                        <div class="nutrition-value">${Math.round(recipe.nutrition?.carbs || 0)}g</div>
                        <div>Carbs</div>
                    </div>
                    <div class="nutrition-item">
                        <div class="nutrition-value">${Math.round(recipe.nutrition?.fats || 0)}g</div>
                        <div>Fats</div>
                    </div>
                </div>
                <button class="btn btn-secondary" style="width: 100%;" 
                        onclick="logRecipeAsMeal(${recipe.id || 0}, '${safeName}', ${recipe.nutrition?.calories || 0}, ${recipe.nutrition?.protein || 0}, ${recipe.nutrition?.carbs || 0}, ${recipe.nutrition?.fats || 0})">
                    Log as Meal
                </button>
            `;
            container.appendChild(recipeCard);
        });
    } catch (error) {
        console.error('Error displaying recipes:', error);
        showErrorMessage('Error displaying recipes');
    }
}

// Log a recipe as a meal
function logRecipeAsMeal(recipeId, name, calories, protein, carbs, fats) {
    try {
        if (elements.mealName) elements.mealName.value = sanitizeInput(name);
        if (elements.mealCalories) elements.mealCalories.value = calories || 0;
        if (elements.mealProtein) elements.mealProtein.value = Math.round(protein || 0);
        if (elements.mealCarbs) elements.mealCarbs.value = Math.round(carbs || 0);
        if (elements.mealFats) elements.mealFats.value = Math.round(fats || 0);
        
        // Scroll to the meal logging form
        const mealForm = document.querySelector('.meal-form');
        if (mealForm) {
            mealForm.scrollIntoView({ behavior: 'smooth' });
        }
    } catch (error) {
        console.error('Error logging recipe as meal:', error);
    }
}

// Log a meal
async function logMeal() {
    try {
        const mealData = {
            meal_name: sanitizeInput(elements.mealName?.value || ''),
            calories: parseInt(elements.mealCalories?.value) || 0,
            protein: parseFloat(elements.mealProtein?.value) || 0,
            carbs: parseFloat(elements.mealCarbs?.value) || 0,
            fats: parseFloat(elements.mealFats?.value) || 0,
            meal_type: elements.mealType?.value || 'Snack'
        };

        // Validate meal data
        validateMealData(mealData);

        const button = document.getElementById('log-btn-text');
        if (button) {
            button.innerHTML = '<div class="spinner"></div>Logging...';
        }

        const response = await fetch('/meals/log', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(mealData)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.error) {
            showErrorMessage('Error logging meal: ' + data.error);
            return;
        }

        // Clear form
        clearMealForm();

        // Reload data
        loadDailyProgress();
        loadTodaysMeals();
        
        showSuccessMessage('Meal logged successfully!');
    } catch (error) {
        console.error('Error logging meal:', error);
        showErrorMessage(error.message || 'Failed to log meal. Please try again.');
    } finally {
        const button = document.getElementById('log-btn-text');
        if (button) {
            button.textContent = 'Log Meal';
        }
    }
}

/**
 * Clear the meal logging form
 */
function clearMealForm() {
    if (elements.mealName) elements.mealName.value = '';
    if (elements.mealCalories) elements.mealCalories.value = '';
    if (elements.mealProtein) elements.mealProtein.value = '';
    if (elements.mealCarbs) elements.mealCarbs.value = '';
    if (elements.mealFats) elements.mealFats.value = '';
}

// Load today's meals
async function loadTodaysMeals() {
    try {
        const response = await fetch('/meals/today');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.error) {
            console.error('Error loading meals:', data.error);
            return;
        }

        displayTodaysMeals(data.meals);
    } catch (error) {
        console.error('Error fetching today\'s meals:', error);
        // Continue with demo data if API fails
        loadDemoData();
    }
}

// Display today's meals
function displayTodaysMeals(meals) {
    try {
        const container = document.getElementById('meals-list');
        if (!container) return;
        
        if (!meals || meals.length === 0) {
            container.innerHTML = '<div style="text-align: center; color: #666; padding: 20px;">No meals logged today</div>';
            return;
        }

        container.innerHTML = '';
        
        meals.forEach(meal => {
            const mealItem = document.createElement('div');
            mealItem.className = 'meal-item';
            
            // Sanitize meal data
            const safeName = sanitizeInput(meal.meal_name || 'Unknown Meal');
            
            mealItem.innerHTML = `
                <div class="meal-info">
                    <div class="meal-name">${safeName}</div>
                    <div class="meal-details">
                        ${sanitizeInput(meal.meal_type || 'Unknown')} • 
                        P: ${Math.round(meal.protein_g || 0)}g • 
                        C: ${Math.round(meal.carbs_g || 0)}g • 
                        F: ${Math.round(meal.fats_g || 0)}g
                    </div>
                </div>
                <div class="meal-calories">${meal.calories || 0} kcal</div>
            `;
            container.appendChild(mealItem);
        });
    } catch (error) {
        console.error('Error displaying today\'s meals:', error);
    }
}

// Sample demo data function (for testing)
function loadDemoData() {
    try {
        // Simulate adding some meals
        const demoMeals = [
            { name: 'Chapati with Tea & Banana', calories: 280, protein: 8, carbs: 45, fats: 8, type: 'Breakfast' },
            { name: 'Roasted Groundnuts & Mango', calories: 320, protein: 12, carbs: 25, fats: 15, type: 'Snack' },
            { name: 'Ugali with Sukuma Wiki & Fish', calories: 550, protein: 25, carbs: 55, fats: 12, type: 'Lunch' }
        ];

        let totalCalories = 0;
        let totalProtein = 0;
        let totalCarbs = 0;
        let totalFats = 0;

        demoMeals.forEach(meal => {
            totalCalories += meal.calories;
            totalProtein += meal.protein;
            totalCarbs += meal.carbs;
            totalFats += meal.fats;
        });

        dailyProgress = {
            consumed: totalCalories,
            goal: 2000,
            macros: {
                protein: totalProtein,
                carbs: totalCarbs,
                fats: totalFats
            }
        };

        updateProgressDisplay();
        updateMacroChart();

        // Display demo meals
        const mealsContainer = document.getElementById('meals-list');
        if (mealsContainer) {
            mealsContainer.innerHTML = '';
            
            demoMeals.forEach(meal => {
                const mealItem = document.createElement('div');
                mealItem.className = 'meal-item';
                mealItem.innerHTML = `
                    <div class="meal-info">
                        <div class="meal-name">${sanitizeInput(meal.name)}</div>
                        <div class="meal-details">
                            ${sanitizeInput(meal.type)} • 
                            P: ${meal.protein}g • 
                            C: ${meal.carbs}g • 
                            F: ${meal.fats}g
                        </div>
                    </div>
                    <div class="meal-calories">${meal.calories} kcal</div>
                `;
                mealsContainer.appendChild(mealItem);
            });
        }
    } catch (error) {
        console.error('Error loading demo data:', error);
    }
}

/**
 * Initialize premium features and event listeners
 */
function initializePremiumFeatures() {
    try {
        // Add click event listeners to premium buttons
        const premiumButtons = document.querySelectorAll('.btn-premium');
        premiumButtons.forEach(button => {
            button.addEventListener('click', handlePremiumSignup);
        });

        // Add hover effects to pricing cards
        const pricingCards = document.querySelectorAll('.pricing-card');
        pricingCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = this.classList.contains('featured') 
                    ? 'scale(1.05) translateY(-5px)' 
                    : 'translateY(-5px)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = this.classList.contains('featured') 
                    ? 'scale(1.05)' 
                    : 'translateY(0)';
            });
        });

        console.log('Premium features initialized successfully');
    } catch (error) {
        console.error('Error initializing premium features:', error);
    }
}

/**
 * Handle premium signup button clicks
 * @param {Event} event - Click event
 */
function handlePremiumSignup(event) {
    try {
        const button = event.target;
        const originalText = button.textContent;
        
        // Show loading state
        button.textContent = 'Processing...';
        button.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            // Show success message
            showSuccessMessage(' Welcome to Premium! Starting your 7-day free trial...');
            
            // Reset button
            button.textContent = originalText;
            button.disabled = false;
            
            // Update button text to show trial status
            button.textContent = 'Trial Started!';
            button.style.background = 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)';
            
            // Simulate redirect to premium dashboard
            setTimeout(() => {
                showSuccessMessage('Redirecting to premium dashboard...');
            }, 2000);
            
        }, 1500);
        
    } catch (error) {
        console.error('Error handling premium signup:', error);
        showErrorMessage('Something went wrong. Please try again.');
        
        // Reset button on error
        const button = event.target;
        button.textContent = 'Start Free Trial';
        button.disabled = false;
    }
}