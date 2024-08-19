




export function parseMetadata(metadata: string){
  try{
    return JSON.parse(metadata)
  } catch {
    return {}
  }
}



