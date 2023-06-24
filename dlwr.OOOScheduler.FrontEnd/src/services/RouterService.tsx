import { createBrowserRouter } from 'react-router-dom';
import Settings from '../components/Settings/Settings';
import Dashboard from './../components/Dashboard/Dashboard';
import Main from './../components/Main';
import { DayView } from './../components/Dashboard/DayView/DayView';
import { Messages } from '../components/Messages/Messages';
import { EditPanel } from '../components/Edit/EditPanel';
import { ErrorComponent } from '../components/ErrorComponent';

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    errorElement: <ErrorComponent />,
    children: [
      {
        path: "/settings",
        element: <Settings />
      }, {
        path: "/",
        element: <Dashboard />,
      }, {
        path: "/messages",
        element: <Messages />
      },
      {
        path: "/day/:year?/:month?/:day?",
        element: <DayView />
      }
    ]
  }, {
    path: "error",
    element: <ErrorComponent />
  }

])