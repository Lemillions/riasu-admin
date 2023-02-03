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
import User from "./routes/user";
import Product from "./routes/product";
import Genre from "./routes/genre";
import Channel from "./routes/channel";


const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children:[
      {
        path: "film",
        element: <Film />,
      },
      {
        path: "product",
        element: <Product />
      },
      {
        path: "channel",
        element: <Channel />
      },
      {
        path: "genre",
        element: <Genre />
      },
      {
        path: "user",
        element: <User />
      }
    ]
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
