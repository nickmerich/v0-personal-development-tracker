```tsx file="app/dashboard/page.tsx"
[v0-no-op-code-block-prefix]import { authService } from "@/lib/auth-service"

const DashboardPage = async () => {
  const session = await authService.getSession();

  return (
    <div>
      <h1>Dashboard</h1>
      {session ? (
        <p>Welcome, {session?.user?.name}!</p>
      ) : (
        <p>Please sign in.</p>
      )}
    </div>
  );
};

export default DashboardPage;
