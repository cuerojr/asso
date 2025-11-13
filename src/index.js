import "./assets/css/vendor/bootstrap.min.css";
import "./assets/css/vendor/bootstrap.rtl.only.min.css";
import "react-circular-progressbar/dist/styles.css";
import "react-perfect-scrollbar/dist/css/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-table/react-table.css";
import 'react-image-lightbox/style.css';
import "video.js/dist/video-js.css";
import { themeColorStorageKey } from "./constants/defaultValues";

import "./assets/css/sass/themes/gogo.dark.blue.scss";

const color = 'dark.blue';
 /* (isMultiColorActive||isDarkSwitchActive ) && localStorage.getItem(themeColorStorageKey)
    ? localStorage.getItem(themeColorStorageKey)
    : defaultColor;*/

localStorage.setItem(themeColorStorageKey, color);

import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Title,
  CategoryScale,
  LinearScale
} from 'chart.js';

// Registrar elementos globalmente
ChartJS.register(ArcElement, BarElement, PointElement, LineElement, Tooltip, Legend, Title, CategoryScale, LinearScale);

/* @vite-ignore */
import './AppRenderer';
