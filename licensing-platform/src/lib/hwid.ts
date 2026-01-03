// This is a client-side HWID utility that would be used in the actual software
// that needs to be licensed. In a real implementation, this would be
// platform-specific code (Windows, macOS, Linux) to gather hardware information.

// For demonstration purposes, we'll create a mock implementation

export interface HWIDComponents {
  mac?: string;
  disk?: string;
  cpu?: string;
  motherboard?: string;
  [key: string]: string | undefined;
}

export async function getHWIDComponents(): Promise<HWIDComponents> {
  // In a real implementation, this would call platform-specific APIs
  // to gather hardware information. For this demo, we'll return mock data.
  
  return {
    mac: '00:1A:2B:3C:4D:5E', // Mock MAC address
    disk: 'WDC123456789',     // Mock disk serial
    cpu: 'Intel-i7-12345',    // Mock CPU ID
    motherboard: 'MB-12345'  // Mock motherboard serial
  };
}

export async function getHWIDHash(): Promise<string> {
  const components = await getHWIDComponents();
  
  // In a real implementation, this would be handled by the server
  // to ensure consistency. This is just for demonstration.
  const componentsString = Object.entries(components)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}:${value}`)
    .join('|');
  
  // Simple hash function for demo purposes
  let hash = 0;
  for (let i = 0; i < componentsString.length; i++) {
    const char = componentsString.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  return `hwid-${Math.abs(hash).toString(16)}`;
}