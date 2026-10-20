const portfolioReturnKey = 'mandhagini-portfolio-return-home'

export function returnToPortfolioHome() {
  try {
    window.sessionStorage.setItem(portfolioReturnKey, 'true')
  } catch {
    // Navigation still works when browser storage is unavailable.
  }
  window.location.assign('/')
}

export function hasPendingPortfolioReturn(): boolean {
  try {
    return window.sessionStorage.getItem(portfolioReturnKey) === 'true'
  } catch {
    return false
  }
}

export function clearPendingPortfolioReturn() {
  try {
    window.sessionStorage.removeItem(portfolioReturnKey)
  } catch {
    // The marker is best-effort when browser storage is unavailable.
  }
}
