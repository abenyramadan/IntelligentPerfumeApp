from fastapi import FastAPI

print("🚀 Starting minimal FastAPI app...")

app = FastAPI(title="Minimal Test")

@app.get("/")
def read_root():
    return {"message": "Minimal app working"}

@app.get("/recommendations/test")
def test_recommendations():
    return {"message": "Recommendations endpoint working"}

if __name__ == "__main__":
    import uvicorn
    print("Starting server...")
    uvicorn.run(app, host="127.0.0.1", port=8002)
    print("Server started successfully!")
