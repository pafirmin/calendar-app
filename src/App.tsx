import { BrowserRouter, Route, Routes } from "react-router-dom";
import Alerts from "./features/alerts/Alerts";
import Login from "./features/auth/Login";
import RequireAuth from "./features/auth/RequireAuth";
import FolderList from "./features/folders/FolderList";
import TasksList from "./features/tasks/TasksList";

function App() {
  return (
    <div>
      <Alerts />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <RequireAuth>
                <FolderList />
                <TasksList />
              </RequireAuth>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
