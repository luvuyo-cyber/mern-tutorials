import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

const Home = () => {
  const navigate = useNavigate();
  const [cookies, removeCookie] = useCookies([]);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const verifyCookie = async () => {
      if (!cookies.token) {
        navigate("/login");
        return;
      }

      try {
        const { data } = await axios.post(
          "http://localhost:4000",
          {},
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (data.status) {
          setUsername(data.user);
          toast(`Hello ${data.user}`, {
            position: "top-right",
          });
        } else {
          removeCookie("token");
          navigate("/login");
        }
      } catch (error) {
        console.error("Verification error:", error);
        removeCookie("token");
        navigate("/login");
      }
    };

    verifyCookie();
  }, [cookies, navigate, removeCookie]);

  const Logout = async () => {
    try {
      // Clear the cookie
      removeCookie("token", { path: "/" });

      // Reset the username state
      setUsername("");

      // Navigate to login page
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
      // Force navigation even if there's an error
      navigate("/login", { replace: true });
    }
  };

  return (
    <>
      <div className="home_page">
        <h4>
          Welcome <span>{username}</span>
        </h4>
        <button onClick={Logout}>LOGOUT</button>
      </div>
      <ToastContainer />
    </>
  );
};

export default Home;
