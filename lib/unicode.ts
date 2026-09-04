// Unicode bold/italic converters for LinkedIn-compatible text

const boldMap: Record<string, string> = {
  'A': '𝗔', 'B': '𝗕', 'C': '𝗖', 'D': '𝗗', 'E': '𝗘', 'F': '𝗙', 'G': '𝗚', 'H': '𝗛', 'I': '𝗜',
  'J': '𝗝', 'K': '𝗞', 'L': '𝗟', 'M': '𝗠', 'N': '𝗡', 'O': '𝗢', 'P': '𝗣', 'Q': '𝗤', 'R': '𝗥',
  'S': '𝗦', 'T': '𝗧', 'U': '𝗨', 'V': '𝗩', 'W': '𝗪', 'X': '𝗫', 'Y': '𝗬', 'Z': '𝗭',
  'a': '𝗮', 'b': '𝗯', 'c': '𝗰', 'd': '𝗱', 'e': '𝗲', 'f': '𝗳', 'g': '𝗴', 'h': '𝗵', 'i': '𝗶',
  'j': '𝗷', 'k': '𝗸', 'l': '𝗹', 'm': '𝗺', 'n': '𝗻', 'o': '𝗼', 'p': '𝗽', 'q': '𝗾', 'r': '𝗿',
  's': '𝘀', 't': '𝘁', 'u': '𝘂', 'v': '𝘃', 'w': '𝘄', 'x': '𝘅', 'y': '𝘆', 'z': '𝘇',
  '0': '𝟬', '1': '𝟭', '2': '𝟮', '3': '𝟯', '4': '𝟰', '5': '𝟱', '6': '𝟲', '7': '𝟳', '8': '𝟴', '9': '𝟵',
};

const italicMap: Record<string, string> = {
  'A': '𝘈', 'B': '𝘉', 'C': '𝘊', 'D': '𝘋', 'E': '𝘌', 'F': '𝘍', 'G': '𝘎', 'H': '𝘏', 'I': '𝘐',
  'J': '𝘑', 'K': '𝘒', 'L': '𝘓', 'M': '𝘔', 'N': '𝘕', 'O': '𝘖', 'P': '𝘗', 'Q': '𝘘', 'R': '𝘙',
  'S': '𝘚', 'T': '𝘛', 'U': '𝘜', 'V': '𝘝', 'W': '𝘞', 'X': '𝘟', 'Y': '𝘠', 'Z': '𝘡',
  'a': '𝘢', 'b': '𝘣', 'c': '𝘤', 'd': '𝘥', 'e': '𝘦', 'f': '𝘧', 'g': '𝘨', 'h': '𝘩', 'i': '𝘪',
  'j': '𝘫', 'k': '𝘬', 'l': '𝘭', 'm': '𝘮', 'n': '𝘯', 'o': '𝘰', 'p': '𝘱', 'q': '𝘲', 'r': '𝘳',
  's': '𝘴', 't': '𝘵', 'u': '𝘶', 'v': '𝘷', 'w': '𝘸', 'x': '𝘹', 'y': '𝘺', 'z': '𝘻',
};

export function toBold(text: string): string {
  return text.split('').map(char => boldMap[char] || char).join('');
}

export function toItalic(text: string): string {
  return text.split('').map(char => italicMap[char] || char).join('');
}

// Convert markdown-style formatting to Unicode
// **bold** -> 𝗯𝗼𝗹𝗱
// *italic* -> 𝘪𝘵𝘢𝘭𝘪𝘤
export function convertMarkdownToUnicode(text: string): string {
  // Convert bold first (** **)
  let result = text.replace(/\*\*([^*]+)\*\*/g, (_, content) => toBold(content));
  // Then convert italic (* *)
  result = result.replace(/\*([^*]+)\*/g, (_, content) => toItalic(content));

  // Clean up unwanted formatting that LinkedIn doesn't support
  result = cleanupForLinkedIn(result);

  return result;
}

// Remove formatting that doesn't work on LinkedIn
export function cleanupForLinkedIn(text: string): string {
  let result = text;

  // Remove horizontal separators (---, ___, ***)
  result = result.replace(/^[-_*]{3,}$/gm, '');

  // Remove code blocks (``` ... ```)
  result = result.replace(/```[\s\S]*?```/g, (match) => {
    // Extract content inside code block and return as plain text
    return match.replace(/```/g, '').trim();
  });

  // Remove inline backticks but keep the content
  result = result.replace(/`([^`]+)`/g, '$1');

  // Clean up multiple blank lines (more than 2) to just 2
  result = result.replace(/\n{3,}/g, '\n\n');

  // Remove leading/trailing whitespace from lines
  result = result.split('\n').map(line => line.trim()).join('\n');

  // Remove empty lines at start and end
  result = result.trim();

  return result;
}
