'use client';

interface SystemOverviewProps {
  user: any;
}

export function SystemOverview({ user }: SystemOverviewProps) {
  const stats = [
    {
      title: 'Total Suppliers',
      value: '145',
      change: '+12%',
      color: 'bg-blue-100 border-blue-200',
      textColor: 'text-blue-800',
    },
    {
      title: 'Pending Approvals',
      value: '23',
      change: '+5',
      color: 'bg-yellow-100 border-yellow-200',
      textColor: 'text-yellow-800',
    },
    {
      title: 'Active Products',
      value: '1,234',
      change: '+8%',
      color: 'bg-green-100 border-green-200',
      textColor: 'text-green-800',
    },
    {
      title: 'Monthly Growth',
      value: '24%',
      change: '+3%',
      color: 'bg-purple-100 border-purple-200',
      textColor: 'text-purple-800',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">
          Welcome back, {user?.firstName}!
        </h2>
        <p className="text-gray-600">
          Here's what's happening with your platform today.
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className={`p-6 rounded-lg border ${stat.color}`}>
            <div>
              <p className="text-sm text-gray-600">{stat.title}</p>
              <div className="flex items-baseline mt-2">
                <p className="text-2xl font-semibold">{stat.value}</p>
                <span className={`ml-2 text-sm ${stat.textColor}`}>
                  {stat.change}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="p-6 rounded-lg border bg-white">
        <h3 className="font-semibold text-lg mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => {/* link suppliers */ }}
            className="p-4 border rounded-lg hover:bg-gray-50 transition-colors text-left"
          >
            <div className="font-medium">Review Suppliers</div>
            <div className="text-sm text-gray-600 mt-1">
              5 pending applications
            </div>
          </button>
          <button
            onClick={() => {/* link admins */ }}
            className="p-4 border rounded-lg hover:bg-gray-50 transition-colors text-left"
          >
            <div className="font-medium">Manage Admins</div>
            <div className="text-sm text-gray-600 mt-1">
              Add or remove administrators
            </div>
          </button>
          <button
            onClick={() => {/* link to settings */ }}
            className="p-4 border rounded-lg hover:bg-gray-50 transition-colors text-left"
          >
            <div className="font-medium">System Settings</div>
            <div className="text-sm text-gray-600 mt-1">
              Configure platform settings
            </div>
          </button>
        </div>
      </div>

      {/* Additional statistics or notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent activity */}
        <div className="p-6 rounded-lg border bg-white">
          <h3 className="font-semibold text-lg mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {[
              { action: 'New supplier registration', time: '10 min ago' },
              { action: 'Product added by Supplier X', time: '1 hour ago' },
              { action: 'Admin role updated', time: '2 hours ago' },
              { action: 'System backup completed', time: '5 hours ago' },
            ].map((item, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b last:border-0">
                <span className="text-sm">{item.action}</span>
                <span className="text-xs text-gray-500">{item.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* System status */}
        <div className="p-6 rounded-lg border bg-white">
          <h3 className="font-semibold text-lg mb-4">System Status</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm">Server Load</span>
                <span className="text-sm font-medium">42%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '42%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm">Database Usage</span>
                <span className="text-sm font-medium">78%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '78%' }}></div>
              </div>
            </div>
            <div className="pt-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Uptime:</span>
                <span className="text-sm font-medium text-green-600">99.8%</span>
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-sm">Active Sessions:</span>
                <span className="text-sm font-medium">247</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}