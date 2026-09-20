import json

with open("students.json", "r") as f:
    students = json.load(f)

for st in students:
    survey = st.get("post_course_survey")
    if survey:
        journey = survey.get("journeyStory") or "Không có"
        feedback = survey.get("feedbackAll") or "Không có"
        
        feedback_text = f"\n\n[PHẢN HỒI TRÀ ĐÁ]\n- Hành trình: {journey}\n- Góp ý: {feedback}"
        
        if st.get("notes"):
            if "[PHẢN HỒI TRÀ ĐÁ]" not in st["notes"]:
                st["notes"] += feedback_text
        else:
            st["notes"] = feedback_text.strip()

with open("students.json", "w") as f:
    json.dump(students, f, indent=2, ensure_ascii=False)
