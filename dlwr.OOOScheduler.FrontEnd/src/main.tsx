import ReactDOM from 'react-dom/client'
import { app } from '@microsoft/teams-js';
import axios from 'axios'
import App, { IEventRange } from './components/App/App'
import { initializeIcons } from '@fluentui/react';
import { Dispatch, SetStateAction, createContext } from 'react';
import { IUserContext } from './Models/DbUser';
import { getSSOToken } from './services/AuthService';

export const UserContext = createContext<IUserContext|null>(null);
export const SizeContext = createContext<ScreenSize|null>(null);
export const EventRangeContext = createContext<{eventRange: IEventRange, setEventRange: React.Dispatch<React.SetStateAction<IEventRange>>} | null>(null);
export const IsNewContext = createContext<{isNew: boolean, setIsNew?: Dispatch<SetStateAction<boolean>>}>({isNew: false})
export const SetLoadingCtx = createContext<Dispatch<SetStateAction<boolean>> | null>(null)

//auth teams
app.initialize().then(v => console.info("teams")).catch(() => console.info("not teams"));
initializeIcons();
axios.defaults.baseURL = import.meta.env.VITE_API_URI;
axios.interceptors.request.use(
  async (response) => {
    if (!response.headers.Authorization)
      response.headers.Authorization = `Bearer ${await getSSOToken(true)}`;
    return response;
  },
  (err: any) => {
    return Promise.reject(err);
  }
);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <App />
)

export interface ScreenSize {
  width: number,
  height: number,
  isMobile: boolean
}