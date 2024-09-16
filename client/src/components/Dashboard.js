import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, Typography, Button, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom"; // Use useNavigate instead of useHistory

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [friends, setFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Use useNavigate instead of useHistory

  const token = localStorage.getItem("token");

  const headers = {
    headers: {
      "x-auth-token": token,
    },
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch recommended users
        const recommendedUsersRes = await axios.get(
          "http://localhost:3001/api/friends/recommendedUsers",
          headers
        );

        // Fetch friends
        const friendsRes = await axios.get(
          "http://localhost:3001/api/friends/allFriends",
          headers
        );

        // Fetch friend requests
        const requestsRes = await axios.get(
          `http://localhost:3001/api/friends/requests`,
          headers
        );

        setUsers(recommendedUsersRes.data);
        setFriends(friendsRes.data);
        setFriendRequests(requestsRes.data);
      } catch (error) {
        setError("Failed to load data");
      }
    };

    fetchData();
  }, []);

  const viewProfile = (userId) => {
    navigate(`/profile/${userId}`); // Use navigate instead of history.push
  };

  const sendFriendRequest = async (id) => {
    try {
      await axios.post(
        `http://localhost:3001/api/friends/request/${id}`,
        {},
        headers
      );
    } catch (error) {
      setError("Failed to send friend request");
    }
  };

  const acceptFriendRequest = async (id) => {
    try {
      await axios.post(
        `http://localhost:3001/api/friends/accept/${id}`,
        {},
        headers
      );

      // Filter out the accepted friend from friendRequests
      setFriendRequests(friendRequests.filter((req) => req._id !== id));

      // Fetch the updated friends list
      const friendsRes = await axios.get(
        "http://localhost:3001/api/friends/allFriends",
        headers
      );
      setFriends(friendsRes.data); // Update friends list after accepting the request
    } catch (error) {
      setError("Failed to accept friend request");
    }
  };

  const unfriend = async (friendId) => {
    try {
      await axios.post(
        `http://localhost:3001/api/friends/unfriend/${friendId}`,
        {},
        headers
      );
      // Remove the friend from the list in the UI
      setFriends(friends.filter((friend) => friend._id !== friendId));
    } catch (error) {
      setError("Failed to unfriend");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Typography variant="h4" className="text-center mb-6">
        Dashboard
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} md={3}>
          <Typography variant="h5" className="mb-4">
            Recommended Users
          </Typography>
          {users.map((user) => (
            <Card key={user._id} className="mb-4">
              <CardContent>
                <Typography>{user.username}</Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => sendFriendRequest(user._id)}
                >
                  Add Friend
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => viewProfile(user._id)} // Button to view profile
                >
                  View Profile
                </Button>
              </CardContent>
            </Card>
          ))}
        </Grid>

        <Grid item xs={12} md={4}>
          <Typography variant="h5" className="mb-4">
            Friends
          </Typography>
          {friends.map((friend) => (
            <Card key={friend._id} className="mb-4">
              <CardContent>
                <Typography>{friend.username}</Typography>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => viewProfile(friend._id)} // Button to view profile
                >
                  View Profile
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => unfriend(friend._id)} // Button to unfriend
                >
                  Unfriend
                </Button>
              </CardContent>
            </Card>
          ))}
        </Grid>

        <Grid item xs={12} md={4}>
          <Typography variant="h5" className="mb-4">
            Friend Requests
          </Typography>
          {friendRequests.map((request) => (
            <Card key={request._id} className="mb-4">
              <CardContent>
                <Typography>{request.username}</Typography>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => acceptFriendRequest(request._id)}
                >
                  Accept Request
                </Button>
              </CardContent>
            </Card>
          ))}
        </Grid>
      </Grid>

      {error && (
        <Typography color="error" className="mt-4">
          {error}
        </Typography>
      )}
    </div>
  );
};

export default Dashboard;
