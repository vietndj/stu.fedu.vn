from playwright.sync_api import sync_playwright
import time

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()
        
        page.goto("https://stu.fedu.vn/hocvien")
        page.wait_for_selector("#lockScreen:not([style*='display: none'])")
        
        page.locator("button[onclick=\"pressPin('0')\"]").click()
        page.locator("button[onclick=\"pressPin('0')\"]").click()
        page.locator("button[onclick=\"pressPin('7')\"]").click()
        page.locator("button[onclick=\"pressPin('0')\"]").click()
        page.wait_for_selector("#lockScreen", state="hidden")
        
        time.sleep(3)
        
        card = page.locator("h3:has-text('Trang Trương')").first
        if card.is_visible():
            card.click()
            time.sleep(2)
            # Chụp ảnh toàn màn hình sau khi mở drawer
            page.screenshot(path="/Users/vietmac/.gemini/antigravity/brain/9251dee1-fbd6-4ff1-8459-489624eec3f8/nghiemthu_vision_full.png")
            print("Đã chụp ảnh!")
        else:
            print("Không tìm thấy thẻ!")
            
        browser.close()

if __name__ == "__main__":
    run()
