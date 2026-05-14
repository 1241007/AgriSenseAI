import os
import re

files_to_refactor = [
    "Frontend/src/app/components/Dashboard.tsx",
    "Frontend/src/app/components/FarmManagement.tsx",
    "Frontend/src/app/components/SoilAnalysis.tsx",
    "Frontend/src/app/components/FertilizerRecommendation.tsx",
    "Frontend/src/app/components/DiseaseDetection.tsx",
]

for file_path in files_to_refactor:
    if not os.path.exists(file_path):
        continue
        
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
        
    pattern_top = re.compile(r'return\s*\(\s*<div className="min-h-screen.*?<main([^>]*)>', re.DOTALL)
    
    match = pattern_top.search(content)
    if match:
        main_attrs = match.group(1)
        content = content[:match.start()] + f'return (\n    <main{main_attrs}>' + content[match.end():]
        
    pattern_bottom = re.compile(r'</main>\s*</div>\s*</div>\s*\);\s*}\s*$', re.DOTALL)
    content = pattern_bottom.sub('</main>\n  );\n}\n', content)
    
    content = re.sub(r'const\s*\[sidebarOpen,\s*setSidebarOpen\]\s*=\s*useState\(false\);\n?', '', content)
    content = re.sub(r'const\s*\[activeTab,\s*setActiveTab\]\s*=\s*useState\([^)]*\);\n?', '', content)
    content = re.sub(r'const\s*menuItems\s*=\s*\[.*?\];\n?', '', content, flags=re.DOTALL)
    
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)
        
print("Refactor complete")
