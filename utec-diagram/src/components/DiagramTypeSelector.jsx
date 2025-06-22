export default function DiagramTypeSelector({ type, setType }){
  return (
    <select
      className="form-select mb-3"
      value={type}
      onChange={e=>setType(e.target.value)}
    >
      <option value="aws">Arquitectura AWS</option>
      <option value="er">Diagrama E-R</option>
      <option value="json">Estructura JSON</option>
      <option value="mermaid">Mermaid</option>
    </select>
  )
}
