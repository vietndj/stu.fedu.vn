from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()
        
        page.goto("https://stu.fedu.vn/hocvien.html")
        page.wait_for_selector("#lockScreen:not([style*='display: none'])")
        
        # Inject old local storage data for Trang Trương (trang_truong_offline3)
        old_data = '''[{"id": "trang_truong_offline3", "notes": "Cũ rích rích rích"}]'''
        page.evaluate(f"localStorage.setItem('fedu_students_data_v8', '{old_data}')")
        
        # Reload so loadStudents runs and merges
        page.reload()
        page.wait_for_selector("#lockScreen:not([style*='display: none'])")
        
        # Bấm PIN 0 0 7 0
        page.locator("button[onclick=\"pressPin('0')\"]").click()
        page.locator("button[onclick=\"pressPin('0')\"]").click()
        page.locator("button[onclick=\"pressPin('7')\"]").click()
        page.locator("button[onclick=\"pressPin('0')\"]").click()
        
        page.wait_for_selector("#lockScreen", state="hidden")
        
        # Open drawer
        page.evaluate('openDrawer("trang_truong_offline3")')
        page.wait_for_selector("#drawerBody")
        
        # Lấy text
        text = page.locator("#drawerBody").inner_text()
        print("--- DRAWER CONTENT ---")
        print(text)
        print("----------------------")
        
        if "Cũ rích rích rích" in text and "PHẢN HỒI TRÀ ĐÁ" in text:
            print("✅ MERGE THÀNH CÔNG")
        else:
            print("❌ MERGE THẤT BẠI")
            
        browser.close()

if __name__ == "__main__":
    run()
