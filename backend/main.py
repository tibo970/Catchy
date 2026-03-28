from fastapi import FastAPI, Query
from typing import List, Optional
from scrapers import aggregate_results
import uvicorn

app = FastAPI(title="Catchy API", description="Price Comparison & Prediction Engine")

@app.get("/")
async def root():
    return {"message": "Catchy API is running"}

@app.get("/search")
async def search_products(q: str = Query(..., description="The product to search for")):
    results = await aggregate_results(q)
    return {
        "query": q,
        "results": results
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
