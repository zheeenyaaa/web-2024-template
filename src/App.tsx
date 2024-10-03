import { useState, useEffect } from "react";
import useLocalStorageState from "use-local-storage-state";
import styled from "styled-components";
import {
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import RestaurantIcon from "@mui/icons-material/Restaurant";

interface Ingredient {
  name: string;
  amount: number;
  unit: string;
}

interface Recipe {
  id: number;
  name: string;
  ingredients: Ingredient[];
  instructions: string;
  servings: number;
}

const AppContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
  background: linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%);
  min-height: 100vh;
  color: white;
`;

const StyledButton = styled(Button)`
  && {
    margin-top: 1rem;
    background-color: #4CAF50;
    color: white;
    &:hover {
      background-color: #45a049;
    }
  }
`;

const StyledList = styled(List)`
  && {
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    padding: 1rem;
  }
`;

const StyledListItem = styled(ListItem)`
  && {
    margin-bottom: 1rem;
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 5px;
  }
`;

function App() {
  const [recipes, setRecipes] = useLocalStorageState<Recipe[]>("recipes", {
    defaultValue: [],
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [newServings, setNewServings] = useState<number>(0);

  useEffect(() => {
    if (recipes.length === 0) {
      const boilerplateRecipes: Recipe[] = [
        // ... (add 5 boilerplate recipes here)
      ];
      setRecipes(boilerplateRecipes);
    }
  }, [recipes, setRecipes]);

  const handleAddRecipe = () => {
    setEditingRecipe({
      id: Date.now(),
      name: "",
      ingredients: [],
      instructions: "",
      servings: 1,
    });
    setOpenDialog(true);
  };

  const handleDeleteRecipe = (id: number) => {
    setRecipes(recipes.filter((recipe) => recipe.id !== id));
  };

  const handleEditRecipe = (recipe: Recipe) => {
    setEditingRecipe({ ...recipe });
    setOpenDialog(true);
  };

  const handleSaveRecipe = () => {
    if (editingRecipe) {
      setRecipes(
        recipes.map((r) => (r.id === editingRecipe.id ? editingRecipe : r))
      );
    } else {
      setRecipes([...recipes, { ...editingRecipe!, id: Date.now() }]);
    }
    setOpenDialog(false);
    setEditingRecipe(null);
  };

  const handleRecalculateServings = (recipe: Recipe) => {
    setEditingRecipe(recipe);
    setNewServings(recipe.servings);
    setOpenDialog(true);
  };

  const updateServings = () => {
    if (editingRecipe && newServings > 0) {
      const factor = newServings / editingRecipe.servings;
      const updatedRecipe = {
        ...editingRecipe,
        servings: newServings,
        ingredients: editingRecipe.ingredients.map((ing) => ({
          ...ing,
          amount: ing.amount * factor,
        })),
      };
      setRecipes(
        recipes.map((r) => (r.id === updatedRecipe.id ? updatedRecipe : r))
      );
      setOpenDialog(false);
      setEditingRecipe(null);
    }
  };

  return (
    <AppContainer>
      <Typography variant="h4" component="h1" gutterBottom>
        Funky Recipe Book
      </Typography>
      <StyledButton
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleAddRecipe}
        startIcon={<RestaurantIcon />}
      >
        Add New Recipe
      </StyledButton>
      <StyledList>
        {recipes.map((recipe) => (
          <StyledListItem key={recipe.id}>
            <ListItemText
              primary={recipe.name}
              secondary={`Servings: ${recipe.servings}`}
            />
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                aria-label="edit"
                onClick={() => handleEditRecipe(recipe)}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={() => handleDeleteRecipe(recipe.id)}
              >
                <DeleteIcon />
              </IconButton>
              <Button
                onClick={() => handleRecalculateServings(recipe)}
                color="secondary"
              >
                Recalculate
              </Button>
            </ListItemSecondaryAction>
          </StyledListItem>
        ))}
      </StyledList>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>
          {editingRecipe?.id ? "Edit Recipe" : "Add New Recipe"}
        </DialogTitle>
        <DialogContent>
          {/* Add form fields for recipe editing */}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveRecipe}>Save</Button>
        </DialogActions>
      </Dialog>
    </AppContainer>
  );
}

export default App;