import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";
import { ThemeProvider } from "./contexts/ThemeContext";
import { SidebarProvider } from "./contexts/SidebarContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import { MainLayout } from "./components/layout/MainLayout";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="h-full font-sans antialiased bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <SidebarProvider>
        <NotificationProvider>
          <MainLayout>
            <Outlet />
          </MainLayout>
        </NotificationProvider>
      </SidebarProvider>
    </ThemeProvider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-violet-600 dark:text-violet-400 mb-4">
          {message}
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mb-8">{details}</p>
        {stack && (
          <pre className="text-left text-xs bg-slate-100 dark:bg-slate-800 p-4 rounded-lg overflow-auto max-w-2xl">
            <code>{stack}</code>
          </pre>
        )}
      </div>
    </main>
  );
}
