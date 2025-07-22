import os
import openai

def generate_react_native_code(prompt):
    openai.api_key = os.getenv('OPENAI_API_KEY')
    system_prompt = (
        "You are a senior mobile UI developer. Generate a clean, production-ready React Native screen using functional components and Tailwind CSS (via nativewind). "
        "Do not use class components. Avoid verbose code. Based on the following user prompt, return only the complete code file with proper imports, styles, and structure. "
        "Do not include explanations, comments, or web components like <div>."
    )
    try:
        response = openai.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": prompt}
            ],
            max_tokens=1800,
            temperature=0.2,
        )
        code = response.choices[0].message.content
        # Basic validation
        if 'div' in code or 'class ' in code or 'explanation' in code.lower():
            raise ValueError('Output contains forbidden elements or explanations.')
        if 'import' not in code or 'export default' not in code:
            raise ValueError('Output missing required imports or export.')
        return code
    except Exception as e:
        return {'error': str(e)} 