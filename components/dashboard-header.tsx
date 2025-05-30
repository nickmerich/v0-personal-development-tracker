import { TourTrigger } from "./tour-trigger"

export function DashboardHeader() {
  return (
    <header className="bg-white shadow">
      <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
          <div className="space-x-4">
            <TourTrigger variant="dropdown" className="text-forest-600 hover:text-forest-800" />
          </div>
        </div>
        <nav data-tour="main-navigation">{/* Add navigation links here */}</nav>
      </div>
    </header>
  )
}
