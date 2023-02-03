import React, { Children } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { 
  createBrowserRouter, 
  RouterProvider 
} from "react-router-dom";
import Root from "./routes/root";
import ErrorPage from "./error-page";
import Film from "./routes/film";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children:[
      {
        path: "user",
        element: <Film/>
      },
      {
        path: "film",
        element: <Film/>
      }
    ]
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
