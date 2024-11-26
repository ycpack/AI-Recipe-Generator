import React from "react"
import IngredientsList from "./components/IngredientsList"
import ClaudeRecipe from "./components/ClaudeRecipe"
import { getRecipeFromMistral } from "./ai"

export default function Main() {
    const [ingredients, setIngredients] = React.useState([])
    const [recipe, setRecipe] = React.useState(null)
    const [loading, setLoading] = React.useState(false);

    async function getRecipe() {
        
        setLoading(true);  
        try {
            const recipeMarkdown = await getRecipeFromMistral(ingredients);
            setRecipe(recipeMarkdown);
        } catch (error) {
            console.error("Error fetching recipe:", error);
            setRecipe("Failed to load recipe.");
        } finally {
            setLoading(false);
        }
    }


    function addIngredient(event) {
        event.preventDefault(); 
        const formData = new FormData(event.target);
        const newIngredient = formData.get("ingredient");
        setIngredients(prevIngredients => [...prevIngredients, newIngredient]);
        event.target.reset();
    }

    return (
        <main>
            <form onSubmit={addIngredient} className="add-ingredient-form">
                <input
                    type="text"
                    placeholder="e.g. oregano"
                    aria-label="Add ingredient"
                    name="ingredient"
                />
                <button>Add ingredient</button>
            </form>
                {ingredients.length<4 && <p className="note">Please add atleast four ingredients</p>}
            {ingredients.length > 0 &&
                <IngredientsList
                    loading={loading}
                    ingredients={ingredients}
                    getRecipe={getRecipe}
                />
            }

            
                {recipe && <ClaudeRecipe recipe={recipe} />}
           
        </main>
    )
}