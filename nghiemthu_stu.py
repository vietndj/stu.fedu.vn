import os
import time
import subprocess
from playwright.sync_api import sync_playwright

def run():
    artifacts_dir = "/Users/vietmac/.gemini/antigravity/brain/9251dee1-fbd6-4ff1-8459-489624eec3f8"
    
    # Start local server
    server = subprocess.Popen(["python3", "-m", "http.server", "8123"], cwd="/Users/vietmac/Documents/CODE/stu.fedu.vn")
    time.sleep(2)

    with sync_playwright() as p:
        browser = p.chromium.launch(channel="chrome", headless=True)
        context = browser.new_context(viewport={"width": 1280, "height": 900})
        page = context.new_page()

        # Nghĩa (Auto-synced)
        page.goto("http://localhost:8123/hocvien.html?id=ao_trung_nghia", wait_until="networkidle")
        time.sleep(2)
        page.screenshot(path=os.path.join(artifacts_dir, "nghiemthu_stu_nghia.png"), full_page=True)

        # Trang (Merged)
        page.goto("http://localhost:8123/hocvien.html?id=trang_truong_offline3", wait_until="networkidle")
        time.sleep(2)
        page.screenshot(path=os.path.join(artifacts_dir, "nghiemthu_stu_trang.png"), full_page=True)

        browser.close()
    
    server.terminate()
    print("Done NGHIEM THU STU")

if __name__ == "__main__":
    run()
