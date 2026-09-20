from playwright.sync_api import sync_playwright
import time
import os

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()
        
        # Load page and intercept console
        page.on("console", lambda msg: print(f"Browser Console: {msg.text}"))
        page.on("pageerror", lambda err: print(f"Browser JS Error: {err}"))

        page.goto("https://stu.fedu.vn/hocvien")
        page.wait_for_selector("#lockScreen:not([style*='display: none'])")
        
        # Inject old local storage data
        old_data = '''[{"id": "trang_truong_offline3", "notes": "Cũ rích rích rích"}]'''
        page.evaluate(f"localStorage.setItem('fedu_students_data_v8', '{old_data}')")
        
        # Reload
        page.reload()
        page.wait_for_selector("#lockScreen:not([style*='display: none'])")
        
        # Bấm PIN 0 0 7 0
        page.locator("button[onclick=\"pressPin('0')\"]").click()
        page.locator("button[onclick=\"pressPin('0')\"]").click()
        page.locator("button[onclick=\"pressPin('7')\"]").click()
        page.locator("button[onclick=\"pressPin('0')\"]").click()
        
        page.wait_for_selector("#lockScreen", state="hidden")
        
        # Wait for students to load
        time.sleep(2)
        
        # Open drawer
        page.evaluate('openDrawer("trang_truong_offline3")')
        page.wait_for_selector("#drawerBody")
        
        # Wait for the notes section specifically
        time.sleep(1)
        
        # Chụp ảnh ĐẦU DRAWER (vị trí phần Ghi Chú)
        drawer = page.locator("#detailDrawer .bg-white.w-full") # Sidebar container
        drawer.screenshot(path="/Users/vietmac/.gemini/antigravity/brain/9251dee1-fbd6-4ff1-8459-489624eec3f8/nghiemthu_vision_top.png")
        
        print("Đã chụp ảnh!")
        browser.close()

if __name__ == "__main__":
    run()
