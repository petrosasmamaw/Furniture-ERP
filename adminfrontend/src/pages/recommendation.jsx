import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Recommendation = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const product = state?.product;

  const [loading, setLoading] = useState(false);
  const [aiText, setAiText] = useState("");
  const [error, setError] = useState(null);

  const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

  useEffect(() => {
    if (!product) return;
    if (!API_KEY) {
      setError("API Key is missing. Check your .env file.");
      return;
    }

    const getAIRecommendation = async () => {
      try {
        setLoading(true);
        setError(null);

        // Define the prompt for Gemini 3 Flash
        const prompt = `
          You are an expert product advisor.
          Analyze the product below and provide a detailed report including:
          1. Recommendation
          2. Uses
          3. Advantages
          4. Disadvantages

          Product Information:
          Title: ${product.title}
          Price: $${product.price}
          Rating: ${product.rating?.rate || product.rating}
          Description: ${product.description}
        `;

        // CORRECT ENDPOINT: v1beta with gemini-3-flash-preview
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${API_KEY}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              contents: [
                {
                  parts: [{ text: prompt }],
                },
              ],
              // Optional: Gemini 3 specific configuration for 'thinking'
              generationConfig: {
                thinkingConfig: {
                  includeThoughts: false, // Set to true if you want to see reasoning steps
                  thinkingLevel: "MEDIUM" // Options: MINIMAL, LOW, MEDIUM, HIGH
                }
              }
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          // Log detailed error to console to help debugging
          console.error("API Error Response:", errorData);
          throw new Error(errorData.error?.message || `HTTP Error ${response.status}`);
        }

        const data = await response.json();

        // Extracting text from the candidates
        const result =
          data?.candidates?.[0]?.content?.parts?.[0]?.text ||
          "AI could not generate a recommendation.";

        setAiText(result);
      } catch (err) {
        console.error("AI Fetch Error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getAIRecommendation();
  }, [product, API_KEY]);

  if (!product) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h2>No product selected</h2>
        <button className="btn btn-primary" onClick={() => navigate("/products")}>
          Back to Products
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: "40px", maxWidth: "900px", margin: "auto" }}>
      <button 
        className="btn btn-secondary" 
        onClick={() => navigate("/products")}
        style={{ marginBottom: "20px" }}
      >
        ← Back
      </button>

      <h1 style={{ borderBottom: "2px solid #eee", paddingBottom: "10px" }}>AI Recommendation</h1>

      <div style={{ background: "#fcfcfc", padding: "20px", borderRadius: "10px", margin: "20px 0" }}>
        <h3>{product.title}</h3>
        <p><strong>Price:</strong> ${product.price}</p>
        <p><strong>Rating:</strong> ⭐ {product.rating?.rate || product.rating}</p>
        <p><strong>Description:</strong> {product.description}</p>
      </div>

      <hr />

      {loading ? (
        <div style={{ textAlign: "center", padding: "30px" }}>
          <p>Analyzing product with Gemini 3 Flash...</p>
        </div>
      ) : error ? (
        <div style={{ color: "red", background: "#fee", padding: "15px", borderRadius: "5px" }}>
          <strong>Error:</strong> {error}
        </div>
      ) : (
        <div style={{ marginTop: "20px", whiteSpace: "pre-wrap", lineHeight: "1.6" }}>
          {aiText}
        </div>
      )}
    </div>
  );
};

export default Recommendation;