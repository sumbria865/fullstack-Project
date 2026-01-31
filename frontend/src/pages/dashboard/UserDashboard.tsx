const UserDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-2">User Dashboard 🙌</h1>
      <p className="text-gray-500 mb-6">
        View your assigned tickets and recent activity.
      </p>

      <div className="grid sm:grid-cols-2 gap-6">
        <div className="bg-white shadow-lg rounded-xl p-5 hover:shadow-xl transition">
          <h3 className="text-gray-600 font-medium">My Tasks</h3>
          <p className="text-3xl font-bold mt-2">8</p>
        </div>

        <div className="bg-white shadow-lg rounded-xl p-5 hover:shadow-xl transition">
          <h3 className="text-gray-600 font-medium">Completed Tasks</h3>
          <p className="text-3xl font-bold mt-2">14</p>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
