from pypdf import PdfReader

try:
    reader = PdfReader('Perfil.pdf')
    text = ""
    for page in reader.pages:
        text += page.extract_text() + "\n"
    
    with open('perfil_texto.txt', 'w', encoding='utf-8') as f:
        f.write(text)
    print("Text extracted successfully to perfil_texto.txt")
except Exception as e:
    print("Error:", e)
