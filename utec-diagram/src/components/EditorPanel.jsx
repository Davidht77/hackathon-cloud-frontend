import Editor from '@monaco-editor/react'

export default function EditorPanel({ code, setCode }){
  return (
    <div style={{ height: 300, border: '1px solid #ccc' }}>
      <Editor
        defaultLanguage="plaintext"
        value={code}
        onChange={v=>setCode(v||'')}
      />
    </div>
  )
}
