import React, { useEffect, useState } from "react";
import axios from "axios";
import { DashboardContent } from "src/layouts/dashboard";

interface UserData {
  email: string;
  full_name: string;
  giftpoints: number;
  nb_trashthrown: number;
  image_url: string;
}

const ProfileCard: React.FC = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [updatedUserData, setUpdatedUserData] = useState<UserData | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null); // Add state for selected image

  useEffect(() => {
    const fullName = localStorage.getItem("full_name");
    if (!fullName) {
      setError("No user name found in localStorage");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://smartbin-backend.onrender.com/api/user/name/${encodeURIComponent(fullName)}`
        );
        setUserData(response.data);
        setUpdatedUserData(response.data); // Initialize updatedUserData with the fetched data
        setError(null);
      } catch (err) {
        setError("Failed to fetch user data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdatedUserData((prevData) => ({
      ...prevData!,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const handleSaveClick = async () => {
    if (updatedUserData) {
      try {
        const formData = new FormData();
        formData.append("full_name", updatedUserData.full_name || "");
        formData.append("email", updatedUserData.email || "");
        if (selectedImage) {
          formData.append("image", selectedImage); // Append the selected image
        }

        // Make the PUT request to update the user data
        await axios.put(
          `https://smartbin-backend.onrender.com/apii/user/update`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        // Set updated user data and reset state
        setUserData(updatedUserData);
        setIsEditing(false);
        setError(null);
      } catch (err) {
        setError("Failed to save user data");
      }
    }
  };

  if (loading) {
    return <p style={styles.statusMessage}>Loading...</p>;
  }

  if (error) {
    return <p style={{ ...styles.statusMessage, ...styles.error }}>{error}</p>;
  }

  return (
		<DashboardContent maxWidth="xl" sx={{
		  backgroundImage: 'url(/assets/bg_dashboard.jpg)',
		  backgroundSize: 'cover', 
		  backgroundPosition: 'center',  
		  backgroundRepeat: 'no-repeat',
		
		}}>
     <div style={styles.cardContainer}>
        <header style={styles.header}>
          <img
            src={userData?.image_url || "/assets/icons/navbar/profile_ic.svg"}
            alt={userData?.full_name}
            style={styles.profileImg}
          />
        </header>
        {isEditing ? (
          <div style={styles.editForm}>
            <input
              type="text"
              name="full_name"
              value={updatedUserData?.full_name || ""}
              onChange={handleChange}
              style={styles.input}
            />
            <input
              type="email"
              name="email"
              value={updatedUserData?.email || ""}
              onChange={handleChange}
              style={styles.input}
            />
            <input
              type="password"
              name="password"
              placeholder="New Password"
              onChange={handleChange}
              style={styles.input}
            />
            {/* File input for changing profile image */}
            <input
              type="file"
              onChange={handleImageChange}
              style={styles.input}
            />
            <button onClick={handleSaveClick} style={styles.saveButton} type="button">
              Save Changes
            </button>
          </div>
        ) : (
          <>
            <h1 style={styles.boldText}>
              {userData?.full_name}{" "}
              <span style={styles.normalText}>({userData?.email})</span>
            </h1>
            <div style={styles.socialContainer}>
              <div style={styles.stat}>
                <h1 style={styles.statValue}>{userData?.giftpoints}</h1>
                <h2 style={styles.statLabel}>Gift Points</h2>
              </div>
              <div style={styles.stat}>
                <h1 style={styles.statValue}>{userData?.nb_trashthrown}</h1>
                <h2 style={styles.statLabel}>Trash Thrown</h2>
              </div>
            </div>
            <button onClick={handleEditClick} style={styles.editButton} type="button">
              Edit Profile
            </button>
          </>
        )}
      </div>
    </DashboardContent>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
	cardContainer: {
	  backgroundColor: "#ffffff",
	  minWidth: "350px",
	  maxWidth: "450px",
	  borderRadius: "16px",
	  boxShadow: "0px 10px 25px rgba(0, 102, 255, 0.4)",
	  overflow: "hidden",
	  display: "flex",
	  flexDirection: "column",
	  alignItems: "center",
	  padding: "20px",
	  margin: "20px auto",
	},
	header: {
	  background: "linear-gradient(135deg, #003366, #0066ff)",
	  textAlign: "center",
	  padding: "20px",
	  width: "100%",
	  borderRadius: "8px 8px 0 0",
	},
	profileImg: {
	  width: "100px",
	  height: "100px",
	  border: "4px solid white",
	  borderRadius: "50%",
	  marginTop: "10px",
	},
	boldText: {
	  fontWeight: "bold",
	  fontSize: "1.4rem",
	  textAlign: "center",
	  padding: "12px 20px 5px 20px",
	  color: "#003366",
	},
	normalText: {
	  fontWeight: "normal",
	  fontSize: "1rem",
	  color: "#666",
	  display: "block",
	  marginTop: "4px",
	},
	socialContainer: {
	  display: "flex",
	  justifyContent: "space-between",
	  padding: "20px",
	  backgroundColor: "#f7f7f7",
	  borderTop: "1px solid #e0e0e0",
	  width: "100%",
	  borderRadius: "0 0 8px 8px",
	  marginTop: "10px",
	},
	stat: {
	  textAlign: "center",
	},
	statValue: {
	  fontSize: "1.8rem",
	  color: "#003366",
	  fontWeight: "bold",
	},
	statLabel: {
	  fontSize: "0.9rem",
	  color: "#666",
	},
	statusMessage: {
	  textAlign: "center",
	  color: "#003366",
	  fontSize: "1.1rem",
	  padding: "10px",
	},
	error: {
	  color: "red",
	},
	editForm: {
	  display: "flex",
	  flexDirection: "column",
	  gap: "15px",
	  width: "100%",
	  marginTop: "20px",
	},
	input: {
	  padding: "12px 15px",
	  fontSize: "1rem",
	  borderRadius: "8px",
	  border: "1px solid #ccc",
	  backgroundColor: "#fafafa",
	},
	saveButton: {
	  padding: "12px 20px",
	  backgroundColor: "#0066ff",
	  color: "#fff",
	  border: "none",
	  borderRadius: "8px",
	  cursor: "pointer",
	  fontSize: "1rem",
	  marginTop: "10px",
	},
	editButton: {
	  padding: "12px 20px",
	  backgroundColor: "#003366",
	  color: "#fff",
	  border: "none",
	  borderRadius: "8px",
	  cursor: "pointer",
	  fontSize: "1rem",
	  marginTop: "10px",
	},
  };
  

export default ProfileCard;
