const existingAccounts = () => {
    return JSON.parse(localStorage.getItem('dropAccounts')) || []
}

export const setAccountToLocalStorage = (accountInfo) => {
    const accounts = existingAccounts();
    const filtered = accounts.filter(acc => acc?.email !== accountInfo?.email);
    const updatedAccounts = [accountInfo, ...filtered];
    return localStorage.setItem('dropAccounts', JSON.stringify(updatedAccounts));
}

export const getAccountsFromLocalStorage = () => {
    const accounts = localStorage.getItem('dropAccounts');
    try {
        return accounts ? JSON.parse(accounts) : [];
    } catch (err) {
        console.error('Failed to parse logged accounts from localStorage:', err);
        return [];
    }
};