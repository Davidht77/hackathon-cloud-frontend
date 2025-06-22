export default function FileUploader({ onLoad }){
  const handleFile = e => {
    const f = e.target.files[0]
    if(!f) return
    const rd = new FileReader()
    rd.onload = ()=> onLoad(rd.result)
    rd.readAsText(f)
  }

  return (
    <input
      type="file"
      accept=".txt"
      className="form-control form-control-sm"
      onChange={handleFile}
    />
  )
}
