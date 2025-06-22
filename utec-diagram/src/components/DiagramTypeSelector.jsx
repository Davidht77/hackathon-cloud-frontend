export default function DiagramTypeSelector({ type, setType }){
  return (
    <select
      className="form-select mb-3"
      value={type}
      onChange={e=>setType(e.target.value)}
      
    >
      <option value="aws">AWS architecture</option>
      <option value="er">E-R diagram</option>
      <option value="json">JSON structure</option>
    </select>
  )
}
