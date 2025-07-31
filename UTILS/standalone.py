import re


def makeStandalone(exam: str, replaceables: dict) -> str:
    """
    Converts an exam HTML string to a standalone version by embedding scripts
    and replacing parameters with provided values.

    Args:
        - exam (str): The HTML content of the exam.
        - replaceables (dict): A dictionary containing keys with the variable name
            and values to replace in the HTML content.

    Returns:
        - str: The modified HTML content with embedded scripts and replaced parameters.
    """
    # First search for all <script src=*></script>
    script_pattern = re.compile(r'<script\s+src="([^"]+)"\s*></script>', re.IGNORECASE)
    scripts = script_pattern.findall(exam)

    # Replace each script tag with an embedded script tag
    for script in scripts:
        with open(script, "r", encoding="utf-8") as f:
            script_content = f.read()
        embedded_script = f"<script>\n{script_content}\n</script>"
        exam = exam.replace(f'<script src="{script}"></script>', embedded_script)

    # Now replace the parameters
    for key, value in replaceables.items():
        # General pattern to match both quoted and unquoted values
        general_pattern = re.compile(rf'{key}:\s*("?)([^",\s}}]+)\1')
        match = general_pattern.search(exam)

        if match:
            hasQuotes = bool(match.group(1))  # Check if quotes were found
            if hasQuotes:
                # Replace with quotes
                exam = general_pattern.sub(f'{key}: "{value}"', exam)
            else:
                # Replace without quotes
                exam = general_pattern.sub(f"{key}: {value}", exam)

    return exam
