from dotenv import load_dotenv
import os
import base64
import uuid
from io import BytesIO
from pydantic import BaseModel
from fastapi import HTTPException
import cloudinary
import cloudinary.uploader

from google import genai
from google.genai import types  # kept for parity with official example
from PIL import Image

load_dotenv()

if os.getenv("GOOGLE_API_KEY"):
    del os.environ["GOOGLE_API_KEY"]

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))


cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
)

import time
import random

def safe_generate_image(data: str, retries=3):
    model = "gemini-2.5-flash-image"
    for attempt in range(retries):
        try:
            response = client.models.generate_content(model=model, contents=[data])
            return response
        except Exception as e:
            if attempt < retries - 1:
                wait = (2 ** attempt) + random.random()
                print(f"⚠️ Retry {attempt+1} for '{data}' after {wait:.1f}s due to {e}")
                time.sleep(wait)
            else:
                raise e


def generate_image(data: str):
    model: str = "gemini-2.5-flash-image"
    try:
        # 1) Generate content using the official pattern you provided
        response = safe_generate_image(data)


        if not response or not getattr(response, "candidates", None):
            raise HTTPException(status_code=500, detail="No response from Gemini")

        candidate = response.candidates[0]
        if not getattr(candidate, "content", None) or not getattr(candidate.content, "parts", None):
            raise HTTPException(status_code=500, detail="No content parts returned")

        image_urls = []
        text_parts = []

        # 2) Walk through parts (text or inline_data which contains the image bytes)
        for part in candidate.content.parts:
            # plain text (if any)
            if getattr(part, "text", None):
                text_parts.append(part.text)

            # inline image data
            elif getattr(part, "inline_data", None):
                raw = part.inline_data.data

                # raw could be bytes or base64 string depending on SDK/response
                if isinstance(raw, str):
                    # try to decode base64 string
                    try:
                        image_bytes = base64.b64decode(raw)
                    except Exception:
                        # fallback: treat as utf-8 bytes
                        image_bytes = raw.encode("utf-8")
                else:
                    # assume bytes-like
                    image_bytes = raw

                # open with PIL and re-serialize as PNG (robust)
                img = Image.open(BytesIO(image_bytes))
                out = BytesIO()
                img.save(out, format="PNG")
                out.seek(0)
                png_bytes = out.read()

                # convert to base64 data URI — Cloudinary accepts this
                b64 = base64.b64encode(png_bytes).decode("utf-8")
                data_uri = f"data:image/png;base64,{b64}"

                # 3) Upload to Cloudinary
                public_id = f"gemini_{uuid.uuid4().hex}"
                upload_result = cloudinary.uploader.upload(
                    data_uri,
                    folder="gemini_generated",
                    public_id=public_id,
                    resource_type="image"
                )

                secure_url = upload_result.get("secure_url")
                if not secure_url:
                    raise HTTPException(status_code=500, detail="Cloudinary upload failed")
                image_urls.append(secure_url)

        return image_urls

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Generation/upload failed: {e}")