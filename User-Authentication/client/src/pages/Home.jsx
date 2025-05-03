import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import Navbar from "../components/Navbar";

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
      removeCookie("token", { path: "/" });
      setUsername("");
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
      navigate("/login", { replace: true });
    }
  };

  return (
    <>
      <Navbar />
      <div className="container py-5">
        {/* Hero Section */}
        <div className="row align-items-center mb-5">
          <div className="col-lg-6">
            <h1 className="display-4 fw-bold mb-3">Welcome to Our Store</h1>
            <p className="lead text-muted mb-4">
              Discover amazing products at great prices. Shop the latest trends
              and find your perfect match.
            </p>
            <button className="btn btn-primary btn-lg">Start Shopping</button>
          </div>
          <div className="col-lg-6">
            <img
              src="https://images.unsplash.com/photo-1607082348824-0a96f47a3f98?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
              alt="Shopping"
              className="img-fluid rounded-3 shadow"
            />
          </div>
        </div>

        {/* Featured Products */}
        <div className="row g-4 mb-5">
          <div className="col-12">
            <h2 className="h3 fw-bold mb-4">Featured Products</h2>
          </div>
          <div className="col-md-4">
            <div className="card h-100">
              <div className="position-relative">
                <img
                  src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                  className="card-img-top"
                  alt="Premium Headphones"
                />
                <span className="position-absolute top-0 end-0 bg-danger text-white px-2 py-1 rounded-3 m-2">
                  -20%
                </span>
              </div>
              <div className="card-body">
                <h5 className="card-title">Premium Headphones</h5>
                <p className="card-text text-muted">
                  Experience crystal clear sound with our premium wireless
                  headphones.
                </p>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <span className="h5 mb-0">$199.99</span>
                    <span className="text-decoration-line-through text-muted ms-2">
                      $249.99
                    </span>
                  </div>
                  <button className="btn btn-primary">Add to Cart</button>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card h-100">
              <img
                src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                className="card-img-top"
                alt="Smart Watch"
              />
              <div className="card-body">
                <h5 className="card-title">Smart Watch</h5>
                <p className="card-text text-muted">
                  Stay connected and track your fitness with our latest smart
                  watch.
                </p>
                <div className="d-flex justify-content-between align-items-center">
                  <span className="h5 mb-0">$149.99</span>
                  <button className="btn btn-primary">Add to Cart</button>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card h-100">
              <img
                src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                className="card-img-top"
                alt="Wireless Earbuds"
              />
              <div className="card-body">
                <h5 className="card-title">Wireless Earbuds</h5>
                <p className="card-text text-muted">
                  Compact and powerful wireless earbuds for your daily commute.
                </p>
                <div className="d-flex justify-content-between align-items-center">
                  <span className="h5 mb-0">$99.99</span>
                  <button className="btn btn-primary">Add to Cart</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Special Offers Section */}
        <div className="row">
          <div className="col-12">
            <div className="special-offer">
              <div className="card-body">
                <div className="row align-items-center">
                  <div className="col-md-8">
                    <h2 className="text-white">Special Offer!</h2>
                    <p className="text-white-50 mb-0">
                      Get 20% off on your first purchase. Use code: WELCOME20
                    </p>
                  </div>
                  <div className="col-md-4 text-md-end">
                    <button className="btn btn-light btn-lg">Shop Now</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
