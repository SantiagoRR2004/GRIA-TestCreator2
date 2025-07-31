import re


def removeStandaloneBlocks(text: str) -> str:
    """
    Remove if (window.notStandalone) blocks with proper brace matching

    Args:
        - text (str): The input text containing potential standalone blocks.

    Returns:
        - str: The modified text with standalone blocks removed.
    """
    result = []
    i = 0
    while i < len(text):
        # Look for if (window.notStandalone)
        if_match = re.match(r"if\s*\(\s*window\.notStandalone\s*\)\s*\{", text[i:])
        if if_match:
            # Found a conditional, skip to after the matching closing brace
            brace_count = 1
            j = i + if_match.end()
            while j < len(text) and brace_count > 0:
                if text[j] == "{":
                    brace_count += 1
                elif text[j] == "}":
                    brace_count -= 1
                j += 1
            i = j  # Skip the entire conditional block
        else:
            # Check for single-line conditionals without braces
            single_match = re.match(
                r"if\s*\(\s*window\.notStandalone\s*\)\s*[^;\n{]+;?", text[i:]
            )
            if single_match:
                i += single_match.end()
            else:
                result.append(text[i])
                i += 1
    return "".join(result)


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
    # Delete everything inside window.notStandalone conditionals
    exam = removeStandaloneBlocks(exam)

    # Search for all <script src=*></script>
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
