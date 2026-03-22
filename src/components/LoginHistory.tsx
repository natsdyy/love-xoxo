import { useState, useEffect } from 'react';

interface LoginRecord {
  id: string;
  username: string;
  displayName: string;
  role: 'admin' | 'owner';
  loginTime: any;
  loginDate: string;
  loginTimeFormatted: string;
  device: string;
}

// This component is optional - use it to view login records in your admin dashboard
export default function LoginHistory() {
  const [loginRecords] = useState<LoginRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLoginRecords = async () => {
      try {
        setLoading(true);
        
        // You can fetch login records for all users or filter by specific username
        // For now, fetching all login records would require a different approach
        // since we're storing them in the 'users' collection

        // If you want to fetch all users' login history, you can fetch from the users collection
      } catch (error) {
        console.error('Error fetching login records:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLoginRecords();
  }, []);

  if (loading) {
    return <div className="p-4">Loading login records...</div>;
  }

  return (
    <div className="space-y-8 p-6">
      {/* All Login Records */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Login History</h2>
        {loginRecords.length === 0 ? (
          <p className="text-gray-500">No login records found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2 text-left">Username</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Display Name</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Role</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Login Time</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Device</th>
                </tr>
              </thead>
              <tbody>
                {loginRecords.map(record => (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">{record.username}</td>
                    <td className="border border-gray-300 px-4 py-2">{record.displayName}</td>
                    <td className="border border-gray-300 px-4 py-2 capitalize">{record.role}</td>
                    <td className="border border-gray-300 px-4 py-2">{record.loginTimeFormatted}</td>
                    <td className="border border-gray-300 px-4 py-2 text-xs truncate">{record.device}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
