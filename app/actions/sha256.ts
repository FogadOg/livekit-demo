export async function sha256(message: string) {
    if(message !== null) {
      const msgBuffer = new TextEncoder().encode(message);                    
      const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

      return hashHex
    }

    return message
}