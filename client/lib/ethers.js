const ethers = require('ethers')

export function getEthersProvider() {
  // Check if MetaMask is installed and enabled
 
  if (typeof window !== 'undefined') {
    // Use MetaMask's injected provider
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    return provider
  } else {
    console.log('an error occurs')
  }
}