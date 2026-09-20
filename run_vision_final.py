from playwright.sync_api import sync_playwright
import time

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()
        
        page.goto("https://stu.fedu.vn/hocvien")
        page.wait_for_selector("#lockScreen:not([style*='display: none'])")
        
        # Bấm PIN 0 0 7 0
        page.locator("button[onclick=\"pressPin('0')\"]").click()
        page.locator("button[onclick=\"pressPin('0')\"]").click()
        page.locator("button[onclick=\"pressPin('7')\"]").click()
        page.locator("button[onclick=\"pressPin('0')\"]").click()
        page.wait_for_selector("#lockScreen", state="hidden")
        
        time.sleep(2)
        
        page.evaluate('openDrawer("trang_truong_offline3")')
        page.wait_for_selector("#drawerBody")
        time.sleep(1)
        
        # Chụp ảnh ĐẦU DRAWER (vị trí phần Ghi Chú)
        drawer = page.locator("#detailDrawer .w-screen")
        drawer.screenshot(path="/Users/vietmac/.gemini/antigravity/brain/9251dee1-fbd6-4ff1-8459-489624eec3f8/nghiemthu_vision_top.png")
        
        print("Đã chụp ảnh!")
        browser.close()

if __name__ == "__main__":
    run()
