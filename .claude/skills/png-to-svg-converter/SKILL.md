---
name: png-to-svg-converter
description: Convert PNG/JPG images to SVG using FreeConvert API (no API key required). Use when user asks to "convert to SVG", "vectorize image", "PNG to SVG", "make image scalable", or needs raster-to-vector conversion.
---

# PNG to SVG Converter (FreeConvert API)

Converts raster images (PNG, JPG) to vector SVG format using the free FreeConvert API.

## Quick Usage

```python
import requests
import time
import os

def get_token_api() -> str | None:
    """Get guest token via API (fast, may be rate-limited)."""
    try:
        r = requests.get("https://api.freeconvert.com/v1/account/guest", timeout=10)
        if r.status_code == 200:
            return r.text.strip('"')
    except:
        pass
    return None

def get_token_playwright() -> str | None:
    """Fallback: Get token via Playwright headless browser."""
    try:
        from playwright.sync_api import sync_playwright
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            context = browser.new_context()
            page = context.new_page()

            # Intercept API response
            token = None
            def handle_response(response):
                nonlocal token
                if "/v1/account/guest" in response.url and response.status == 200:
                    token = response.text().strip('"')
            page.on("response", handle_response)

            page.goto("https://www.freeconvert.com/png-to-svg")
            page.wait_for_timeout(3000)  # Wait for token request
            browser.close()
            return token
    except Exception as e:
        print(f"Playwright fallback failed: {e}")
    return None

def get_token() -> str:
    """Get token with automatic fallback to Playwright."""
    token = get_token_api()
    if not token:
        print("API token failed, trying Playwright...")
        token = get_token_playwright()
    if not token:
        raise Exception("Could not get FreeConvert token")
    return token

def convert_to_svg(image_path: str, output_path: str) -> bool:
    """Convert PNG/JPG to SVG using FreeConvert API."""

    # 1. Get guest token (with Playwright fallback)
    token = get_token()
    headers = {"Authorization": f"Bearer {token}"}

    # 2. Create conversion job
    ext = os.path.splitext(image_path)[1].lstrip('.').lower()
    job_data = {
        "tasks": {
            "import": {"operation": "import/upload"},
            "convert": {
                "operation": "convert",
                "input": "import",
                "input_format": ext,
                "output_format": "svg",
                "options": {"color-mode": "color", "clustering": "stacked"}
            },
            "export-url": {"operation": "export/url", "input": "convert"}
        }
    }
    r = requests.post("https://api.freeconvert.com/v1/process/jobs",
                      headers=headers, json=job_data)
    job = r.json()
    job_id = job['id']

    # 3. Upload file
    import_task = next(t for t in job['tasks'] if t['operation'] == 'import/upload')
    upload_url = import_task['result']['form']['url']
    signature = import_task['result']['form']['parameters']['signature']

    with open(image_path, 'rb') as f:
        files = {'file': (os.path.basename(image_path), f)}
        requests.post(upload_url, data={'signature': signature}, files=files)

    # 4. Wait for completion
    for _ in range(60):
        time.sleep(2)
        r = requests.get(f"https://api.freeconvert.com/v1/process/jobs/{job_id}",
                        headers=headers)
        job_status = r.json()
        if job_status['status'] == 'completed':
            export_task = next(t for t in job_status['tasks']
                             if t['operation'] == 'export/url')
            download_url = export_task['result']['url']

            # 5. Download SVG
            r = requests.get(download_url)
            with open(output_path, 'wb') as f:
                f.write(r.content)
            return True
        elif job_status['status'] == 'failed':
            return False
    return False
```

## API Flow

```
1. GET  /v1/account/guest              -> JWT token (free, no signup)
2. POST /v1/process/jobs               -> Job ID + upload URL + signature
3. POST {upload_url}                   -> Upload file with signature
4. GET  /v1/process/jobs/{id}          -> Poll until status=completed
5. GET  {export_task.result.url}       -> Download converted SVG
```

## Conversion Options

```python
"options": {
    "color-mode": "color",        # "color" or "binary" (black/white)
    "clustering": "stacked",      # "stacked" or "cutout"
    "color-precision": 6,         # 1-8, higher = more colors
    "filter-speckle": 4,          # Remove noise (pixels)
    "curve-fitting": "spline",    # "spline", "polygon", or "none"
    "corner-threshold": 60,       # Degrees for corner detection
    "segment-length": 4,          # Path segment length
    "splice-threshold": 45        # Angle for path splicing
}
```

## Limits (Free Tier)

- 25 conversions/day
- Max 1GB file size
- 5 concurrent conversions
- Results expire after 24h

## Example Output

Input: `logo.png` (9KB raster)
Output: `logo.svg` (10KB vector, full colors preserved)

## Token Fallback (Playwright)

If the API token endpoint is rate-limited or blocked, Playwright headless browser is used as fallback:

```
1. API Request fails (429/403/timeout)
2. Playwright launches headless Chrome
3. Navigates to freeconvert.com/png-to-svg
4. Intercepts the /v1/account/guest response
5. Extracts fresh JWT token
6. Continues with normal API flow
```

**Requirements for fallback:**
```bash
pip install playwright
playwright install chromium
```

## Error Handling

- **403 on upload**: Server mismatch - use URL from job response
- **Timeout**: Large files need 2+ minutes, increase poll time
- **Status failed**: Check job details for error message
- **Token expired**: Automatic Playwright fallback kicks in
