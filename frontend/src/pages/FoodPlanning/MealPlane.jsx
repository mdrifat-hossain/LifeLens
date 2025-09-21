
import MealSideBarMenu from './MealSideBarMenu';
import GroceryList from './GroceryList';
import { Outlet } from 'react-router-dom';

function MealPlan() {

  return (
    <div className="min-h-screen bg-light-background dark:bg-dark-background">
      {/* <Header /> */}
      <div className="px-6 py-5 flex justify-evenly">
        <MealSideBarMenu />
        <Outlet />
      </div>
    </div>
  );
}

export default MealPlan;
