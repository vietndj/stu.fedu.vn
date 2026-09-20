from playwright.sync_api import sync_playwright
import time
import os

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()
        
        page.goto("https://stu.fedu.vn/hocvien")
        
        print("Waiting for lockscreen...")
        page.wait_for_selector("#lockScreen")
        
        # Bấm PIN 0 0 7 0
        print("Entering PIN...")
        page.locator("button[onclick=\"pressPin('0')\"]").click()
        page.locator("button[onclick=\"pressPin('0')\"]").click()
        page.locator("button[onclick=\"pressPin('7')\"]").click()
        page.locator("button[onclick=\"pressPin('0')\"]").click()
        
        print("Waiting for unlock...")
        page.wait_for_selector("#lockScreen", state="hidden")
        print("Unlocked!")
        
        print("Waiting 3s for fetch to complete...")
        time.sleep(3)
        
        print("Searching for Trang Truong card...")
        # Lấy student ID thực tế từ thẻ DOM thay vì hardcode
        # Vì có thể sau khi fix, data từ fetch có ID khác hoặc gì đó
        card = page.locator("h3:has-text('Trang Trương')").first
        if card.is_visible():
            print("Found card!")
            card.click()
        else:
            print("Card not found!")
            
        time.sleep(1)
        
        print("Taking screenshot...")
        drawer = page.locator("#detailDrawer .bg-white.w-full") # Sidebar container
        drawer.screenshot(path="/Users/vietmac/.gemini/antigravity/brain/9251dee1-fbd6-4ff1-8459-489624eec3f8/nghiemthu_vision_top.png")
        
        print("Đã chụp ảnh thành công!")
        browser.close()

if __name__ == "__main__":
    run()
