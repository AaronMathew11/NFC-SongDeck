import React, { useState, useEffect } from "react";
import moment from "moment";

const Roster = ({ list, removeVideoFromList }) => {
  const [roster, setRoster] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const filteredDays = roster.filter((day) => {
    const formattedDate = moment(day.Date, "Do MMMM YYYY"); // Parse date
    return (
      formattedDate.isAfter(moment()) && // Filter dates after today
      (
        day.Date.toLowerCase().includes(searchQuery.toLowerCase()) ||
        day["Worship Lead/ PPT"].toLowerCase().includes(searchQuery.toLowerCase()) ||
        day["Acoustic Guitar"].toLowerCase().includes(searchQuery.toLowerCase()) ||
        day["Bass Guitar"].toLowerCase().includes(searchQuery.toLowerCase()) ||
        day["Keyboard"].toLowerCase().includes(searchQuery.toLowerCase()) ||
        day["Drums"].toLowerCase().includes(searchQuery.toLowerCase()) ||
        day["Song Posting"].toLowerCase().includes(searchQuery.toLowerCase()) ||
        day["Back-up Singers"].toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  });

  useEffect(() => {
    async function fetchRoster() {
      try {
        const response = await fetch("https://nfcsongdeckbackend-et89zztk.b4a.run/api/getRoster", {
          method: "get",
          headers: new Headers({
            "ngrok-skip-browser-warning": "69420",
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setRoster(data.data);
      } catch (error) {
        console.error("Error fetching roster:", error.message);
      } finally {
        setLoading(false);
      }
    }
    fetchRoster();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen w-full">
      <h1 className="text-3xl font-bold pt-8 pl-10 text-left text-black">Roster</h1>
      <p class="text-xs mt-2 text-left mb-6 pl-10">View roles and responsibilites with ease</p>

      <div className="px-8">
        <input
          type="text"
          placeholder="Search the Roster..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="mb-6 p-3 rounded-lg border-2 border-gray-300 w-full shadow focus:ring-2 focus:ring-black"
        />
      </div>

      {loading ? (
        <div className="text-center mt-10">
          <div className="loader border-t-4 border-blue-500 w-8 h-8 rounded-full mx-auto animate-spin"></div>
          <p className="mt-4 text-gray-500">Loading roster...</p>
        </div>
      ) : roster.length === 0 ? (
        <p className="text-sm text-left ml-10 text-gray-600">Roster is not available.</p>
      ) : (
        <div className="pb-20 px-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredDays.map((day) => (
            <div
              key={day._id}
              className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow"
            >
              <p className="text-left text-lg truncate font-bold text-black">{day.Date}</p>
              <div className="mt-4">
                <p className="text-left text-sm truncate">
                  <span className="font-semibold">Lead:</span> {day["Worship Lead/ PPT"]}
                </p>
                <p className="text-left text-sm truncate mt-1">
                  <span className="font-semibold">Acoustic:</span> {day["Acoustic Guitar"]}
                </p>
                <p className="text-left text-sm truncate mt-1">
                  <span className="font-semibold">Bass:</span> {day["Bass Guitar"]}
                </p>
                <p className="text-left text-sm truncate mt-1">
                  <span className="font-semibold">Keyboard:</span> {day["Keyboard"]}
                </p>
                <p className="text-left text-sm truncate mt-1">
                  <span className="font-semibold">Drums:</span> {day["Drums"]}
                </p>
                <p className="text-left text-sm truncate mt-1">
                  <span className="font-semibold">Back-up Singers:</span> {day["Back-up Singers"]}
                </p>
                <p className="text-left text-sm truncate mt-1">
                  <span className="font-semibold">Song Posting:</span> {day["Song Posting"]}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Roster;
