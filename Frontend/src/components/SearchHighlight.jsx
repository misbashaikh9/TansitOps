function escapeRegex(input) {
  return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function SearchHighlight({ text, query }) {
  const source = String(text ?? '')
  const needle = query.trim()

  if (!needle) {
    return source
  }

  const matcher = new RegExp(`(${escapeRegex(needle)})`, 'ig')
  const parts = source.split(matcher)

  return parts.map((part, index) => {
    const isMatch = part.toLowerCase() === needle.toLowerCase()

    if (!isMatch) {
      return <span key={`${part}-${index}`}>{part}</span>
    }

    return (
      <mark key={`${part}-${index}`} className="search-highlight">
        {part}
      </mark>
    )
  })
}

export default SearchHighlight
