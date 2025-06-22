export async function fetchFromGitHub(rawUrl){
  const res = await fetch(rawUrl)
  if(!res.ok) throw new Error('Fetch falló')
  return res.text()
}
