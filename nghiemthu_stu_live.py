import os
import time
from playwright.sync_api import sync_playwright

def run():
    artifacts_dir = "/Users/vietmac/.gemini/antigravity/brain/9251dee1-fbd6-4ff1-8459-489624eec3f8"
    
    with sync_playwright() as p:
        browser = p.chromium.launch(channel="chrome", headless=True)
        context = browser.new_context(viewport={"width": 1280, "height": 900})
        page = context.new_page()

        # Nghĩa (Auto-synced)
        page.goto("https://stu.fedu.vn/hocvien.html?id=trang_truong_offline3", wait_until="networkidle")
        time.sleep(2)
        page.screenshot(path=os.path.join(artifacts_dir, "nghiemthu_stu_live_trang.png"), full_page=True)

        browser.close()
    
    print("Done NGHIEM THU LIVE STU")

if __name__ == "__main__":
    run()
