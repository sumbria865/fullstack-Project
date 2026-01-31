const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-2">Admin Dashboard 👑</h1>
      <p className="text-gray-500 mb-6">
        Overview of system performance and management tools.
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white shadow-lg rounded-xl p-5 hover:shadow-xl transition">
          <h3 className="text-gray-600 font-medium">Total Users</h3>
          <p className="text-3xl font-bold mt-2">120</p>
        </div>

        <div className="bg-white shadow-lg rounded-xl p-5 hover:shadow-xl transition">
          <h3 className="text-gray-600 font-medium">Active Projects</h3>
          <p className="text-3xl font-bold mt-2">15</p>
        </div>

        <div className="bg-white shadow-lg rounded-xl p-5 hover:shadow-xl transition">
          <h3 className="text-gray-600 font-medium">Tickets Resolved</h3>
          <p className="text-3xl font-bold mt-2">320</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
