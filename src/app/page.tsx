export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to Admin Panel</h1>
        <p className="text-muted-foreground mb-8">Manage your application from here</p>
        <div className="space-x-4">
          <a 
            href="/dashboard" 
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Go to Dashboard
          </a>
          <a 
            href="/login" 
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
          >
            Login
          </a>
        </div>
      </div>
    </div>
  );
}