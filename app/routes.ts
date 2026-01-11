import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  // Dashboard
  index("routes/_index.tsx"),
  
  // Projects
  route("projects", "routes/projects/_index.tsx"),
  route("projects/:projectId", "routes/projects/$projectId.tsx"),
  
  // Jobs
  route("jobs", "routes/jobs/_index.tsx"),
  route("jobs/create", "routes/jobs/create.tsx"),
  
  // Test Cases
  route("test-cases", "routes/test-cases.tsx"),
  
  // Policies
  route("policies", "routes/policies.tsx"),
  
  // Reports
  route("reports", "routes/reports.tsx"),
  
  // Billing
  route("billing", "routes/billing.tsx"),
  
  // Settings
  route("settings", "routes/settings.tsx"),
  
  // Admin Routes
  route("admin/test-cases", "routes/admin/test-cases.tsx"),
  route("admin/policies", "routes/admin/policies.tsx"),
  route("admin/tenants", "routes/admin/tenants.tsx"),
  route("admin/analytics", "routes/admin/analytics.tsx"),
] satisfies RouteConfig;
